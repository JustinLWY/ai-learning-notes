---
{
  "slug": "local-first-bookmarks",
  "title": "讓收藏留下來：認識瀏覽器本機儲存",
  "summary": "用 localStorage 理解重新整理後仍存在的資料，也弄清楚換裝置與清除資料的限制。",
  "category": "practice",
  "tags": ["JavaScript", "localStorage"],
  "date": "2026-11-10",
  "minutes": 4,
  "featured": false,
  "related": ["build-a-static-page", "verify-ai-answers"]
}
---

## 學習目標

辨認記憶體與瀏覽器儲存空間的差別，理解這個網站的收藏為何不會自動出現在另一台裝置。

## 核心概念

localStorage 以字串保存資料，依網站來源區分。一般情況下它可跨工作階段保存資料；不同網站、瀏覽器與裝置的資料不會自動合併。

清單可先用 `JSON.stringify` 轉為字串，再用 `JSON.parse` 還原。使用者可能關閉儲存權限，資料也可能損毀或被清除，讀寫都需處理例外。本機儲存不適合保管密碼。

## 動手練習

這是本手札設計的練習。開啟本網站任一筆記，按「收藏筆記」，回首頁切換「我的收藏」，然後重新整理。

- 預期收藏仍在，而且數量一致。
- 取消收藏，確認清單立即更新；最後一篇取消時出現空清單提示。
- 換瀏覽器開啟相同網址，觀察收藏不會自動出現。

在自己建立的測試網頁中，可執行以下程式碼理解格式：

```javascript
try {
  localStorage.setItem('practice-notes', JSON.stringify(['first-note']));
  const notes = JSON.parse(localStorage.getItem('practice-notes') || '[]');
  console.log(notes);
} catch (error) {
  console.log('儲存目前無法使用，請保留當次操作。');
}
```

預期印出包含一個字串的陣列；有儲存限制時走到例外處理。直接開啟 file 網址時，各瀏覽器的儲存行為可能不同，需要穩定測試時使用本專案的 HTTP 預覽。

## 自我檢核

- [ ] 我知道 JSON 轉換與還原在哪一步。
- [ ] 我知道清除瀏覽器資料會影響收藏。
- [ ] 我不會把本機收藏描述為帳號同步。

## 參考資料

- [MDN：Window.localStorage（來源範圍、保存與例外）](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
