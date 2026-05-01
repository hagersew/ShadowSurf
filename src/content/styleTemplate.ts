export const ROOT_CLASS = "shadowsurf-darkmode";
export const STYLE_ID = "shadowsurf-style";

export function buildDarkModeCss(brightness: number, contrast: number): string {
  return `
html.${ROOT_CLASS} {
  color-scheme: dark;
  background: #111 !important;
}

html.${ROOT_CLASS},
html.${ROOT_CLASS} body {
  background-color: #111 !important;
}

html.${ROOT_CLASS} :not(img):not(video):not(canvas):not(svg):not(picture):not(iframe) {
  background-color: inherit;
}

html.${ROOT_CLASS} body,
html.${ROOT_CLASS} body *:not(img):not(video):not(canvas):not(svg):not(picture):not(iframe) {
  color: #ececec !important;
  border-color: #3a3a3a !important;
}

html.${ROOT_CLASS} img,
html.${ROOT_CLASS} video,
html.${ROOT_CLASS} canvas,
html.${ROOT_CLASS} svg,
html.${ROOT_CLASS} picture {
  filter: brightness(${brightness}%) contrast(${contrast}%) !important;
}

html.${ROOT_CLASS} a {
  color: #90caf9 !important;
}
`.trim();
}
