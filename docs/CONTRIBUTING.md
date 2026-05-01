# Contributing

Thanks for considering a contribution to ShadowSurf.

## Local setup

1. Install dependencies: `npm install`
2. Build extension: `npm run build`
3. Load `dist/` as unpacked extension in Chrome.

## Development workflow

- Keep changes scoped and reviewable.
- Prefer typed shared contracts for runtime messages.
- Keep permissions minimal and justify any additions in PR description.
- Update docs when behavior changes.

## Code style

- TypeScript `strict` mode is enabled.
- Prefer small, focused modules.
- Avoid broad selectors or expensive DOM operations in content scripts.

## Testing checklist

- Build passes with `npm run build`.
- Global toggle updates currently open tabs.
- Per-site toggle updates active tab.
- Whitelist/blacklist behaviors follow documented precedence.
- Images/videos are not corrupted by dark mode styles.

## Pull requests

Include:

- Summary of user-visible behavior changes.
- Rationale for any architecture/permission changes.
- Manual test steps and observed results.
