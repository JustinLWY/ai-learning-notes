import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { root, inline, parseNote, renderMarkdown, loadContent, safeHref } from '../scripts/content.mjs';

const site = JSON.parse(await readFile(path.join(root, 'src/site.json'), 'utf8'));
const fixture = await readFile(path.join(root, 'content/notes/from-question-to-prompt.md'), 'utf8');
const parse = text => parseNote(text, 'from-question-to-prompt.md', site, '2026-11-10');
test('程式碼中的 HTML 被轉義，不能成為執行中的標籤', () => {
  const { html } = renderMarkdown('```html\n<script>alert(1)</script>\n```');
  assert.ok(html.includes('&lt;script&gt;')); assert.ok(!html.includes('<script>'));
});
test('拒絕可執行連結與帶有帳密的外部連結', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,test', '//example.com', 'https://user:pass@example.com', 'https://a.com/"']) assert.throws(() => safeHref(url));
  assert.equal(safeHref('https://developer.mozilla.org/'), 'https://developer.mozilla.org/');
});
test('連結文字不被當作 HTML 執行', () => {
  assert.match(inline('[<img src=x>](https://example.com/)'), /&lt;img/);
});
test('未關閉程式碼與跳級標題會被拒絕', () => {
  assert.throws(() => renderMarkdown('```js\nconst x = 1;'), /未關閉/);
  assert.throws(() => renderMarkdown('# 偷加主標題'), /H2/);
});
test('有效文章具有固定章節與目錄', () => {
  const note = parse(fixture); assert.equal(note.headings.length, 5); assert.equal(note.slug, 'from-question-to-prompt');
});
test('錯誤 slug 與無效日曆日期不進入建置', () => {
  assert.throws(() => parse(fixture.replace('"slug": "from-question-to-prompt"', '"slug": "../escape"')), /slug/);
  assert.throws(() => parse(fixture.replace('2026-11-10', '2026-02-30')), /日期/);
  assert.throws(() => parse(fixture.replace('2026-11-10', '2027-01-01')), /日期/);
});
test('遺漏章節、任意 HTML 與沒有來源的文章不合格', () => {
  assert.throws(() => parse(fixture.replace('## 學習目標', '## 隨意標題')), /章節/);
  assert.throws(() => parse(fixture + '\n<div>unsafe</div>'), /HTML/);
  assert.throws(() => parse(fixture.slice(0, fixture.indexOf('- [Anthropic'))), /來源/);
});
test('全站內容的延伸閱讀、精選與學習路線可解析', async () => {
  const { notes, site } = await loadContent();
  assert.ok(notes.length >= 6); assert.equal(notes.filter(n => n.featured).length, 1);
  assert.ok(site.learningPath.every(s => notes.some(n => n.slug === s)));
});
