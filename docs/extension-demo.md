# 擴充示範：從五篇增加第六篇

本作業把 `git-for-learning-notes.md` 作為擴充範例：它使用和其他文章相同的 JSON metadata、五個章節與來源格式。首頁卡片、分類篇數、文章 HTML 與搜尋資料都不需要手工新增。

## 可重做的驗證

在複製的測試資料夾中（不要刪除原始專案的內容）：

1. 只放入前五篇筆記。因原本 verify-ai-answers、write-an-agents-file 的 related 包含第六篇，先在測試副本中移除這兩筆 related。
2. 執行 `npm run build`、`npm run check`，首頁會有 5 篇、workflow 有 1 篇，尚未產生 Git 筆記頁面。
3. 把 `content/notes/git-for-learning-notes.md` 放回測試副本，不修改 build、CSS、HTML 或 JavaScript。
4. 再執行 build、check、test。首頁變為 6 篇，workflow 變為 2 篇，產生 `dist/notes/git-for-learning-notes.html`。
5. 開啟網站，搜尋「暫存區」，會找到新文章（搜尋範圍包含正文）。

實際執行紀錄另見 `docs/validation.md`。本文件的步驟本身不等於已執行的結果。

## 換成自己的新主題

複製 `templates/note.md`，修改 slug、標題、摘要、標籤與內容，保留五個固定 H2。related 指向存在的文章，featured 維持 false。建置會先驗證資料契約，缺少來源、分類錯誤或連結不存在時直接停止，而不是發布壞掉的頁面。
