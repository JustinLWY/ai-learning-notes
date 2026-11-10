import { cp, mkdir, mkdtemp, readFile, writeFile, unlink } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import assert from 'node:assert/strict';
import { root } from './content.mjs';

const scratch = path.join(root, '.sites-local');
await mkdir(scratch, { recursive: true });
const clone = await mkdtemp(path.join(scratch, 'extension-'));
for (const directory of ['src', 'content', 'scripts', 'templates', 'tests', 'docs', '.github']) await cp(path.join(root, directory), path.join(clone, directory), { recursive: true });
for (const file of ['AGENTS.md', 'package.json']) await cp(path.join(root, file), path.join(clone, file));
const gitFile = path.join(clone, 'content/notes/git-for-learning-notes.md');
const sixth = await readFile(gitFile, 'utf8');
await unlink(gitFile); // Remove only the copied fixture, never original content.
for (const slug of ['verify-ai-answers', 'write-an-agents-file']) {
  const file = path.join(clone, 'content/notes', `${slug}.md`);
  const text = await readFile(file, 'utf8');
  const updated = text.replace(/^---\n([\s\S]*?)\n---/, (_, json) => { const data = JSON.parse(json); data.related = data.related.filter(s => s !== 'git-for-learning-notes'); return `---\n${JSON.stringify(data, null, 2)}\n---`; });
  await writeFile(file, updated);
}
const run = script => execFileSync(process.execPath, [path.join(clone, 'scripts', script)], { cwd: clone, encoding: 'utf8' });
run('build.mjs'); run('check.mjs');
const count = text => (text.match(/class="note-card"/g) || []).length;
assert.equal(count(await readFile(path.join(clone, 'dist/index.html'), 'utf8')), 5);
await writeFile(gitFile, sixth);
run('build.mjs'); run('check.mjs');
const home = await readFile(path.join(clone, 'dist/index.html'), 'utf8');
assert.equal(count(home), 6);
assert.ok(home.includes('"git-for-learning-notes"'));
assert.ok(home.includes('暫存區'));
assert.ok(home.includes('data-category-filter="workflow" aria-pressed="false">工作流程 <span>2</span>'));
assert.ok((await readFile(path.join(clone, 'dist/notes/git-for-learning-notes.html'), 'utf8')).includes('用 Git 留下每一次學習的版本'));
console.log('擴充驗證通過：測試副本從 5 篇 → 6 篇；只加回一份 Markdown，即更新文章頁、書架、workflow 計數與全文搜尋資料。');
console.log('原始專案內容保持完整。');
