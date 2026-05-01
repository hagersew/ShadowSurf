import type { DomainListMode, ExtensionSettings, SiteStatus } from "./types";

export type Message =
  | { type: "GET_SETTINGS" }
  | { type: "SET_SETTINGS"; payload: ExtensionSettings }
  | { type: "SET_GLOBAL_ENABLED"; payload: boolean }
  | { type: "TOGGLE_SITE"; payload: { hostname: string; enabled: boolean } }
  | { type: "ADD_DOMAIN_RULE"; payload: { mode: DomainListMode; domain: string } }
  | { type: "REMOVE_DOMAIN_RULE"; payload: { mode: DomainListMode; domain: string } }
  | { type: "SET_VISUAL"; payload: { brightness: number; contrast: number } }
  | { type: "GET_SITE_STATUS"; payload: { hostname: string } }
  | { type: "APPLY_SETTINGS_TO_ACTIVE_TAB" };

export interface MessageResponseMap {
  GET_SETTINGS: ExtensionSettings;
  SET_SETTINGS: ExtensionSettings;
  SET_GLOBAL_ENABLED: ExtensionSettings;
  TOGGLE_SITE: ExtensionSettings;
  ADD_DOMAIN_RULE: ExtensionSettings;
  REMOVE_DOMAIN_RULE: ExtensionSettings;
  SET_VISUAL: ExtensionSettings;
  GET_SITE_STATUS: SiteStatus;
  APPLY_SETTINGS_TO_ACTIVE_TAB: { ok: boolean };
}
