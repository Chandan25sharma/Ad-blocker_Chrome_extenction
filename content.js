// Cosmetic filtering: hides leftover ad slots with one injected stylesheet.
// Network blocking is done by the DNR rulesets, not here.
// Selectors are deliberately narrow (well-known ad markup only) to avoid hiding
// real content; generic "[class*=ad]" style selectors are not used.
const SELECTORS = [
  // Google AdSense / Ad Manager slots
  "ins.adsbygoogle",
  "div[id^='div-gpt-ad']",
  "iframe[id^='google_ads_iframe']",
  // Outbrain / Taboola widgets (scripts are blocked; this removes empty boxes)
  ".OUTBRAIN",
  "div[id^='taboola-']",
  // YouTube display ads around the player and in feeds. In-stream video ads
  // (pre-roll/mid-roll) are NOT removed; see README.
  "#player-ads",
  "#masthead-ad",
  "ytd-ad-slot-renderer",
  "ytd-in-feed-ad-layout-renderer",
  "ytd-promoted-sparkles-web-renderer",
  "ytd-companion-slot-renderer",
  ".ytp-ad-overlay-container"
];

chrome.storage.local.get(DEFAULTS).then(({ enabled, allowlist }) => {
  if (!enabled || isAllowlisted(location.hostname, allowlist)) return;
  const style = document.createElement("style");
  style.textContent = SELECTORS.join(",\n") + " { display: none !important; }";
  document.documentElement.append(style);
});
