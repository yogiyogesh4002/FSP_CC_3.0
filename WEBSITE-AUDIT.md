# Website audit and verification

## Improvements

- Unified responsive typography, readable 16–18px supporting text, heading hierarchy, and spacing.
- Balanced Challenge columns and fixed number, title, and description alignment.
- Fixed FAQ overflow: the icon rotates inside a stationary circular border.
- Improved FAQ wrapping, keyboard operation, and stable answer-region references.
- Replaced content-hiding JavaScript reveals with optional CSS entrance effects. Content remains visible with reduced motion or JavaScript disabled.
- Standardized speaker photo widths and biography spacing; preserved complete photographs.
- Tightened section padding and softened decorative backgrounds.
- Improved secondary-text contrast and narrow-screen sticky-button fit.
- Placeholder buttons now say “View event details”; the event section clearly explains registration availability.
- Bundled the existing fonts locally so production builds do not require Google Fonts access.
- Added generated Open Graph and Twitter sharing images.
- Replaced the example metadata domain with a configurable deployment URL.

## Reproducible checks

Final verification: production build, TypeScript, and ESLint passed. The production browser audit passed all 20 scenarios with zero failures. A separate smoke test confirmed FAQ interaction and local font loading on the development site at port 3000. Both generated sharing-image endpoints returned HTTP 200 with PNG output.

```powershell
npm run lint
$env:NEXT_DIST_DIR = '.next-audit'
npm run build
npm run start -- --port 3100
```

In another terminal:

```powershell
$env:VERIFY_URL = 'http://localhost:3100'
npm run audit
```

The audit checks installed Edge and Chrome at 320, 390, 640, 768, 1024, 1440, and 1920 pixels. For each browser it also checks reduced motion, JavaScript-disabled content visibility, and 200% text sizing: 20 layout scenarios overall. Standard-width scenarios additionally exercise FAQ mouse and keyboard controls and video-player activation. It checks image loading, alt attributes, internal anchor targets, one main heading, text overflow, hidden content, and page JavaScript errors.

Results and screenshots are saved to `artifacts/audit/`. Video activation is verified locally; external YouTube playback is not tested. Text enlargement tests root font scaling rather than a physical device’s browser zoom. Screenshot review complements the automated checks.

## Details still required before public launch

- Real registration URL and registration availability in `src/config/site.ts`.
- Confirmed venue, start/end times, pricing, eligibility, and organiser contact information.
- Public HTTPS domain via `NEXT_PUBLIC_SITE_URL` (see `.env.example`).
- Safari/iPhone and Firefox testing on those actual browsers/devices; local checks use Windows Chromium browsers.

This is a targeted visual and functional audit, not a claim of complete accessibility certification or coverage of every browser version.
