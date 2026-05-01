# ShadowSurf

ShadowSurf is an open-source Chrome extension that brings modern dark mode to websites with global and per-site controls.

## Features

- Manifest V3 extension with React + TypeScript + Chakra UI popup.
- Dynamic stylesheet injection for reliable dark mode rendering.
- Global enable/disable switch.
- Per-site enable/disable with whitelist/blacklist domain rules.
- Visual tuning controls (brightness + contrast).
- Persistent settings using `chrome.storage`.

## Branding and Icons

- Extension branding now uses the official ShadowSurf logo.
- Chrome extension icons are stored in `assets/icons`.
- Included compatible sizes: `16x16`, `32x32`, `48x48`, `128x128` (used by `manifest.json`).
- Master source export is available as `assets/icons/icon-1024.png` for store/listing assets.

## Permissions

- `activeTab`: read active tab URL for current-site controls.
- `storage`: persist extension preferences.
- `scripting`: reserved for tab-level actions and future scripted enhancements.

## Development

### Prerequisites

- Node.js 20+
- Chrome (or Chromium)

### Install

```bash
npm install
```

### Build

```bash
npm run build
```

The bundled extension is generated in `dist/`.

### Load unpacked in Chrome

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the `dist/` folder.

## Project Structure

- `src/background`: MV3 background service worker.
- `src/content`: content script and dark mode engine.
- `src/popup`: popup UI built with React + Chakra.
- `src/shared`: shared types, message contracts, storage/domain logic.
- `docs`: architecture and contribution docs.

## Validation checklist

- Toggle global switch and confirm page theme updates.
- Toggle site status and verify only current domain changes.
- Add/remove domains from whitelist/blacklist and verify precedence.
- Check images and videos remain visually correct.
- Visit a dynamic site and verify style remains stable.

## License

MIT. See `LICENSE`.
