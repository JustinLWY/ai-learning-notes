---
{
  "slug": "write-an-agents-file",
  "title": "把合作方式寫下來：我的 AGENTS.md",
  "summary": "把專案目的、內容格式與驗收步驟交代清楚，讓下一次 AI 協作接得上這一次。",
  "category": "workflow",
  "tags": ["AGENTS.md", "AI 協作"],
  "date": "2026-11-10",
  "minutes": 5,
  "featured": false,
  "related": ["from-question-to-prompt", "git-for-learning-notes"]
}
---

## 學習目標

寫出讓 AI 能繼續維護同一專案的規則，再用新增文章的任務檢查規則是否具體。

## 核心概念

AGENTS.md 是給程式代理的專案說明，可以記錄建置指令、程式風格與測試方式。本網站進一步記錄文章資料契約、視覺規則與檔案位置，讓 AI 知道從哪裡改、怎麼驗證。

「維持風格一致」還不夠具體。本專案寫成暖白底、深藍文字、共用 CSS 變數及固定五個章節；把「測試一下」改成可執行的指令與應觀察的互動。架構變更時也要更新文件。

## 動手練習

這是本手札設計的練習。先下載網站的專案規則，再使用以下任務：

```text
先閱讀 AGENTS.md 與 templates/note.md。
新增「用小步驟拆解網頁需求」，slug 為 small-web-tasks。
分類 workflow、閱讀時間 4 分鐘、featured false。
依固定五章撰寫，加入可檢查的練習與官方來源。
只新增內容檔，沿用版型。
執行 npm run build、npm run check、npm test 並回報。
```

預期只新增 `content/notes/small-web-tasks.md` 就能產生文章頁，更新首頁書架、分類篇數與全文搜尋。檢查標題、來源與相關連結；若 AI 還得猜資料應放哪裡，就補寫規則。

專案附有 `docs/extension-demo.md`，說明如何重做新增第六篇 Git 筆記的驗證，讓可延伸性有具體檢查步驟。

## 自我檢核

- [ ] 規則列出目錄、命名方式與建置指令。
- [ ] 新文章格式能由程式檢查。
- [ ] 我知道新增內容後哪些地方自動更新。

## 參考資料

- [AGENTS.md 官方網站（用途與專案指引）](https://agents.md/)
