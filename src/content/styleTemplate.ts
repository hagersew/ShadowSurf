export const ROOT_CLASS = "shadowsurf-darkmode";
export const STYLE_ID = "shadowsurf-style";

function scopeEvery(selectorList: string): string {
  return selectorList
    .split(",")
    .map((part) => `html.${ROOT_CLASS} ${part.trim()}`)
    .join(",\n");
}

/** Primary content shells (high-specificity sites like Wikipedia). */
const CONTENT_SURFACE_SELECTORS = [
  "main",
  '[role="main"]',
  "article",
  "#content",
  "#main-content",
  ".main-content",
  ".content-area",
  ".primary-content",
  "[data-main-content]",
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

/**
 * MediaWiki Vector (2022): the pinned TOC / main menu / tools live in `#mw-panel` and
 * `.vector-column-start`; without these, the left column stays the default light surface.
 */
const MEDIAWIKI_VECTOR_SURFACE_SELECTORS = [
  "#mw-panel",
  "#mw-panel-toc",
  "#mw-panel-toc-list",
  "#vector-toc",
  "#vector-toc-pinned-container",
  "#vector-toc-unpinned-container",
  "#vector-main-menu-pinned-container",
  "#vector-main-menu-unpinned-container",
  "#vector-page-tools-pinned-container",
  "#vector-page-tools-unpinned-container",
  "#vector-appearance-pinned-container",
  "#vector-appearance-unpinned-container",
  "#vector-page-titlebar-toc-unpinned-container",
  "#vector-sticky-header-toc-unpinned-container",
  ".mw-page-container",
  ".mw-page-container-inner",
  ".mw-sidebar",
  ".mw-table-of-contents-container",
  ".vector-column-start",
  ".vector-column-end",
  ".vector-toc",
  ".vector-toc-contents",
  ".vector-main-menu-container",
  ".vector-pinned-container",
  ".vector-unpinned-container"
].join(", ");

/**
 * Headers, footers, nav, app roots, and dialogs often sit outside `main` and stayed light while
 * global text was forced light — low contrast. These selectors darken common chrome regions.
 */
const LAYOUT_SURFACE_SELECTORS = [
  "header",
  "footer",
  "nav",
  "aside",
  "section",
  '[role="banner"]',
  '[role="navigation"]',
  '[role="contentinfo"]',
  '[role="complementary"]',
  '[role="region"]',
  '[role="search"]',
  '[role="dialog"]',
  '[role="alertdialog"]',
  "#header",
  "#footer",
  "#nav",
  "#sidebar",
  "#masthead",
  "#app",
  "#root",
  "#page",
  "#wrapper",
  "#container",
  ".site-header",
  ".site-footer",
  ".page-header",
  ".main-header",
  ".main-footer",
  ".navbar",
  ".nav-bar",
  ".top-bar",
  ".app-bar",
  ".masthead",
  ".app-root",
  ".layout",
  ".page-wrapper",
  ".site-wrapper",
  ".page-shell",
  ".sticky-header",
  ".global-footer",
  ".l-footer"
].join(", ");

const TABLE_SURFACE_SELECTORS = [
  "main table",
  '[role="main"] table',
  "article table",
  "header table",
  "footer table",
  "nav table",
  "aside table",
  "section table",
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

/** Elements that should not receive forced text color (media, chrome, replaced content). */
const NO_FORCED_TEXT_COLOR =
  ":not(img):not(video):not(canvas):not(picture):not(audio):not(iframe):not(object):not(embed)" +
  ":not(style):not(script):not(noscript):not(template):not(meta):not(link):not(title)" +
  ":not(br):not(hr):not(source):not(track):not(map):not(area)";

export function buildDarkModeCss(brightness: number, contrast: number): string {
  const b = Math.min(200, Math.max(1, brightness));
  const c = Math.min(200, Math.max(1, contrast));
  return `
html.${ROOT_CLASS} {
  color-scheme: dark;
  background: #111 !important;
  color: #e8e8e8 !important;
  min-height: 100%;
}

html.${ROOT_CLASS} body {
  background-color: #111 !important;
  color: #e8e8e8 !important;
  min-height: 100%;
}

/* Sites often set explicit dark text colors; without this, text stays dark on our dark surfaces. */
html.${ROOT_CLASS} *${NO_FORCED_TEXT_COLOR} {
  color: #e4e4e4 !important;
  -webkit-text-fill-color: currentColor !important;
}

${scopeEvery(CONTENT_SURFACE_SELECTORS)},
${scopeEvery(LAYOUT_SURFACE_SELECTORS)},
${scopeEvery(MEDIAWIKI_VECTOR_SURFACE_SELECTORS)},
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

html.${ROOT_CLASS} a,
html.${ROOT_CLASS} a * {
  color: #8ab4f8 !important;
  -webkit-text-fill-color: currentColor !important;
}

html.${ROOT_CLASS} a:visited,
html.${ROOT_CLASS} a:visited * {
  color: #c58af9 !important;
  -webkit-text-fill-color: currentColor !important;
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
