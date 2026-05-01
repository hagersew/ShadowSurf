# Architecture

## Overview

ShadowSurf uses a Manifest V3 architecture with three main pieces:

- **Popup UI (`src/popup`)**: user-facing controls and settings editor.
- **Background service worker (`src/background`)**: central settings mutation and tab notification layer.
- **Content script (`src/content`)**: page-level dark mode application engine.

## Data flow

1. User interacts with popup controls.
2. Popup sends a typed runtime message to background worker.
3. Background updates `chrome.storage` settings.
4. Background sends `APPLY_SETTINGS` to tabs.
5. Content script evaluates current hostname against rules and applies/removes dark mode classes/styles.

## Rule precedence

1. If `globalEnabled` is `false`: site is disabled.
2. If hostname matches `blacklist`: site is disabled.
3. If whitelist is non-empty: only whitelisted sites are enabled.
4. Otherwise: site is enabled by default.

## Dark mode strategy

- Dynamic stylesheet injection is used for long-term maintainability.
- The engine injects one managed `<style>` tag and toggles one root class.
- Media elements (`img`, `video`, `canvas`, `svg`, `picture`) are excluded from destructive inversion behavior.
- MutationObserver is attached only while dark mode is enabled and is scoped to child list mutations.

## Performance notes

- Avoid whole-DOM restyling loops.
- Reuse one style tag instead of repeated node insertion.
- Class-based root toggling keeps reflow scope predictable.

## Extensibility

Possible future additions:

- Better system-theme sync via `matchMedia('(prefers-color-scheme: dark)')`.
- Per-site visual overrides.
- Additional theme presets.
