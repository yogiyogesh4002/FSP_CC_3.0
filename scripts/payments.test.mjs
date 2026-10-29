import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { createOrder, processWebhook, verifyPayment, parseAttendee, matchesSignature, checkOrigin, paymentSettings } from '../src/lib/payments.ts';

const attendee = { name: 'Test Attendee', email: 'test@example.com', phone: '9876543210', city: 'Chennai' };
const sign = (body, secret) => createHmac('sha256', secret).update(body).digest('hex');
const env = { RAZORPAY_KEY_ID: 'rzp_test_example', RAZORPAY_KEY_SECRET: 'test-key-secret', RAZORPAY_WEBHOOK_SECRET: 'test-webhook-secret', PAYMENT_AMOUNT_PAISE: '249900', GOOGLE_SHEETS_WEB_APP_URL: 'https://script.google.com/macros/s/example/exec', GOOGLE_SHEETS_SHARED_SECRET: 'test-sheet-secret', NEXT_PUBLIC_SITE_URL: 'http://localhost:3001' };
Object.assign(process.env, env);

await test('registration payment integration', async t => {
  const originalFetch = globalThis.fetch;
  let order, payment, delivered, writes, sheetFails;
  globalThis.fetch = async (url, options = {}) => {
    url = String(url);
    if (url.endsWith('/v1/orders') && options.method === 'POST') {
      order = { ...JSON.parse(options.body), id: 'order_Test123' };
      return Response.json(order);
    }
    if (url.includes('/v1/orders/')) return Response.json(order);
    if (url.includes('/v1/payments/')) return Response.json(payment);
    if (url.startsWith('https://script.google.com/')) {
      delivered = JSON.parse(options.body);
      if (sheetFails) return Response.json({ ok: false });
      writes++;
      return Response.json({ ok: true });
    }
    throw Error('Unexpected external request');
  };
  try {
    await t.test('validates fields and rejects malformed input', () => {
      assert.deepEqual(parseAttendee({ ...attendee, email: ' TEST@example.com ' }), attendee);
      for (const input of [null, {}, { ...attendee, email: 'bad' }, { ...attendee, phone: '123' }, { ...attendee, name: 'a\nb' }]) assert.throws(() => parseAttendee(input));
    });
    await t.test('missing configuration disables checkout', () => {
      delete process.env.RAZORPAY_KEY_SECRET;
      assert.equal(paymentSettings().ready, false);
      process.env.RAZORPAY_KEY_SECRET = env.RAZORPAY_KEY_SECRET;
    });
    await t.test('uses server fee and signed attendee notes; ignores client amount', async () => {
      const result = await createOrder({ ...attendee, amount: 1 });
      assert.equal(result.amount, 249900);
      assert.equal(order.notes.name, attendee.name);
      assert.match(order.notes.proof, /^[a-f0-9]{64}$/);
      assert.equal(result.keyId, env.RAZORPAY_KEY_ID);
      assert.ok(!JSON.stringify(result).includes(env.RAZORPAY_KEY_SECRET));
      payment = { id: 'pay_Test123', order_id: order.id, amount: 249900, currency: 'INR', status: 'captured', captured: true, created_at: 1800000000 };
      writes = 0;
    });
    await t.test('rejects invalid and altered webhook signatures', async () => {
      assert.equal(matchesSignature('x', 'bad', env.RAZORPAY_WEBHOOK_SECRET), false);
      await assert.rejects(() => processWebhook('{}', sign('different', env.RAZORPAY_WEBHOOK_SECRET)), /signature/);
      assert.equal(writes, 0);
    });
    const raw = JSON.stringify({ event: 'payment.captured', payload: { payment: { entity: { id: 'pay_Test123' } } } });
    const signature = sign(raw, env.RAZORPAY_WEBHOOK_SECRET);
    await t.test('failed or unrelated events never write a registration', async () => {
      const ignored = JSON.stringify({ event: 'payment.failed' });
      assert.equal((await processWebhook(ignored, sign(ignored, env.RAZORPAY_WEBHOOK_SECRET))).ignored, true);
      assert.equal(writes, 0);
    });
    await t.test('only captured, matching payment amounts are accepted', async () => {
      payment.status = 'authorized'; payment.captured = false;
      await assert.rejects(() => processWebhook(raw, signature), /captured/);
      payment.status = 'captured'; payment.captured = true; payment.amount = 1;
      await assert.rejects(() => processWebhook(raw, signature), /match/);
      payment.amount = 249900;
      assert.equal(writes, 0);
    });
    await t.test('tampered attendee notes cannot be written', async () => {
      order.notes.city = 'Changed';
      await assert.rejects(() => processWebhook(raw, signature), /details/);
      order.notes.city = attendee.city;
      assert.equal(writes, 0);
    });
    await t.test('captured payment writes correct verified attendee and amount', async () => {
      assert.equal((await processWebhook(raw, signature)).received, true);
      assert.equal(writes, 1);
      assert.equal(delivered.registration.amount, 2499);
      assert.equal(delivered.registration.status, 'PAID');
      assert.equal(delivered.registration.email, attendee.email);
      assert.equal(delivered.registration.paymentId, payment.id);
    });
    await t.test('Sheet failure propagates so Razorpay can retry', async () => {
      sheetFails = true;
      await assert.rejects(() => processWebhook(raw, signature), /retried/);
      sheetFails = false;
    });
    await t.test('checkout callback signature and provider status are verified', async () => {
      const result = { razorpay_order_id: order.id, razorpay_payment_id: payment.id, razorpay_signature: sign(`${order.id}|${payment.id}`, env.RAZORPAY_KEY_SECRET) };
      assert.equal((await verifyPayment(result)).status, 'paid');
      payment.status = 'authorized'; payment.captured = false;
      assert.equal((await verifyPayment(result)).status, 'processing');
      await assert.rejects(() => verifyPayment({ ...result, razorpay_signature: '0'.repeat(64) }), /verification/);
    });
    await t.test('cross-origin order creation is rejected', () => {
      assert.throws(() => checkOrigin(new Request('http://localhost:3001/api/payments/order', { headers: { origin: 'https://other.example' } })), /origin/);
      checkOrigin(new Request('http://localhost:3001/api/payments/order', { headers: { origin: 'http://localhost:3001' } }));
    });
  } finally { globalThis.fetch = originalFetch; }
});

await test('Google Apps Script receiver deduplicates and escapes sheet formulas', async () => {
  const rows = []; let locked = false;
  const context = {
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: value => ({ value, setMimeType() { return this; } }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: key => ({ SHARED_SECRET: 'sheet-secret', SPREADSHEET_ID: 'sheet', SHEET_NAME: 'Registrations' })[key] }) },
    LockService: { getScriptLock: () => ({ waitLock: () => { locked = true; }, hasLock: () => locked, releaseLock: () => { locked = false; } }) },
    SpreadsheetApp: { openById: () => ({ getSheetByName: () => ({ getLastRow: () => rows.length, appendRow: row => { assert.equal(locked, true); rows.push(row); }, getRange: () => ({ getDisplayValues: () => rows.slice(1).map(row => row.slice(0, 2)) }) }) }), flush() {} },
  };
  vm.createContext(context);
  vm.runInContext(await readFile(new URL('../integrations/google-sheets.gs', import.meta.url), 'utf8'), context);
  const payload = { secret: 'sheet-secret', registration: { ...attendee, name: '=IMPORTXML("x")', paymentId: 'pay_One', orderId: 'order_One', amount: 2499, status: 'PAID', currency: 'INR', event: 'fsp-catalyst-connect-3', paidAt: '2026-10-29T00:00:00Z' } };
  const send = body => JSON.parse(context.doPost({ postData: { contents: JSON.stringify(body) } }).value);
  assert.equal(send({ ...payload, secret: 'wrong' }).ok, false);
  assert.equal(rows.length, 0);
  assert.equal(send(payload).ok, true);
  assert.equal(rows.length, 2);
  assert.ok(rows[1][3].startsWith("'="));
  assert.equal(send(payload).duplicate, true);
  assert.equal(rows.length, 2);
  assert.equal(send({ ...payload, registration: { ...payload.registration, paymentId: 'pay_Two' } }).duplicate, true);
  assert.equal(rows.length, 2);
  assert.equal(locked, false);
});
