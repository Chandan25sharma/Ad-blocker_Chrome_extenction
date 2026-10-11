// Shared by the service worker, popup, content script and test.js.
// allowlist: sites where nothing is blocked.
// popupGuard: sites where script-opened pop-up tabs are also blocked.
const DEFAULTS = { enabled: true, allowlist: [], popupGuard: [] };
const RULESETS = ["ads", "video_ads", "popup_ads"];

// Accepts "example.com", "https://www.example.com/path", "*.example.com".
// Returns a bare lowercase hostname, or null if it does not look like one.
function normalizeDomain(input) {
  let value = String(input || "").trim().toLowerCase();
  value = value.replace(/^[a-z]+:\/\//, "").split(/[/?#]/)[0].split(":")[0];
  value = value.replace(/^\*\./, "").replace(/^www\./, "").replace(/\.$/, "");
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(value)) return null;
  return value;
}

// True if host is the allowlisted domain or one of its subdomains.
function isAllowlisted(host, allowlist) {
  host = String(host).toLowerCase();
  return allowlist.some(d => host === d || host.endsWith("." + d));
}

if (typeof module !== "undefined") module.exports = { normalizeDomain, isAllowlisted };
