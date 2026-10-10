import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const locales = ['en', 'ja', 'zh-Hans', 'zh-Hant'];
const groups = [
  { script: 'js/i18n.js', pages: ['index.html'] },
  { script: 'js/pages-locales.js', pages: ['athena/index.html', 'about/index.html', 'open-source/index.html'] },
  { script: 'js/download-locales.js', pages: ['app/index.html'] },
];
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const emoji = /[\p{Emoji_Presentation}\p{Regional_Indicator}\uFE0F\u200D\u20E3]/u;
const repository = 'https://github.com/featherhk/athena-agent';
const sourceLinks = new Set(['', '/blob/main/README.md', '/blob/main/CONTRIBUTING.md', '/issues', '/security/advisories/new'].map(path => repository + path));
let count = 0;
for (const group of groups) {
  const source = read(group.script);
  const context = { window: {} };
  vm.runInNewContext(source, context, { filename: group.script });
  const catalog = Object.values(context.window)[0];
  assert.deepEqual(Object.keys(catalog).sort(), locales, group.script);
  const keys = Object.keys(catalog.en).sort();
  for (const [locale, entries] of Object.entries(catalog)) {
    assert.deepEqual(Object.keys(entries).sort(), keys, `${group.script}: ${locale} key parity`);
    for (const [key, value] of Object.entries(entries)) {
      assert.equal(typeof value, 'string', `${locale}.${key}`);
      assert(value.trim(), `${locale}.${key} is empty`);
      assert(!emoji.test(value), `${locale}.${key} contains emoji`);
      assert(!/<[^>]+>/.test(value), `${locale}.${key} contains markup`);
    }
  }
  for (const file of group.pages) {
    const html = read(file);
    assert(!emoji.test(html), `${file} contains emoji`);
    for (const match of html.matchAll(/data-(?:i18n|label)="([^"]+)"/g)) {
      assert(keys.includes(match[1]), `${file} missing catalog key ${match[1]}`);
    }
    for (const locale of locales) assert(html.includes(`value="${locale}"`), `${file} selector misses ${locale}`);
    assert(html.includes('/open-source/'), `${file} has no open source navigation`);
    assert(html.includes('class="solid-link"'), `${file} has no primary action`);
    for (const [, attributes, content] of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
      const href = attributes.match(/href="([^"]+)"/)?.[1];
      if (!href) {
        assert(/id="(?:dmg-link|checksum-link)"/.test(attributes) && /\bhidden\b/.test(attributes), `${file}: unbound visible link`);
        continue;
      }
      if (href.includes('chat.athena.featherhk.com')) {
        assert.equal(content.trim(), 'chat.athena.featherhk.com', `${file}: web app must remain a plain domain link`);
        assert(!/class=|data-i18n=|role="button"/.test(attributes), `${file}: web app must not be a CTA`);
      }
      if (href.includes('github.com')) assert(sourceLinks.has(href), `${file}: unrecognized source or private-repository link`);
      if (/class="solid-link"/.test(attributes)) assert.equal(new URL(href).origin, 'https://app.athena.featherhk.com', `${file}: primary action must be Mac distribution`);
    }
    for (const [, attribute, value] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
      if (/^https:\/\//.test(value)) {
        assert(['featherhk.com', 'chat.athena.featherhk.com', 'app.athena.featherhk.com'].includes(new URL(value).hostname)
          || (attribute === 'href' && (value === 'https://support.apple.com/102445' || sourceLinks.has(value))), `${file}: unexpected external ${attribute}`);
        continue;
      }
      if (value.startsWith('#')) {
        assert(html.includes(`id="${value.slice(1)}"`), `${file}: broken anchor ${value}`);
        continue;
      }
      assert(!/^(?:[a-z]+:|\/\/)/i.test(value), `${file}: unexpected URL ${value}`);
      let target = value.startsWith('/') ? path.join(root, value) : path.resolve(root, path.dirname(file), value);
      if (value.endsWith('/')) target = path.join(target, 'index.html');
      assert(fs.existsSync(target), `${file}: missing local ${attribute}: ${value}`);
    }
    count++;
  }
}
const main = read('js/main.js');
for (const file of ['index.html', 'app/index.html']) {
  const html = read(file), aboveFold = html.slice(0, html.indexOf('</section>'));
  assert(aboveFold.includes('data-i18n="platform"') && aboveFold.includes('https://support.apple.com/102445'), `${file}: first-screen requirements and Apple guide`);
  assert(aboveFold.includes('Developer ID') && aboveFold.includes('notarization'), `${file}: explicit signing status`);
}
assert(!/web-link|hero-open/.test(main), 'manifest callback must not restore web CTA');
assert(main.includes("['hero-download', 'download-link']"), 'manifest callback updates both Mac links');
const openSource = read('open-source/index.html');
assert(openSource.includes('Apache License 2.0') && openSource.includes('Earlier MIT grants') && openSource.includes('developer preview'), 'license and preview status must be explicit');
for (const url of sourceLinks) assert(openSource.includes(`href="${url}"`), `source page misses ${url}`);
assert(openSource.includes('without a Feather account') && openSource.includes('Chat Completions') && openSource.includes('not native Anthropic Messages or Responses'), 'source setup and protocol boundaries');
assert(openSource.includes('no prebuilt BYOK installer') && read('app/index.html').includes('This DMG is the hosted preview'), 'source and hosted installer must be distinguished');
assert(!/still private|in preparation|planned local mode|forthcoming local mode|When the repository opens/.test(groups.map(g => read(g.script)).join('\n')), 'outdated source preparation wording');
assert(!/hosted shell and browser execution are not enabled|Voice calling, complete computer control/.test(read('js/pages-locales.js')), 'outdated blanket feature denials');
console.log(`Validated ${count} pages, ${locales.length} locales, local links, Mac CTA, source-release boundaries and emoji-free copy.`);
