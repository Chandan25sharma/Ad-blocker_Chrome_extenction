// Pop-up guard. Runs in the page's own JS world (not the isolated content-script
// world) so it can replace window.open before ad scripts use it. It is only
// injected on sites the user turned it on for (see service-worker.js), because
// it also blocks legitimate pop-ups such as "Sign in with ..." windows.
(() => {
  const log = (how, url) => console.info("[Personal Ad Blocker] blocked pop-up via " + how + ":", String(url || ""));
  const isOffsite = a => {
    try { return new URL(a.href, location.href).origin !== location.origin; } catch { return false; }
  };

  // 1. Script-opened tabs/windows: the classic pop-under.
  // ponytail: blocks every window.open on this site, including any the site
  // genuinely needs; turn the guard off for the site if something breaks.
  const blockedOpen = function (url) { log("window.open", url); return null; };
  window.open = blockedOpen;

  // Ad scripts often grab an unpatched open() from a fresh blank iframe.
  const contentWindow = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, "contentWindow");
  Object.defineProperty(HTMLIFrameElement.prototype, "contentWindow", {
    ...contentWindow,
    get() {
      const w = contentWindow.get.call(this);
      try { if (w) w.open = blockedOpen; } catch {} // cross-origin frames throw; they can't reach us anyway
      return w;
    }
  });

  // 2. Fallback trick: build an <a target="_blank"> to the ad and call .click().
  const realClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.target === "_blank" && isOffsite(this)) return log("link.click()", this.href);
    return realClick.call(this);
  };

  // 3. Same trick via a fake click event. Real user clicks have isTrusted=true
  // and are left alone, so normal links keep working.
  window.addEventListener("click", e => {
    const a = e.target instanceof Element && e.target.closest("a[target='_blank']");
    if (!e.isTrusted && a && isOffsite(a)) { e.preventDefault(); e.stopImmediatePropagation(); log("synthetic click", a.href); }
  }, true);
})();
