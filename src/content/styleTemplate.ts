export const ROOT_CLASS = "shadowsurf-darkmode";
export const STYLE_ID = "shadowsurf-style";

function scopeEvery(selectorList: string): string {
  return selectorList
    .split(",")
    .map((part) => `html.${ROOT_CLASS} ${part.trim()}`)
    .join(",\n");
}

/** Shells that commonly wrap the primary page content (high-specificity sites like Wikipedia). */
const CONTENT_SURFACE_SELECTORS = [
  "main",
  '[role="main"]',
  "article",
  "#content",
  "#bodyContent",
  "#mw-content-text",
  ".mw-parser-output",
  ".mw-body",
  ".mw-body-content",
  ".vector-body",
  ".vector-layout-grid",
  ".vector-sticky-pinned-container",
  ".vector-header-container",
  ".vector-sticky-header",
  "#mw-head",
  "#mw-navigation",
  "#left-navigation",
  "#right-navigation",
  ".vector-sidebar",
  ".vector-main-menu",
  ".vector-page-toolbar"
].join(", ");

const TABLE_SURFACE_SELECTORS = [
  "main table",
  '[role="main"] table',
  "article table",
  "#mw-content-text table",
  ".mw-parser-output table"
].join(", ");

const PANEL_SURFACE_SELECTORS = [
  ".infobox",
  ".navbox",
  ".vertical-navbox",
  ".sidebar",
  ".thumbinner",
  ".thumb",
  "figure",
  ".gallery",
  ".toc",
  ".toccolours",
  ".mw-highlight",
  "pre",
  ".mw-code",
  "code"
].join(", ");

export function buildDarkModeCss(brightness: number, contrast: number): string {
  const b = Math.min(200, Math.max(1, brightness));
  const c = Math.min(200, Math.max(1, contrast));
  return `
html.${ROOT_CLASS} {
  color-scheme: dark;
  background: #111 !important;
  color: #e8e8e8;
  min-height: 100%;
}

html.${ROOT_CLASS} body {
  background-color: #111 !important;
  color: #e8e8e8;
  min-height: 100%;
}

${scopeEvery(CONTENT_SURFACE_SELECTORS)},
${scopeEvery(PANEL_SURFACE_SELECTORS)} {
  background-color: #1e1e1e !important;
  color: #e4e4e4 !important;
  border-color: #404040 !important;
}

${scopeEvery(TABLE_SURFACE_SELECTORS)},
${scopeEvery(TABLE_SURFACE_SELECTORS)} th,
${scopeEvery(TABLE_SURFACE_SELECTORS)} td {
  background-color: #252525 !important;
  color: #e4e4e4 !important;
  border-color: #444 !important;
}

html.${ROOT_CLASS} a {
  color: #8ab4f8 !important;
}

html.${ROOT_CLASS} input:not([type="image"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]),
html.${ROOT_CLASS} textarea,
html.${ROOT_CLASS} select {
  background-color: #2a2a2a !important;
  color: #eee !important;
  border-color: #555 !important;
}

html.${ROOT_CLASS} img,
html.${ROOT_CLASS} video,
html.${ROOT_CLASS} canvas,
html.${ROOT_CLASS} svg,
html.${ROOT_CLASS} picture {
  filter: brightness(${b}%) contrast(${c}%) !important;
}
`.trim();
}
