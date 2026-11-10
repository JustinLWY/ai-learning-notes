(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const data = JSON.parse($('#notes-data')?.textContent || '[]');
  const valid = new Set(data.map(n => n.slug));
  const keys = { saved: 'ai-notebook.saved.v1', read: 'ai-notebook.read.v1' };
  let storageIssue = false, toastTimer;
  function readSet(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '[]');
      if (!Array.isArray(value)) throw new Error('Invalid stored data');
      return new Set(value.filter(s => typeof s === 'string' && valid.has(s)));
    } catch { storageIssue = true; return new Set(); }
  }
  const saved = readSet(keys.saved), read = readSet(keys.read);
  function toast(message) {
    const el = $('.toast'); if (!el) return;
    el.textContent = message; el.classList.add('visible');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 3300);
  }
  function persist(key, value) {
    try { localStorage.setItem(key, JSON.stringify([...value])); return true; }
    catch { storageIssue = true; toast('目前無法儲存，這次操作會保留到離開頁面。'); return false; }
  }
  let selectedCategory = 'all';
  let savedOnly = new URLSearchParams(location.search).get('saved') === '1';
  const search = $('#search');
  function sync() {
    $$('[data-saved-count]').forEach(el => { el.textContent = saved.size; });
    $$('[data-save]').forEach(button => {
      const on = saved.has(button.dataset.save), note = data.find(n => n.slug === button.dataset.save);
      button.setAttribute('aria-pressed', String(on));
      button.setAttribute('aria-label', `${on ? '取消收藏' : '收藏'}：${note?.title || '筆記'}`);
      const label = button.querySelector('.save-label'); if (label) label.textContent = on ? '已收藏' : '收藏筆記';
    });
    $$('[data-read-state]').forEach(el => { el.textContent = read.has(el.dataset.readState) ? '· 已讀' : ''; });
    $$('[data-path-slug]').forEach(el => el.classList.toggle('is-read', read.has(el.dataset.pathSlug)));
    const steps = $$('[data-path-slug]');
    const progress = $('[data-path-progress]');
    if (progress) progress.textContent = `${steps.filter(el => read.has(el.dataset.pathSlug)).length} / ${steps.length} 篇已讀`;
    const readButton = $('#mark-read');
    if (readButton) {
      const on = read.has(readButton.dataset.read);
      readButton.setAttribute('aria-pressed', String(on));
      readButton.textContent = on ? '✓ 已讀・點此取消' : '✓ 標記為已讀';
    }
    if (search) filter();
  }
  function filter() {
    if (!search) return;
    const terms = search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let count = 0;
    $$('.library [data-note]').forEach(card => {
      const n = data.find(n => n.slug === card.dataset.note);
      const haystack = `${n.title} ${n.summary} ${n.tags.join(' ')} ${n.text}`.toLocaleLowerCase();
      const match = (selectedCategory === 'all' || n.category === selectedCategory) && (!savedOnly || saved.has(n.slug)) && terms.every(t => haystack.includes(t));
      card.hidden = !match; if (match) count++;
    });
    $$('.filter').forEach(button => {
      const active = button.dataset.categoryFilter === selectedCategory;
      button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active));
    });
    const toggle = $('#saved-filter'); if (toggle) toggle.setAttribute('aria-pressed', String(savedOnly));
    $('#result-status').textContent = terms.length || selectedCategory !== 'all' || savedOnly ? `找到 ${count} 篇${savedOnly ? '收藏' : ''}筆記${terms.length ? `，關鍵字「${search.value.trim()}」` : ''}。` : `共 ${count} 篇筆記，找一個今天想懂的問題。`;
    $('#empty-state').hidden = count !== 0;
    $('#empty-description').textContent = savedOnly && saved.size === 0 ? '還沒有收藏。點筆記旁的書籤，留下想再讀的內容。' : '換個關鍵字，或試試其他分類。';
  }
  document.addEventListener('click', async event => {
    const button = event.target.closest('button'); if (!button) return;
    if (button.dataset.save) {
      const slug = button.dataset.save;
      saved.has(slug) ? saved.delete(slug) : saved.add(slug);
      const ok = persist(keys.saved, saved); sync();
      if (ok) toast(saved.has(slug) ? '已加入收藏，留給下次的自己。' : '已取消收藏。');
    }
    if (button.dataset.categoryFilter) { selectedCategory = button.dataset.categoryFilter; filter(); }
    if (button.id === 'saved-filter') {
      savedOnly = !savedOnly;
      try { const url = new URL(location.href); savedOnly ? url.searchParams.set('saved', '1') : url.searchParams.delete('saved'); history.replaceState(null, '', url); } catch {}
      filter();
    }
    if (button.id === 'reset-filters') {
      selectedCategory = 'all'; savedOnly = false; search.value = '';
      try { const url = new URL(location.href); url.searchParams.delete('saved'); history.replaceState(null, '', url); } catch {}
      filter(); search.focus();
    }
    if (button.dataset.read) {
      const slug = button.dataset.read;
      read.has(slug) ? read.delete(slug) : read.add(slug);
      const ok = persist(keys.read, read); sync();
      if (ok) toast(read.has(slug) ? '又前進了一小步。已標記為已讀。' : '已取消已讀記號。');
    }
    if (button.classList.contains('copy-code')) {
      const text = button.closest('.code-block').querySelector('code').textContent;
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(text); toast('已複製，可以開始動手試試。');
      } catch { toast('目前無法自動複製，請選取程式碼後複製。'); }
    }
  });
  search?.addEventListener('input', filter);
  document.addEventListener('keydown', event => {
    if (event.key === '/' && search && !event.ctrlKey && !event.metaKey && !event.altKey && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable) { event.preventDefault(); search.focus(); }
    if (event.key === 'Escape' && document.activeElement === search) { search.value = ''; filter(); search.blur(); }
  });
  window.addEventListener('storage', event => {
    if (!Object.values(keys).includes(event.key) && event.key !== null) return;
    const newSaved = readSet(keys.saved), newRead = readSet(keys.read);
    saved.clear(); newSaved.forEach(s => saved.add(s)); read.clear(); newRead.forEach(s => read.add(s)); sync();
  });
  if (document.body.dataset.slug) {
    let scheduled = false;
    const progress = () => { const max = document.documentElement.scrollHeight - innerHeight; $('.reading-progress').style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 100}%`; scheduled = false; };
    addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(progress); } }, { passive: true });
    addEventListener('resize', progress); progress();
  }
  sync();
  if (storageIssue) toast('本機儲存資料無法讀取；收藏和已讀可先在本頁使用。');
})();
