(() => {
  'use strict';
  const catalogs = window.featherLocales;
  const language = document.getElementById('language');
  let release = null;
  function match(tag) {
    const value = String(tag || '').toLowerCase();
    if (value.startsWith('zh')) return /hant|tw|hk|mo/.test(value) ? 'zh-Hant' : 'zh-Hans';
    if (value.startsWith('ja')) return 'ja';
    if (value.startsWith('en')) return 'en';
    return null;
  }
  function safeUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && /(^|\.)featherhk\.com$/.test(url.hostname) && !url.username && !url.password ? url.href : null;
    } catch { return null; }
  }
  function apply(locale) {
    const words = catalogs[locale] || catalogs.en;
    document.documentElement.lang = locale;
    document.title = words.title;
    document.querySelector('meta[name="description"]').content = words.description;
    language.value = locale;
    language.setAttribute('aria-label', words.language);
    document.querySelectorAll('[data-i18n]').forEach(node => {
      const text = words[node.dataset.i18n] || catalogs.en[node.dataset.i18n];
      if (text === undefined) return;
      const pieces = text.split('\n');
      node.replaceChildren(...pieces.flatMap((piece, index) => index ? [document.createElement('br'), document.createTextNode(piece)] : [document.createTextNode(piece)]));
    });
    document.querySelectorAll('[data-label]').forEach(node => node.setAttribute('aria-label', words[node.dataset.label]));
    if (release) document.getElementById('release-status').textContent = words.releaseReady;
  }
  let saved;
  try { saved = localStorage.getItem('feather-language'); } catch { /* Storage is optional. */ }
  const initial = saved && catalogs[saved] ? saved : (navigator.languages || [navigator.language]).map(match).find(Boolean) || 'en';
  apply(initial);
  language.addEventListener('change', () => {
    if (!catalogs[language.value]) return;
    try { localStorage.setItem('feather-language', language.value); } catch { /* Storage is optional. */ }
    apply(language.value);
  });
  document.getElementById('year').textContent = String(new Date().getFullYear());
  // Release links become visible only after an operator publishes a verified
  // HTTPS destination. An unbuilt or unsigned download is never advertised.
  fetch('release.json', { cache: 'no-store' }).then(response => response.ok ? response.json() : null).then(manifest => {
    if (!manifest || manifest.status !== 'limited-preview') return;
    const web = safeUrl(manifest.web_url);
    const dmg = manifest.macos?.notarized === true ? safeUrl(manifest.macos.url) : null;
    if (!web && !dmg) return;
    release = manifest;
    if (web) { const link = document.getElementById('web-link'); link.href = web; link.hidden = false; }
    if (dmg) { const link = document.getElementById('download-link'); link.href = dmg; link.hidden = false; }
    document.getElementById('release-links').hidden = false;
    apply(language.value);
  }).catch(() => { /* An unavailable manifest must not create a broken CTA. */ });
})();
