(() => {
  'use strict';
  const catalogs = window.athenaDownloadLocales;
  const select = document.getElementById('language');
  function match(tag) { const s = String(tag || '').toLowerCase(); return s.startsWith('zh') ? (/hant|tw|hk|mo/.test(s) ? 'zh-Hant' : 'zh-Hans') : s.startsWith('ja') ? 'ja' : s.startsWith('en') ? 'en' : null; }
  function apply(locale) {
    const words = catalogs[locale] || catalogs.en;
    document.documentElement.lang = locale; document.title = words.title; select.value = locale;
    select.setAttribute('aria-label', words.language);
    document.querySelectorAll('[data-i18n]').forEach(node => {
      const text = words[node.dataset.i18n] || catalogs.en[node.dataset.i18n];
      node.replaceChildren(...text.split('\n').flatMap((s, i) => i ? [document.createElement('br'), document.createTextNode(s)] : [document.createTextNode(s)]));
    });
    showBuild();
  }
  let build = null, saved;
  function safe(value) { try { const u = new URL(value); return u.origin === 'https://app.athena.featherhk.com' && u.pathname.startsWith('/downloads/') && !u.username && !u.password && !u.search && !u.hash ? u.href : null; } catch { return null; } }
  function showBuild() {
    if (!build) return;
    document.getElementById('build-detail').textContent = `${build.version} · Apple Silicon · ${(build.bytes / 1048576).toFixed(1)} MB`;
  }
  try { saved = localStorage.getItem('feather-language'); } catch {}
  apply(saved && catalogs[saved] ? saved : (navigator.languages || [navigator.language]).map(match).find(Boolean) || 'en');
  select.addEventListener('change', () => { if (!catalogs[select.value]) return; try { localStorage.setItem('feather-language', select.value); } catch {} apply(select.value); });
  fetch('/release.json', {cache:'no-store'}).then(r => r.ok ? r.json() : null).then(manifest => {
    const item = manifest?.macos;
    if (manifest?.status !== 'limited-preview' || !item || item.architecture !== 'arm64' || !safe(item.url) || !safe(item.checksum_url) || !/^[a-f0-9]{64}$/.test(item.sha256) || !(item.bytes > 0)) return;
    build = item; showBuild();
    const link = document.getElementById('dmg-link'); link.href = safe(item.url); link.hidden = false;
    const checksum = document.getElementById('checksum-link'); checksum.href = safe(item.checksum_url); checksum.hidden = false;
    // This page deliberately labels the current ad-hoc build as an early preview.
  }).catch(() => {});
})();
