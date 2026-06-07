# Feather AI — Official Website

The official website for **Feather AI Technology Limited**.

## 🌐 Live Site

Deployed via GitHub Pages.

## 🛠 Tech Stack

- Pure HTML / CSS / JavaScript (no framework)
- Responsive design
- 6-language i18n support (EN, 繁中, 简中, 日本語, Français, Deutsch)
- Interactive particle canvas
- CSS animations & glassmorphism

## 🚀 Deployment

1. Push to `main` branch
2. GitHub Actions auto-deploys to GitHub Pages
3. Make sure GitHub Pages source is set to "GitHub Actions" in repo Settings → Pages

## 📁 Structure

```
├── index.html              # Main page
├── css/
│   └── style.css           # All styles
├── js/
│   ├── i18n.js             # Translations & i18n engine
│   └── main.js             # Interactions & animations
├── assets/
│   └── favicon.svg         # Favicon
└── .github/workflows/
    └── deploy.yml          # GitHub Pages deployment
```

## 🌍 Adding / Editing Translations

Edit `js/i18n.js` — each language is a key-value map. Keys match `data-i18n` attributes in HTML.
