import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const sections = ['學習目標', '核心概念', '動手練習', '自我檢核', '參考資料'];
export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function safeHref(url) {
  if (/^https:\/\/[^\s<>"'\\]+$/.test(url)) {
    try { const u = new URL(url); if (!u.username && !u.password && u.hostname) return url; } catch {}
  }
  if (/^#[a-zA-Z0-9-]+$/.test(url)) return url;
  throw new Error(`不支援或不安全的連結：${url}`);
}

export function inline(text) {
  const pieces = [];
  const token = (html) => { pieces.push(html); return `\u0000${pieces.length - 1}\u0000`; };
  let result = text.replace(/`([^`]+)`/g, (_, code) => token(`<code>${escapeHtml(code)}</code>`));
  result = result.replace(/\[([^\]\n]+)\]\(([^\s)]+)\)/g, (_, label, url) => token(`<a href="${escapeHtml(safeHref(url))}"${url.startsWith('https:') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escapeHtml(label)}</a>`));
  result = escapeHtml(result).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return result.replace(/\u0000(\d+)\u0000/g, (_, n) => pieces[Number(n)]);
}

export function renderMarkdown(body) {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const output = [], headings = [];
  let paragraph = [], list = null, fence = null, code = [], headingCount = 0;
  const closeParagraph = () => { if (paragraph.length) output.push(`<p>${inline(paragraph.join(' '))}</p>`); paragraph = []; };
  const closeList = () => { if (list) output.push(`</${list}>`); list = null; };
  for (const line of lines) {
    if (line.startsWith('```')) {
      closeParagraph(); closeList();
      if (fence !== null) {
        output.push(`<div class="code-block"><div class="code-toolbar"><span>${escapeHtml(fence || 'text')}</span><button class="copy-code" type="button">複製程式碼</button></div><pre><code>${escapeHtml(code.join('\n'))}</code></pre></div>`);
        fence = null; code = [];
      } else {
        fence = line.slice(3).trim();
        if (!/^[a-zA-Z0-9-]*$/.test(fence)) throw new Error('程式碼語言名稱不合法');
      }
      continue;
    }
    if (fence !== null) { code.push(line); continue; }
    if (!line.trim()) { closeParagraph(); closeList(); continue; }
    const heading = /^(#{2,3}) (.+)$/.exec(line);
    if (heading) {
      closeParagraph(); closeList();
      const id = `section-${++headingCount}`;
      output.push(`<h${heading[1].length} id="${id}">${inline(heading[2])}</h${heading[1].length}>`);
      if (heading[1].length === 2) headings.push({ id, title: heading[2] });
      continue;
    }
    const item = /^(?:- |\d+\. )(.+)$/.exec(line);
    if (item) {
      closeParagraph();
      const type = /^\d/.test(line) ? 'ol' : 'ul';
      if (list !== type) { closeList(); output.push(`<${type}>`); list = type; }
      const check = /^\[([ xX])\] (.+)$/.exec(item[1]);
      output.push(check ? `<li class="check-item"><span aria-hidden="true">${check[1] === ' ' ? '□' : '☑'}</span>${inline(check[2])}</li>` : `<li>${inline(item[1])}</li>`);
      continue;
    }
    if (line.startsWith('> ')) { closeParagraph(); closeList(); output.push(`<blockquote>${inline(line.slice(2))}</blockquote>`); continue; }
    if (/^#/.test(line)) throw new Error('正文只支援 H2 / H3 標題');
    paragraph.push(line.trim());
  }
  if (fence !== null) throw new Error('程式碼區塊未關閉');
  closeParagraph(); closeList();
  return { html: output.join('\n'), headings };
}

export function parseNote(text, filename, site, today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(text);
  if (!match) throw new Error(`${filename} 缺少 JSON front matter`);
  let data;
  try { data = JSON.parse(match[1]); } catch { throw new Error(`${filename} 的 JSON 格式錯誤`); }
  const fail = (message) => { throw new Error(`${filename}: ${message}`); };
  if (!data || typeof data !== 'object' || Array.isArray(data)) fail('metadata 必須是物件');
  if (typeof data.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug) || `${data.slug}.md` !== filename) fail('slug 與檔名必須一致');
  if (typeof data.title !== 'string' || data.title.trim().length < 4) fail('標題過短');
  if (typeof data.summary !== 'string' || data.summary.trim().length < 16) fail('摘要至少十六個字');
  if (!site.categories.some(c => c.id === data.category)) fail('分類不存在');
  if (!Array.isArray(data.tags) || data.tags.length < 1 || data.tags.length > 6 || data.tags.some(t => typeof t !== 'string' || !t.trim()) || new Set(data.tags).size !== data.tags.length) fail('標籤需為 1–6 個不重複字串');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || !Number.isFinite(Date.parse(data.date)) || new Date(data.date).toISOString().slice(0, 10) !== data.date || data.date > today) fail('日期無效或晚於今天');
  if (!Number.isInteger(data.minutes) || data.minutes < 1 || data.minutes > 30) fail('minutes 必須為 1–30 整數');
  if (typeof data.featured !== 'boolean') fail('featured 必須為布林值');
  if (!Array.isArray(data.related) || data.related.some(s => typeof s !== 'string' || s === data.slug) || new Set(data.related).size !== data.related.length) fail('related 格式錯誤、重複或指向自己');
  const body = match[2].trim();
  const prose = body.replace(/```[^\n]*\n[\s\S]*?```/g, '');
  if (/<\/?[a-zA-Z][^>]*>|!\[[^\]]*\]\(|^\s*\|/m.test(prose)) fail('正文不支援原始 HTML、圖片或表格');
  const actual = [...prose.matchAll(/^## (.+)$/gm)].map(h => h[1].trim());
  if (JSON.stringify(actual) !== JSON.stringify(sections)) fail('五個 H2 章節需依範本順序各出現一次');
  if (!/^- \[ \] /m.test(prose)) fail('缺少自我檢核清單');
  const sources = prose.split('## 參考資料')[1] || '';
  if (!/\[[^\]]+\]\(https:\/\/[^)]+\)/.test(sources)) fail('需有 https 參考來源');
  const rendered = renderMarkdown(body);
  return { ...data, body, ...rendered };
}

export async function loadContent() {
  const site = JSON.parse(await readFile(path.join(root, 'src/site.json'), 'utf8'));
  if (!Array.isArray(site.categories) || new Set(site.categories.map(c => c.id)).size !== site.categories.length || site.categories.some(c => !/^[a-z0-9-]+$/.test(c.id))) throw new Error('分類設定無效');
  if (site.repository && !/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(site.repository)) throw new Error('Repository URL 無效');
  const files = (await readdir(path.join(root, 'content/notes'))).filter(f => f.endsWith('.md')).sort();
  const notes = await Promise.all(files.map(async f => parseNote(await readFile(path.join(root, 'content/notes', f), 'utf8'), f, site)));
  const slugs = new Set(notes.map(n => n.slug));
  if (slugs.size !== notes.length) throw new Error('文章 slug 重複');
  if (notes.filter(n => n.featured).length !== 1) throw new Error('請維持恰好一篇精選文章');
  for (const note of notes) for (const related of note.related) if (!slugs.has(related)) throw new Error(`${note.slug} 的延伸閱讀不存在：${related}`);
  if (!Array.isArray(site.learningPath) || new Set(site.learningPath).size !== site.learningPath.length || site.learningPath.some(s => !slugs.has(s))) throw new Error('學習路線包含重複或不存在的文章');
  notes.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
  return { site, notes };
}
