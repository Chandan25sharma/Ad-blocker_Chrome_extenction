importScripts("common.js");

// Turns settings in chrome.storage.local into DNR state:
// - enabled=false disables both bundled rulesets
// - each allowlisted site gets one dynamic "allowAllRequests" rule, which lets
//   every request made by that page (and its iframes) through.
async function sync() {
  const { enabled, allowlist, popupGuard } = await chrome.storage.local.get(DEFAULTS);

  // Pop-up guard: (re)register popup-guard.js for the chosen sites only.
  await chrome.scripting.unregisterContentScripts({ ids: ["popup-guard"] }).catch(() => {});
  const guarded = enabled
    ? popupGuard.map(normalizeDomain).filter(d => d && !isAllowlisted(d, allowlist))
    : [];
  if (guarded.length) {
    await chrome.scripting.registerContentScripts([{
      id: "popup-guard",
      js: ["popup-guard.js"],
      world: "MAIN",
      runAt: "document_start",
      allFrames: true,
      matches: guarded.flatMap(d => [`*://${d}/*`, `*://*.${d}/*`]),
      persistAcrossSessions: true
    }]);
  }

  await chrome.declarativeNetRequest.updateEnabledRulesets(
    enabled ? { enableRulesetIds: RULESETS } : { disableRulesetIds: RULESETS }
  );

  const domains = [...new Set(allowlist.map(normalizeDomain).filter(Boolean))];
  const old = await chrome.declarativeNetRequest.getDynamicRules();
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: old.map(r => r.id),
    addRules: domains.map((domain, i) => ({
      id: i + 1,
      priority: 100,
      action: { type: "allowAllRequests" },
      condition: { requestDomains: [domain], resourceTypes: ["main_frame"] }
    }))
  });
}

// Serialize syncs so quick consecutive changes can't race on rule ids.
let queue = Promise.resolve();
const run = () => { queue = queue.then(sync).catch(console.error); };

chrome.runtime.onInstalled.addListener(run);
chrome.runtime.onStartup.addListener(run);
chrome.storage.onChanged.addListener((_, area) => { if (area === "local") run(); });
