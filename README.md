# Feather / Athena

The public website for [Feather](https://featherhk.com), introducing Athena as its first product. Static HTML, CSS and JavaScript; no framework, external font service, analytics or runtime packages.

## Pages and hosting

- `https://featherhk.com/` — introduction and entry points.
- `https://featherhk.com/athena/` — product, practical uses and Mac/web differences.
- `https://featherhk.com/about/` — principles, data handling and frequently asked questions.
- `https://app.athena.featherhk.com/` — dedicated Mac distribution page, installation details and checksum.
- `https://chat.athena.featherhk.com/` — authenticated Athena web application, deployed separately.

The static site is served by Caddy on Tencent Cloud, from `/opt/athena/site`. Source remains versioned on GitHub. `www.featherhk.com` redirects to the canonical root domain. GitHub Pages is no longer the domain's hosting origin; its old deployment can be retained temporarily for rollback. Existing mail and domain-verification DNS records are independent and must not be changed.

The download host serves `app/index.html` at `/`, shared `/assets/`, `/css/`, `/js/` and `/release.json` from the site root, and immutable `/downloads/<revision>/` artifacts from a separate directory. Publish only those static files: never copy `.git`, source credentials, user data or a development directory wholesale.

## Local preview

```sh
python3 -m http.server 4399 --bind 127.0.0.1
```

Visit `/`, `/athena/`, `/about/` and `/app/`. English, Japanese, Simplified Chinese and Traditional Chinese use native language names without flags. Unsupported browser languages fall back to English. The Athena app has its own nine-language catalog. Locale preference stays in optional local storage. The SVG artwork, warm-paper palette, ink and muted-purple accents follow Athena's design language.

## Publishing a release

Update `release.json` only after HTTPS, authentication, the artifact and its checksum have passed acceptance. `web_url` points to the chat origin; `app_url` points to the distribution page. A `macos` entry includes version, architecture, bytes, SHA-256, immutable artifact/checksum URLs, Git revision and the real notarization status.

The current Mac download is explicitly an **unnotarized Apple Silicon test build for invited accounts**. Do not claim a signed public release or advise disabling Gatekeeper globally. A later notarized release needs a fresh, post-stapling checksum and updated copy. New accounts are disabled with zero credit; payments and recharge are not available. Full computer control and real-time voice calls are not advertised as completed features.

Before publishing, check all four page routes, navigation, locale selection, FAQ expansion, narrow-screen layout, browser console errors, exact release URLs and the downloaded file hash. The release page must remain usable if its manifest cannot be loaded; it must not invent a working download.
