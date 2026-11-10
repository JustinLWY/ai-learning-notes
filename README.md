# AI 學習手札

物理系116 林威億｜第九週「建立自己的 AGENTS.md」作業。

一個以 AI 學習為主題、可持續新增內容的繁體中文筆記網站。專案重點是把目的、風格、內容格式、檔案配置與驗收流程寫進 [AGENTS.md](AGENTS.md)，再由同一套版型呈現真正的內容。

## 網站內容

- 首頁、6 篇完整筆記、關於頁與 404 頁。
- 三類主題：觀念入門、動手實作、工作流程。
- 全文搜尋、分類篩選、收藏篩選、四步學習路線。
- 瀏覽器本機收藏與已讀狀態、文章目錄、程式碼複製。
- 響應式版面、鍵盤焦點、搜尋快捷鍵 `/`、略過導覽與減少動畫設定。
- 可從網站下載 AGENTS.md 與新文章範本。

原始碼：[JustinLWY/ai-learning-notes](https://github.com/JustinLWY/ai-learning-notes)。

公開網站：[AI 學習手札](https://ai-learning-notes-lin-2026.clearcup23.chatgpt.site)。GitHub Pages 發布狀態見 [發布狀態](docs/publication.md)。

## 本機啟動

安裝 Node.js 22 以上後，在專案根目錄執行（不需要 npm install）：

```sh
npm run build
npm run check
npm test
npm run dev
```

瀏覽 `http://127.0.0.1:4173`。也能直接開啟 `dist/index.html` 閱讀；瀏覽器對 file 網址的 localStorage 行為可能不同，互動驗收請用 HTTP 預覽。build 輸出不含外部字型、第三方腳本或遠端圖片。

## 新增內容

先讀 [AGENTS.md](AGENTS.md)，複製 [templates/note.md](templates/note.md) 到 `content/notes/`。metadata 使用 JSON，正文依固定五章撰寫，附官方來源與可檢查的練習。再執行 build、check、test。

建置會自動產生新文章、更新篇數、分類與搜尋資料。請勿直接修改 dist。完整範例見 [擴充示範](docs/extension-demo.md)。

## GitHub Pages

完整來源提交到 GitHub 後，在 Repository 的 Settings → Pages 選擇 GitHub Actions。內附工作流程會驗證、建置並部署 dist。詳細操作見 [部署說明](docs/deployment.md)。

## 目錄

```text
AGENTS.md                 AI 協作規則
content/notes/            Markdown 筆記來源
templates/note.md         新文章範本
src/site.json             全站設定與路線
src/assets/               共用 CSS、JS 與 SVG 圖示
scripts/                  建置、驗證、預覽
tests/                    核心行為測試
docs/                     部署、擴充與驗收紀錄
.github/workflows/        GitHub Pages 工作流程
.openai/hosting.json      Sites 託管設定
dist/                     產生的網站（不提交）
```

本網站以 AI 輔助設計、撰寫與實作。文章屬教學整理；示範提示詞與練習為專案設計，不是個人實驗成果。繳交時應自行閱讀並確認內容。
