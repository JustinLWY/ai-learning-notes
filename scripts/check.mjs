import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { root, loadContent } from './content.mjs';

const { notes, site } = await loadContent();
const out = path.join(root, 'dist');
let links = 0, pages = 0;
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { await walk(file); continue; }
    if (!entry.name.endsWith('.html')) continue;
    pages++;
    const html = await readFile(file, 'utf8');
    if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) throw new Error(`${file} 必須恰有一個 H1`);
    if (!html.includes('lang="zh-Hant"') || !html.includes('name="viewport"')) throw new Error(`${file} 缺少語言或 viewport`);
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const href = match[1];
      if (/^https:\/\//.test(href)) continue;
      if (/^(?:[a-z]+:|\/\/|\/)/i.test(href)) throw new Error(`${file} 需使用相對資源路徑：${href}`);
      const [resource, fragment] = href.split('#');
      const clean = decodeURIComponent(resource.split('?')[0]);
      let target = clean ? path.resolve(path.dirname(file), clean) : file;
      if (target !== out && !target.startsWith(out + path.sep)) throw new Error(`連結超出 dist：${href}`);
      let info;
      try { info = await stat(target); } catch { throw new Error(`失效連結 ${path.relative(out, file)} → ${href}`); }
      if (info.isDirectory()) target = path.join(target, 'index.html');
      await stat(target);
      if (fragment && target.endsWith('.html')) {
        const destination = target === file ? html : await readFile(target, 'utf8');
        if (!destination.includes(`id="${fragment}"`)) throw new Error(`不存在的錨點 ${file} → ${href}`);
      }
      links++;
    }
    if (html.includes('undefined') || html.includes('[object Object]')) throw new Error(`${file} 有未正確轉換的內容`);
  }
}
await walk(out);
if (pages !== notes.length + 3) throw new Error(`輸出頁數不符：${pages}，預期 ${notes.length + 3}；請清除過期的產物`);
for (const note of notes) {
  const html = await readFile(path.join(out, 'notes', `${note.slug}.html`), 'utf8');
  if (!html.includes(`data-slug="${note.slug}"`)) throw new Error(`缺少文章識別 ${note.slug}`);
}
for (const file of ['AGENTS.md', 'templates/note.md', '.github/workflows/pages.yml', 'docs/extension-demo.md']) await stat(path.join(root, file));
console.log(`檢查通過：${notes.length} 篇筆記、${site.categories.length} 個分類、${pages} 頁、${links} 個站內資源及錨點。`);
console.log('外部參考資料不在此離線檢查中自動請求；發布狀態需另行確認。');
