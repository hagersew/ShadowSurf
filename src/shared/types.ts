export type DomainListMode = "whitelist" | "blacklist";

export interface VisualTuning {
  brightness: number;
  contrast: number;
}

export interface ExtensionSettings {
  globalEnabled: boolean;
  followSystemTheme: boolean;
  whitelist: string[];
  blacklist: string[];
  visual: VisualTuning;
}

export interface SiteStatus {
  hostname: string;
  enabled: boolean;
  reason: "global_off" | "whitelist_hit" | "blacklist_hit" | "default";
}

export const DEFAULT_SETTINGS: ExtensionSettings = {
  globalEnabled: true,
  followSystemTheme: false,
  whitelist: [],
  blacklist: [],
  visual: {
    brightness: 100,
    contrast: 100
  }
};
