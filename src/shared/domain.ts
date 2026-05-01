import type { ExtensionSettings, SiteStatus } from "./types";

export function normalizeDomain(input: string): string {
  return input.trim().toLowerCase().replace(/^\*\./, "");
}

function isDomainMatch(hostname: string, ruleDomain: string): boolean {
  const normalizedRule = normalizeDomain(ruleDomain);
  if (!normalizedRule) {
    return false;
  }
  return hostname === normalizedRule || hostname.endsWith(`.${normalizedRule}`);
}

function containsDomain(hostname: string, domains: string[]): boolean {
  return domains.some((domain) => isDomainMatch(hostname, domain));
}

export function getSiteStatus(hostname: string, settings: ExtensionSettings): SiteStatus {
  if (!settings.globalEnabled) {
    return { hostname, enabled: false, reason: "global_off" };
  }

  if (containsDomain(hostname, settings.blacklist)) {
    return { hostname, enabled: false, reason: "blacklist_hit" };
  }

  if (settings.whitelist.length > 0) {
    const enabled = containsDomain(hostname, settings.whitelist);
    return {
      hostname,
      enabled,
      reason: enabled ? "whitelist_hit" : "default"
    };
  }

  return { hostname, enabled: true, reason: "default" };
}

export function upsertDomain(domains: string[], domain: string): string[] {
  const normalized = normalizeDomain(domain);
  if (!normalized) {
    return domains;
  }
  if (domains.includes(normalized)) {
    return domains;
  }
  return [...domains, normalized].sort();
}

export function removeDomain(domains: string[], domain: string): string[] {
  const normalized = normalizeDomain(domain);
  return domains.filter((entry) => normalizeDomain(entry) !== normalized);
}
