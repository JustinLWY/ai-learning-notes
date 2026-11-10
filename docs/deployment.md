# GitHub 上傳與 Pages 發布

本專案無 npm 依賴，使用 Node.js 22 以上即可建置。GitHub 工作流程選用 Node.js 24。

## 方法一：已安裝 Git 和 GitHub CLI

在本專案目錄，以自己的帳號登入 GitHub CLI：

```sh
gh auth login
```

如果尚未初始化本機 Repository，才執行 `git init -b main`。之後：

```sh
npm run build
npm run check
npm test
git add .
git commit -m "feat: create agent-guided AI learning notebook"
gh repo create ai-learning-notes --public --source=. --remote=origin --push
```

若 origin 已存在，先 `git remote -v` 檢查，不要覆蓋既有遠端；Sites 使用的 source remote 也要保留。已有同名 Repository 時選新名稱，不要強制推送覆蓋。

到 GitHub Repository 的 Settings → Pages → Build and deployment → Source 選擇 GitHub Actions。在 Actions 執行「Build and deploy learning notebook」，或推送下一次提交。工作流程成功後，Pages 設定頁會顯示實際網址。

將真實 Repository URL 填入 `src/site.json` 的 repository，重新執行檢查並提交。首頁頁尾會出現原始碼連結。

## 方法二：網頁上傳來源

1. 在 GitHub 建立自己的公開空 Repository。
2. 用 Add file → Upload files，上傳專案來源；不要上傳 .git、.sites-local、artifacts、dist 或 submission-private.md。
3. 檢查隱藏資料夾 `.github/workflows/` 是否一起上傳。若系統未包含它，用 Add file → Create new file 建立 `.github/workflows/pages.yml`，內容照本專案同名檔案。
4. 依上面說明啟用 GitHub Actions 作為 Pages 來源並執行工作流程。

上傳後確認 AGENTS.md 在 Repository 根目錄，且 GitHub Pages 能直接打開一篇文章。不要只繳交本機路徑。

## 發布檢查

- Repository 可由未登入的瀏覽器讀取。
- Actions 內 build 與 deploy 都顯示成功。
- 首頁、任一 notes/*.html、about.html 與 AGENTS.md 下載都可用。
- 更換分類、搜尋正文關鍵字、加入與取消收藏都可用。

網站也支援其他靜態託管服務；可只上傳 dist 內容。但作業另要求 GitHub Repository，因此其他託管網址不能取代原始碼上傳。

## 官方參考

- [GitHub Pages 的用途](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [用自訂工作流程部署 Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
