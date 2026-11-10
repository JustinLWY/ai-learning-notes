---
{
  "slug": "build-a-static-page",
  "title": "從一個 HTML 檔，開始你的第一個網頁",
  "summary": "認識內容、外觀與互動的分工，做一頁能在瀏覽器直接開啟的小筆記。",
  "category": "practice",
  "tags": ["HTML", "靜態網站"],
  "date": "2026-11-10",
  "minutes": 5,
  "featured": false,
  "related": ["local-first-bookmarks", "write-an-agents-file"]
}
---

## 學習目標

建立包含標題、段落與連結的 HTML 頁面，並能說明 HTML、CSS、JavaScript 分別負責什麼。

## 核心概念

HTML 表達內容結構，CSS 控制外觀，JavaScript 加上互動。靜態網站使用事先產生的檔案，仍能在瀏覽器裡執行搜尋、篩選與收藏等互動。

先把內容結構寫清楚，再加樣式。主標題用一個 H1，章節用 H2，連結文字說明目的。編輯器與瀏覽器看到的內容不同，修改後記得儲存並重新整理。

## 動手練習

這是本手札設計的練習。建立 `index.html`，貼入範例，再用瀏覽器開啟。

```html
<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>我的第一則學習筆記</title>
</head>
<body>
  <main>
    <h1>今天學會的事</h1>
    <p>我可以用 HTML 整理一則學習筆記。</p>
    <h2>下一步</h2>
    <a href="https://developer.mozilla.org/">閱讀 MDN 文件</a>
  </main>
</body>
</html>
```

預期看到主標題、段落與可點擊的連結。縮窄視窗，確認文字仍可閱讀。把段落換成自己的一句話，儲存、重新整理，確認更新出現。

把多篇筆記做成網站時，不必複製整頁 HTML 再逐篇改導覽。本手札把內容放在 Markdown，由共用版型產生頁面。

## 自我檢核

- [ ] 我的檔案是 .html，而不是 .html.txt。
- [ ] 頁面有語言、編碼、viewport 與標題。
- [ ] 我能解釋內容、樣式與互動的差別。

## 參考資料

- [MDN：Basic HTML syntax（HTML 語法與文件結構）](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Basic_HTML_syntax)
