# Feather / Athena

The public website for [Feather](https://featherhk.com), introducing Athena as its first product. Static HTML, CSS and JavaScript; no framework, external font service, analytics or runtime packages.

## Pages and hosting

- `https://featherhk.com/` — introduction and entry points.
- `https://featherhk.com/athena/` — product, practical uses and Mac/web differences.
- `https://featherhk.com/about/` — principles, data handling and frequently asked questions.
- `https://featherhk.com/open-source/` — source-release status, hosted/local distinction and contribution principles.
- `https://app.athena.featherhk.com/` — dedicated Mac distribution page, installation details and checksum.
- `https://chat.athena.featherhk.com/` — authenticated Athena web application, deployed separately.

The static site is served by Caddy on Tencent Cloud, from `/opt/athena/site`. Source remains versioned on GitHub. `www.featherhk.com` redirects to the canonical root domain. GitHub Pages is no longer the domain's hosting origin; its old deployment can be retained temporarily for rollback. Existing mail and domain-verification DNS records are independent and must not be changed.

The download host serves `app/index.html` at `/`, shared `/assets/`, `/css/`, `/js/` and `/release.json` from the site root, and immutable `/downloads/<revision>/` artifacts from a separate directory. Publish only those static files: never copy `.git`, source credentials, user data or a development directory wholesale.

## Local preview

```sh
python3 -m http.server 4399 --bind 127.0.0.1
```

Run `node scripts/check-site.mjs` to validate routes, localized copy and publication boundaries. Visit `/`, `/athena/`, `/about/`, `/open-source/` and `/app/`. English, Japanese, Simplified Chinese and Traditional Chinese use native language names without flags. Unsupported browser languages fall back to English. The Athena app has its own nine-language catalog. Locale preference stays in optional local storage. The SVG artwork, warm-paper palette, ink and muted-purple accents follow Athena's design language.

## Publishing a release

Update `release.json` only after HTTPS, authentication, the artifact and its checksum have passed acceptance. `web_url` points to the chat origin; `app_url` points to the distribution page. A `macos` entry includes version, architecture, bytes, SHA-256, immutable artifact/checksum URLs, Git revision and the real notarization status.

The current Mac download is explicitly an **unnotarized Apple Silicon test build for invited accounts**. Do not claim a signed public release or advise disabling Gatekeeper globally. A later notarized release needs a fresh, post-stapling checksum and updated copy. Hosted use requires enabled access and credit. The [public source edition](https://github.com/featherhk/athena-agent) is published under Apache License 2.0; earlier MIT grants and third-party notices remain valid. It supports local setup without a Feather account using a Chat Completions API or an already running compatible local model. It does not provide native Anthropic Messages or Responses support. The hosted DMG is separate and still requires account credit; do not describe it as a prebuilt BYOK installer. Voice and computer interactions are evolving; avoid claiming they are either absent or production-complete without verification.

Before publishing, check all five page routes, navigation, locale selection, FAQ expansion, narrow-screen layout, browser console errors, exact release URLs and the downloaded file hash. The release page must remain usable if its manifest cannot be loaded; it must not invent a working download.

The main call to action is the Mac distribution page. The web app is a plain domain link, not a second onboarding button. Keep official copy free of emoji and flags. Static website changes must not overwrite `release.json`: the production manifest may be newer than this checkout. Publish only an explicit allowlist of changed HTML, CSS, JavaScript and assets, and verify the manifest hash remains unchanged.
