import { DEFAULT_SETTINGS, type ExtensionSettings } from "./types";

const SETTINGS_KEY = "settings";

function getStorageArea(): chrome.storage.StorageArea {
  return chrome.storage.sync ?? chrome.storage.local;
}

export async function getSettings(): Promise<ExtensionSettings> {
  const storage = getStorageArea();
  const result = await storage.get(SETTINGS_KEY);
  const stored = result[SETTINGS_KEY] as Partial<ExtensionSettings> | undefined;
  return {
    ...DEFAULT_SETTINGS,
    ...stored,
    visual: {
      ...DEFAULT_SETTINGS.visual,
      ...(stored?.visual ?? {})
    },
    whitelist: stored?.whitelist ?? DEFAULT_SETTINGS.whitelist,
    blacklist: stored?.blacklist ?? DEFAULT_SETTINGS.blacklist
  };
}

export async function setSettings(settings: ExtensionSettings): Promise<ExtensionSettings> {
  const storage = getStorageArea();
  await storage.set({ [SETTINGS_KEY]: settings });
  return settings;
}
