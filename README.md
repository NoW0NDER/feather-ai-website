# Feather / Athena

A static product website for [featherhk.com](https://featherhk.com), introducing Athena as Feather's first product. English, Japanese, Simplified Chinese and Traditional Chinese catalogs use native language names without flags. Browser language matching falls back to English.

## Preview

```sh
python3 -m http.server 4321 --bind 127.0.0.1
```

No build, external font service, analytics or runtime package is required. The illustration is original SVG; the example conversation is clearly labeled. Palette and typography follow Athena's warm-paper, ink and muted-purple design language.

## Release publication

The default page truthfully says **private preview / preparing**. Update `release.json` only after the endpoint and artifact are verified:

```json
{
  "status": "limited-preview",
  "web_url": "https://app.featherhk.com/",
  "macos": {
    "url": "https://downloads.featherhk.com/Athena-VERSION-arm64.dmg",
    "notarized": true
  }
}
```

These are examples, not active destinations. Links accept HTTPS on featherhk.com or its subdomains. The download is shown only for a notarized artifact; do not mark unsigned builds notarized. Keep `macos` null until signed, notarized and installed successfully on a clean system. New accounts currently have no credit; access requires explicit operator enablement. No payment or recharge channel is advertised.

Publish through the repository’s existing GitHub Pages deployment settings. Preserve `CNAME`. Do not publish placeholder company claims, invented contact details, or claims of capabilities still in development.
