# Registration, Razorpay and Google Sheets setup

The form is implemented at http://localhost:3001/#registration. The confirmed fee is INR 2,499 (249900 paise).

## Payment flow

1. The visitor enters name, email, mobile and location.
2. The server validates the fields and creates a Razorpay order with the server-configured price. Attendee details are attached to the order with a tamper-verification signature.
3. Razorpay Standard Checkout handles payment details. Card information never passes through this website.
4. The browser verifies the checkout signature and checks the payment with Razorpay before showing a payment confirmation.
5. Independently, Razorpay sends `payment.captured` to `/api/payments/webhook`.
6. The server verifies the raw webhook signature, fetches the payment and original order from Razorpay, and checks their amount, currency, registration source and signed attendee details.
7. Only a captured payment is sent to the Google Sheets receiver. The receiver locks the sheet, checks payment/order IDs, and appends one paid-registration row. Failed or abandoned payments are not added.

The browser never writes to Sheets. Razorpay retries deliveries when the receiver fails and this endpoint returns a non-2xx response. Monitor webhook deliveries in Razorpay; Sheets is a registration report, while Razorpay remains the payment record.

## 1. Prepare your Google Sheet

Sheet supplied by the organiser:
https://docs.google.com/spreadsheets/d/1IzSfW4TbFEkvc7v_iXp6KWenhmFQ0_KG7YZPlyLRnFE/edit

1. Open the sheet and create a new, empty tab named **Registrations**. This keeps existing content separate.
2. Select **Extensions > Apps Script**.
3. Paste the contents of `integrations/google-sheets.gs` into the editor.
4. In **Project Settings > Script properties**, set:
   - `SPREADSHEET_ID`: `1IzSfW4TbFEkvc7v_iXp6KWenhmFQ0_KG7YZPlyLRnFE`
   - `SHEET_NAME`: `Registrations`
   - `SHARED_SECRET`: a long random secret. Use the same value in the website environment.
5. **Deploy > New deployment > Web app**. Execute as yourself; allow access for **Anyone** so the website server can call it. Access to your sheet itself can remain private. The receiver requires the shared secret to write.
6. Authorise access and copy the deployment URL ending in `/exec`.
7. After script changes, update the deployment to a new version; saving alone does not update an existing deployed version.

The receiver creates this header row on the first successful payment:
Payment ID | Order ID | Paid At (UTC) | Name | Email | Mobile | City | Amount | Currency | Status | Event

## 2. Configure the website

Use `.env.local` locally, and your host's environment settings when deployed. Do not put secrets in chat, client components, source control, or any `NEXT_PUBLIC_` setting.

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3001
PAYMENT_AMOUNT_PAISE=249900
RAZORPAY_KEY_ID=your_test_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
RAZORPAY_WEBHOOK_SECRET=your_separate_webhook_secret
GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT/exec
GOOGLE_SHEETS_SHARED_SECRET=the_same_secret_as_script_properties
```

Start with **Test Mode** in Razorpay. Generate keys from your account's API-key settings. The webhook secret is a separate secret you choose when configuring the webhook.

The form displays the configured amount, and remains unavailable until all required settings are present. Restart `npm run dev` after changing environment settings. No Razorpay or Google credentials have been added to this repository.

## 3. Configure the Razorpay webhook

Set the webhook URL to:
`https://YOUR-PUBLIC-DOMAIN/api/payments/webhook`

Subscribe to **payment.captured** and use the same `RAZORPAY_WEBHOOK_SECRET` configured on the website. Enable automatic payment capture in your Razorpay account. Authorised-only payments are not added to Sheets.

Razorpay cannot reach `localhost` directly. For local end-to-end Test Mode verification, use a public HTTPS tunnel to port **3001** or deploy to a staging HTTPS domain. Set `NEXT_PUBLIC_SITE_URL` to the public origin and open the form on that origin. Configure the same public origin in the Razorpay webhook URL.

Deploy this as a Node-capable Next.js app; static-only hosting cannot run the payment routes.

## 4. End-to-end acceptance test

1. Confirm the form and Razorpay checkout both show INR 2,499.
2. Use Razorpay Test Mode to complete a successful test payment.
3. Verify the form shows a verified payment reference.
4. Check the webhook delivery is successful and the Registrations tab has exactly one PAID row with matching attendee details, INR 2499 and the same payment/order IDs.
5. Resend the same webhook: no additional row should appear.
6. Cancel checkout and test a failed payment: neither should create a paid-registration row.
7. Temporarily make the Sheet receiver unavailable, resend a valid captured event, and confirm a non-2xx delivery response. Restore it and retry: exactly one row should appear.
8. Test a wrong webhook signature: the endpoint must reject it without writing to Sheets.

Automated checks: `node --test scripts/payments.test.mjs scripts/registration.test.mjs`, `npm run lint`, `npm run build`, and `npm run verify`. Tests use mocked payment/Sheets services; they do not prove your external account configuration. Real Test Mode checkout and Sheet delivery still require your credentials and public webhook URL.

## 5. Go live

After the end-to-end Test Mode checks pass, configure Live Mode keys and a Live Mode webhook, set the real HTTPS origin, and redeploy. Keep test rows separate from real registrations. Confirm account activation, capture settings, and the final fee in your Razorpay account before accepting live payments.

## Official references

- Razorpay Standard Checkout: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/
- Webhook verification and retries: https://razorpay.com/docs/webhooks/validate-test/
- Google Apps Script web apps: https://developers.google.com/apps-script/guides/web
- LockService: https://developers.google.com/apps-script/reference/lock/lock-service
