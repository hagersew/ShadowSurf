import { getSiteStatus, removeDomain, upsertDomain } from "../shared/domain";
import { getSettings, setSettings } from "../shared/storage";
import type { Message } from "../shared/messages";
import type { ExtensionSettings } from "../shared/types";

async function notifyAllTabs(): Promise<void> {
  const tabs = await chrome.tabs.query({});
  await Promise.all(
    tabs
      .filter((tab) => tab.id !== undefined)
      .map((tab) =>
        chrome.tabs.sendMessage(tab.id!, { type: "APPLY_SETTINGS" }).catch(() => undefined)
      )
  );
}

async function notifyActiveTab(): Promise<void> {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!activeTab?.id) {
    return;
  }
  await chrome.tabs.sendMessage(activeTab.id, { type: "APPLY_SETTINGS" }).catch(() => undefined);
}

function withSiteToggle(
  settings: ExtensionSettings,
  hostname: string,
  enabled: boolean
): ExtensionSettings {
  const next = { ...settings };
  if (enabled) {
    next.blacklist = removeDomain(next.blacklist, hostname);
  } else {
    next.blacklist = upsertDomain(next.blacklist, hostname);
  }
  return next;
}

chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  void (async () => {
    const settings = await getSettings();

    switch (message.type) {
      case "GET_SETTINGS":
        sendResponse(settings);
        return;
      case "SET_SETTINGS": {
        const updated = await setSettings(message.payload);
        await notifyAllTabs();
        sendResponse(updated);
        return;
      }
      case "SET_GLOBAL_ENABLED": {
        const updated = await setSettings({ ...settings, globalEnabled: message.payload });
        await notifyAllTabs();
        sendResponse(updated);
        return;
      }
      case "TOGGLE_SITE": {
        const updated = await setSettings(
          withSiteToggle(settings, message.payload.hostname, message.payload.enabled)
        );
        await notifyAllTabs();
        sendResponse(updated);
        return;
      }
      case "ADD_DOMAIN_RULE": {
        const listKey = message.payload.mode;
        const updated = await setSettings({
          ...settings,
          [listKey]: upsertDomain(settings[listKey], message.payload.domain)
        });
        await notifyAllTabs();
        sendResponse(updated);
        return;
      }
      case "REMOVE_DOMAIN_RULE": {
        const listKey = message.payload.mode;
        const updated = await setSettings({
          ...settings,
          [listKey]: removeDomain(settings[listKey], message.payload.domain)
        });
        await notifyAllTabs();
        sendResponse(updated);
        return;
      }
      case "SET_VISUAL": {
        const updated = await setSettings({
          ...settings,
          visual: {
            brightness: message.payload.brightness,
            contrast: message.payload.contrast
          }
        });
        await notifyAllTabs();
        sendResponse(updated);
        return;
      }
      case "GET_SITE_STATUS": {
        sendResponse(getSiteStatus(message.payload.hostname, settings));
        return;
      }
      case "APPLY_SETTINGS_TO_ACTIVE_TAB": {
        await notifyActiveTab();
        sendResponse({ ok: true });
        return;
      }
      default:
        sendResponse({ ok: false });
    }
  })();

  return true;
});
