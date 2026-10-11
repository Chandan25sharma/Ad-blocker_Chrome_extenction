# Personal Ad Blocker

A small Chrome extension (Manifest V3) that blocks common ads, video ads, and pop-up ad tabs. It runs entirely on your computer and has no account, no tracking, and no server.

It's a personal project, not a replacement for a full blocker like uBlock Origin Lite. **It will not block every ad.** The [Limitations](#limitations) section explains exactly what it misses.

---

## Contents

- [What it does](#what-it-does)
- [Requirements](#requirements)
- [Installation](#installation)
- [Using the extension](#using-the-extension)
- [Checking that it works](#checking-that-it-works)
- [Updating and uninstalling](#updating-and-uninstalling)
- [Troubleshooting](#troubleshooting)
- [Permissions explained](#permissions-explained)
- [Privacy](#privacy)
- [Security](#security)
- [Responsible use](#responsible-use)
- [Limitations](#limitations)
- [Customizing](#customizing)
- [Project structure](#project-structure)

---

## What it does

| Feature | How it works |
| --- | --- |
| **Blocks ad requests** | About 45 known ad, video-ad, and pop-up-ad servers are blocked with Chrome's built-in blocking engine. |
| **Blocks video ads** | Ad requests from common video ad servers are blocked. Most video players then skip straight to the video. |
| **Blocks redirect ads** | If an ad tries to send a tab to a known pop-up ad network, Chrome shows a "blocked" page instead. |
| **Pop-up guard (per site)** | On sites you choose, the site's scripts can't open new ad tabs when you click. |
| **Hides empty ad boxes** | A stylesheet hides well-known ad slots, such as Google AdSense boxes and YouTube banner ads. |
| **Site exceptions** | Turn off all blocking for sites you trust or want to support. |
| **On/off switch** | Pause everything with one click. |

---

## Requirements

- **Windows 10 or 11** (macOS and Linux work too; the steps are the same)
- **Google Chrome 111 or newer**. Other Chromium browsers such as Microsoft Edge and Brave usually work as well.
- Optional: **Node.js**, only if you want to run the self-check (`node test.js`)

---

## Installation

The extension isn't on the Chrome Web Store. You load it yourself in Chrome's **Developer mode**. It takes about two minutes.

### Step 1: Get the files

**Option A: Download a ZIP (easiest)**

1. On this project's GitHub page, click the green **Code** button.
2. Click **Download ZIP**.
3. Right-click the downloaded ZIP and choose **Extract All…**.
4. Move the extracted folder somewhere permanent, for example `C:\Users\<you>\Documents\PersonalAdBlocker`.

> **Important:** Chrome loads the extension straight from this folder. If you delete or move the folder later, the extension stops working.

**Option B: Clone with Git**

```bash
git clone https://github.com/<your-username>/<repo-name>.git
```

### Step 2: Load it into Chrome

1. Open Chrome and type `chrome://extensions` in the address bar, then press **Enter**.
2. Turn on **Developer mode** with the switch in the top-right corner.
3. Click **Load unpacked** (top-left).
4. Select the folder that contains `manifest.json`.
   - If you downloaded the ZIP, this is often a folder *inside* the extracted folder. Open it and check that `manifest.json` is in it.
5. **Personal Ad Blocker** now appears in the list. It is on by default.

### Step 3: Pin it to the toolbar (recommended)

1. Click the puzzle-piece icon in Chrome's toolbar.
2. Click the pin next to **Personal Ad Blocker**.

You can now open its popup with one click.

### About the "Developer mode" warning

Chrome sometimes shows a banner that says **"Disable developer mode extensions"**. This is normal for any extension loaded with **Load unpacked**. Click **Keep** or close the banner. Your extension stays installed.

---

## Using the extension

Click the extension icon in the toolbar to open the popup.

### Blocking switch
Turns all blocking on or off. Reload open tabs afterwards.

### Current site
- **Allow ads on this site**: stops all blocking on the site you're viewing, including its subdomains. Use this when a site breaks, or for sites you want to support. Click **Block ads on this site again** to undo.
- **Block pop-up tabs on this site**: turns on the pop-up guard for this site. Use it on sites that open a new ad tab every time you click.
  - It blocks every script-opened pop-up on that site, **including real ones**, such as "Sign in with Google" windows. If something stops working on that site, turn it off.
  - Normal links you click yourself still work.

### Allowed sites
A list of every site where blocking is off.
- Type a domain (`example.com`) or paste a full URL, then click **Add**.
- Click **Remove** to start blocking a site again.

> After you change any setting, **reload the tab** so it takes effect.

---

## Checking that it works

### Quick check in the browser

1. Open a news website that normally shows ads.
2. Press **F12** to open DevTools, then go to the **Network** tab.
3. Reload the page (**F5**).
4. Type `doubleclick` or `googlesyndication` in the Network filter box. Those requests should show as failed with **`net::ERR_BLOCKED_BY_CLIENT`**. That means the extension blocked them.

### Check the pop-up guard

1. Go to a site that opens ad tabs when you click.
2. Open the popup and turn on **Block pop-up tabs on this site**, then reload.
3. Press **F12**, go to the **Console** tab, and click around the page.
4. Each blocked pop-up writes a line like:
   `[Personal Ad Blocker] blocked pop-up via window.open: https://…`

### Check site exceptions

1. Click **Allow ads on this site** and reload. The ad requests should now succeed.
2. Click **Block ads on this site again** and reload. They should be blocked again.

### Check for errors

At `chrome://extensions`, the extension's card should **not** show a red **Errors** button. Click **service worker** on the card to open its console. It should be empty.

### Self-check (optional, needs Node.js)

Open a terminal in the project folder and run:

```bash
node test.js
```

It prints `ok` when domain parsing works and the rule files are valid.

---

## Updating and uninstalling

### Update
1. Replace the files in your folder with the new version: download the new ZIP and overwrite, or run `git pull`.
2. Go to `chrome://extensions` and click the **reload icon** (circular arrow) on the extension's card.
3. Reload any open tabs.

Your settings (exceptions and pop-up guard sites) are kept.

### Uninstall
1. Go to `chrome://extensions`.
2. Click **Remove** on the extension's card.
3. Delete the folder if you no longer need it.

Removing the extension also deletes all its saved settings.

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| **"Manifest file is missing or unreadable"** | You picked the wrong folder. Select the folder that directly contains `manifest.json`. |
| **Extension disappeared or shows an error after restart** | You moved or deleted the folder. Put it back, or load it again from its new location. |
| **A site is broken (video won't play, buttons don't work)** | Click **Allow ads on this site** and reload. |
| **Site shows "Ad blocker detected"** | Add the site as an exception, or leave the site. |
| **Sign-in or payment pop-up doesn't open** | Turn off **Block pop-up tabs on this site** for that site. |
| **Ad tabs still open on click** | Turn on **Block pop-up tabs on this site**. If they still open, the site is probably using an invisible link laid over the page (see [Limitations](#limitations)). |
| **Changes don't seem to apply** | Reload the tab. After editing any project file, also click the reload icon at `chrome://extensions`. |
| **Popup says "Not available on this page"** | Normal on `chrome://` pages, the Chrome Web Store, and local files. Extensions can't run there. |

---

## Permissions explained

When you install it, Chrome warns that the extension can **"Read and change all your data on all websites"**. Chrome shows this warning for every ad blocker, because blocking ads and hiding ad boxes requires access to the pages you visit. This table lists each permission and what the extension does with it:

| Permission | Why it's needed | What it can't do |
| --- | --- | --- |
| `declarativeNetRequest` | Gives Chrome the list of ad servers to block. Chrome does the blocking itself. | The extension never sees which requests are made or which sites you visit. |
| `storage` | Saves your on/off switch, exceptions, and pop-up guard sites. | Data stays in Chrome on your computer. Nothing is synced or uploaded. |
| `activeTab` | Lets the popup show the current site's name. | It only works when you click the extension icon. |
| `scripting` | Adds the pop-up guard to the sites you picked. | It is only added on those sites, nowhere else. |
| Host access (`http://*/*`, `https://*/*`) | Needed to hide ad boxes on pages and to add the pop-up guard. | The scripts don't read page text, forms, passwords, or cookies. |

---

## Privacy

- **No data collection.** No analytics, no telemetry, no crash reports.
- **No network requests.** The extension never contacts any server, including any server of the author's.
- **No remote code.** All the code and filter rules are in this folder. Nothing is downloaded or updated in the background.
- **Local settings only.** Your settings are stored in `chrome.storage.local` and are deleted when you remove the extension.
- **No account.** Nothing to sign up for.

The code is short enough to check all of this yourself. About 200 lines of JavaScript do all the work.

---

## Security

### For people installing it

- **Install only from a source you trust.** An unpacked extension has the same access as any other extension. Before loading a copy from someone else's fork or a re-upload, read the code. A malicious version could steal passwords or browsing data.
- **Check the files.** The project only has the files listed in [Project structure](#project-structure). Be suspicious of extra files, minified or scrambled code, or any `fetch(`/`XMLHttpRequest` calls to outside servers.
- **Keep Chrome updated.** The extension relies on Chrome's built-in blocking engine and security model.
- **This is not antivirus.** Blocking ads lowers your exposure to malicious ads, but it won't protect you from harmful downloads, fake "Download" buttons, phishing pages, or scam sites. Sites with heavy pop-up ads, such as unofficial streaming or download sites, often lead to malware. Don't download or run files from them, and never enter passwords or payment details on pages an ad sent you to.
- **Pop-up guard on sensitive sites.** Don't turn on the pop-up guard for banking or payment sites. It can block the legitimate windows those sites need.

### How the code limits risk

- **Manifest V3:** Chrome forbids remote code and `eval` in MV3 extensions.
- **Declarative blocking:** Chrome applies the blocking rules itself, so the extension never sees your traffic.
- **Minimal page scripts:** The content script only adds one stylesheet. The pop-up guard only replaces `window.open` and runs only on sites you choose.
- **No dynamic HTML:** The popup builds its list with `textContent`, so a crafted domain name can't inject HTML.
- **Input validation:** Domains you type are checked against a strict pattern before they're used in blocking rules.

### For people publishing or forking it

- If you use Chrome's **Pack extension**, it creates a `.pem` file. **That is the extension's private signing key. Never commit or share it.** `.gitignore` already excludes `*.pem`, `*.crx`, and `*.zip`.
- If you publish a modified version, give it a different name so users don't confuse it with this one.
- If you find a security problem, open a GitHub issue that doesn't include exploit details, or contact the maintainer privately.

---

## Responsible use

- **Ads pay for a lot of the free web.** Many writers, small sites, and creators rely on ad income. If a site you value shows reasonable ads, consider adding it to **Allowed sites**, or support it directly with a subscription or donation.
- **Respect site terms.** Some sites don't allow ad blockers in their terms of service. You decide whether to block ads, allow them, or leave the site.
- **Don't use it to access pirated content.** Blocking pop-ups makes unsafe sites less annoying, but it doesn't make them legal or safe. Use official sources for movies, shows, and software where you can.
- **Personal use.** This project is for personal, educational use. It's not a commercial ad-blocking service.
- **No guarantees.** It's provided as-is. It may miss ads or occasionally break a site. Use the exceptions list when that happens.

---

## Limitations

These are honest limits of what this extension can do:

- **Small, fixed filter list.** It blocks about 45 ad servers. Full blockers use tens of thousands of rules that update daily. This list never updates itself, so it misses many ads, especially ones served from the site's own domain.
- **YouTube video ads are NOT blocked.** YouTube serves pre-roll and mid-roll ads from the same servers as the videos, so request blocking can't separate them. The extension only hides YouTube's banner, sidebar, in-feed, and overlay ads.
- **Some video players refuse to play when their ads are blocked.** This happens mostly on streaming services. Add an exception for those sites.
- **Ads built into the video stream can't be blocked.** Some sites insert ads directly into the video (server-side ad insertion).
- **Pop-up ad networks change domains constantly.** New throwaway domains will get past the domain list. The per-site pop-up guard handles most of these cases, but:
  - it must be turned on for each site (and again when the site moves to a new address);
  - it can't stop an **invisible link laid over the page**, because that click is a real click by you.
- **Cosmetic hiding is narrow.** Only a few well-known ad box patterns are hidden. You may see empty gaps or ads with custom markup.
- **Sites can detect blocking** and ask you to turn it off.
- **Extension pages are off-limits.** No extension can run on `chrome://` pages or the Chrome Web Store.

### Extra protection built into Chrome

Set Chrome's own pop-up blocker to its strictest setting:
`chrome://settings/content/popups` → **Don't allow sites to send pop-ups or use redirects**.

---

## Customizing

After any change, run `node test.js` (optional), then click the reload icon at `chrome://extensions`.

### Block another ad server
Add the domain to a `requestDomains` list in one of the rule files:

- `rules/ad-rules.json`: normal banner and display ads
- `rules/video-ad-rules.json`: video ad servers
- `rules/popup-ad-rules.json`: pop-up and redirect ad networks (also blocks the whole tab if it gets sent there)

Subdomains are covered automatically: blocking `example-ads.com` also blocks `cdn.example-ads.com`.

**How to find a pop-up ad domain:** when an ad tab opens, copy the domain from its address bar, or press F12 → **Network** on the original site and look for unfamiliar script domains. Add the main part of the domain, e.g. `badads.online`, not the full URL.

### Add a new rule
Copy an existing rule and give it an `id` that isn't used anywhere else **in that file**.

### Hide another element
Add a CSS selector to the `SELECTORS` list in `content.js`. Keep it specific. A broad selector like `[class*="ad"]` hides real content, such as "header" or "download" sections.

---

## Project structure

| File | Purpose |
| --- | --- |
| `manifest.json` | Extension settings and permissions |
| `service-worker.js` | Applies the on/off switch, site exceptions, and pop-up guard sites |
| `content.js` | Hides known ad boxes with one stylesheet |
| `popup-guard.js` | Blocks script-opened pop-up tabs; added only on sites you choose |
| `common.js` | Domain checking shared by the other scripts |
| `popup.html`, `popup.js` | The toolbar popup |
| `rules/ad-rules.json` | Display ad servers |
| `rules/video-ad-rules.json` | Video ad servers |
| `rules/popup-ad-rules.json` | Pop-up and redirect ad networks |
| `test.js` | Self-check (`node test.js`) |
| `.gitignore` | Keeps local, build, and key files out of Git |
