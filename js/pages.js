(() => {
  'use strict';
  const catalogs = window.featherPageLocales, select = document.getElementById('language');
  const match = tag => { const s = String(tag || '').toLowerCase(); return s.startsWith('zh') ? (/hant|tw|hk|mo/.test(s) ? 'zh-Hant' : 'zh-Hans') : s.startsWith('ja') ? 'ja' : s.startsWith('en') ? 'en' : null; };
  function apply(locale) {
    const c = catalogs[locale] || catalogs.en;
    document.documentElement.lang = locale; document.title = c[document.body.dataset.page + 'Title'];
    document.querySelector('meta[name="description"]').content = c[document.body.dataset.page + 'Intro'];
    select.value = locale; select.setAttribute('aria-label', c.language);
    document.querySelectorAll('[data-i18n]').forEach(node => {
      const text = c[node.dataset.i18n] || catalogs.en[node.dataset.i18n];
      if (text) node.replaceChildren(...text.split('\n').flatMap((s, i) => i ? [document.createElement('br'), document.createTextNode(s)] : [document.createTextNode(s)]));
    });
  }
  let saved; try { saved = localStorage.getItem('feather-language'); } catch {}
  apply(saved && catalogs[saved] ? saved : (navigator.languages || [navigator.language]).map(match).find(Boolean) || 'en');
  select.addEventListener('change', () => { if (!catalogs[select.value]) return; try { localStorage.setItem('feather-language', select.value); } catch {} apply(select.value); });
  document.querySelectorAll('.masthead nav a').forEach(a => { if (a.pathname === location.pathname) a.setAttribute('aria-current', 'page'); });
})();
