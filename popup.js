// The popup only edits chrome.storage.local; service-worker.js reacts to the change.
const $ = id => document.getElementById(id);
let settings = { ...DEFAULTS };
let currentHost = null;

const save = patch => chrome.storage.local.set(patch).then(render);

async function render() {
  settings = await chrome.storage.local.get(DEFAULTS);
  $("enabled").checked = settings.enabled;

  if (normalizeDomain(currentHost)) {
    const allowed = isAllowlisted(currentHost, settings.allowlist);
    $("toggle-site").textContent = allowed ? "Block ads on this site again" : "Allow ads on this site";
    $("toggle-site").className = allowed ? "danger" : "primary";
    $("guard").checked = isAllowlisted(currentHost, settings.popupGuard);
    $("guard").disabled = allowed; // allowlisted sites get no blocking at all
  }

  $("list").replaceChildren(...settings.allowlist.map(domain => {
    const li = document.createElement("li");
    const remove = document.createElement("button");
    remove.textContent = "Remove";
    remove.className = "danger";
    remove.onclick = () => save({ allowlist: settings.allowlist.filter(d => d !== domain) });
    li.append(domain, remove);
    return li;
  }));
}

$("enabled").onchange = e => save({ enabled: e.target.checked });

$("toggle-site").onclick = () => {
  const { allowlist } = settings;
  const next = isAllowlisted(currentHost, allowlist)
    ? allowlist.filter(d => !isAllowlisted(currentHost, [d]))
    : [...allowlist, normalizeDomain(currentHost)];
  save({ allowlist: next });
};

$("guard").onchange = e => {
  const rest = settings.popupGuard.filter(d => !isAllowlisted(currentHost, [d]));
  save({ popupGuard: e.target.checked ? [...rest, normalizeDomain(currentHost)] : rest });
};

$("add").onsubmit = e => {
  e.preventDefault();
  const domain = normalizeDomain($("domain").value);
  $("error").textContent = domain ? "" : "Enter a domain like example.com";
  if (!domain || settings.allowlist.includes(domain)) return;
  $("domain").value = "";
  save({ allowlist: [...settings.allowlist, domain] });
};

chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
  // tab.url is visible thanks to activeTab (granted when the popup opens).
  try {
    const url = new URL(tab.url);
    if (url.protocol === "http:" || url.protocol === "https:") currentHost = url.hostname;
  } catch {}
  $("site").textContent = normalizeDomain(currentHost) || "Not available on this page";
  $("toggle-site").disabled = !normalizeDomain(currentHost);
  render();
});
