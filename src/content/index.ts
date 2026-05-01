import { applyDarkMode, resetDarkMode } from "./darkModeEngine";
import { getSiteStatus } from "../shared/domain";
import { getSettings } from "../shared/storage";

async function applyCurrentSettings(): Promise<void> {
  const settings = await getSettings();
  const status = getSiteStatus(window.location.hostname, settings);

  if (!status.enabled) {
    resetDarkMode();
    return;
  }

  applyDarkMode({
    enabled: true,
    brightness: settings.visual.brightness,
    contrast: settings.visual.contrast
  });
}

chrome.runtime.onMessage.addListener((message: { type?: string }) => {
  if (message.type === "APPLY_SETTINGS") {
    void applyCurrentSettings();
  }
});

void applyCurrentSettings();
