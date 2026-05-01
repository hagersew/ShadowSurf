import { ROOT_CLASS, STYLE_ID, buildDarkModeCss } from "./styleTemplate";

interface ApplyOptions {
  enabled: boolean;
  brightness: number;
  contrast: number;
}

const observer = new MutationObserver(handleMutations);
let observerStarted = false;

function ensureStyleTag(brightness: number, contrast: number): HTMLStyleElement {
  const existing = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (existing) {
    existing.textContent = buildDarkModeCss(brightness, contrast);
    return existing;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = buildDarkModeCss(brightness, contrast);
  document.documentElement.appendChild(style);
  return style;
}

function cleanupStyleTag(): void {
  document.getElementById(STYLE_ID)?.remove();
}

function updateRootClass(enabled: boolean): void {
  document.documentElement.classList.toggle(ROOT_CLASS, enabled);
}

function handleMutations(mutations: MutationRecord[]): void {
  for (const mutation of mutations) {
    if (mutation.type !== "childList") {
      continue;
    }
    if (mutation.addedNodes.length === 0) {
      continue;
    }
    // Keep new markup in dark mode without reprocessing the full document.
    if (document.documentElement.classList.contains(ROOT_CLASS)) {
      document.documentElement.classList.add(ROOT_CLASS);
    }
  }
}

function startObserver(): void {
  if (observerStarted) {
    return;
  }
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  observerStarted = true;
}

function stopObserver(): void {
  if (!observerStarted) {
    return;
  }
  observer.disconnect();
  observerStarted = false;
}

export function applyDarkMode(options: ApplyOptions): void {
  ensureStyleTag(options.brightness, options.contrast);
  updateRootClass(options.enabled);
  if (options.enabled) {
    startObserver();
  } else {
    stopObserver();
  }
}

export function resetDarkMode(): void {
  stopObserver();
  updateRootClass(false);
  cleanupStyleTag();
}
