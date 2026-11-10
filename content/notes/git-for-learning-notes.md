---
{
  "slug": "git-for-learning-notes",
  "title": "用 Git 留下每一次學習的版本",
  "summary": "把筆記修訂保存成小而清楚的提交，回顧改了什麼，也讓發布流程有跡可循。",
  "category": "workflow",
  "tags": ["Git", "版本管理"],
  "date": "2026-11-10",
  "minutes": 4,
  "featured": false,
  "related": ["write-an-agents-file", "verify-ai-answers"]
}
---

## 學習目標

在自己的練習 Repository 中檢視一次筆記修改、建立提交，再找回這次變動的說明。

## 核心概念

Git 用提交保存專案狀態。工作目錄中的變動不會自動成為提交；先檢視差異，挑選暫存區內容，最後建立提交。GitHub 是可託管 Repository 的服務之一，本機提交與推送遠端是不同步驟。

修正概念、補上來源、改寫練習，都可用簡短提交訊息留下理由。一次提交集中處理一個主題，之後回顧會更容易。

## 動手練習

這是本手札設計的練習。請在自己的副本操作，不要覆寫既有檔案。修改一句話，再依序檢視：

```sh
git status
git diff
git add content/notes/git-for-learning-notes.md
git diff --cached
git commit -m "docs: clarify note revision workflow"
git log -1 --oneline
```

把 add 的路徑換成實際修改的檔案。預期暫存差異只包含準備提交的句子，最後一行顯示新的提交識別碼與訊息。若尚未設定 Git 身分，依提示設定自己的姓名與電子郵件。

最後執行 `git status`，確認沒把瀏覽器資料、密碼或 dist 加入。發布前仍要通過內容檢查，成功推送也不代表部署成功。

## 自我檢核

- [ ] 我能區分工作目錄、暫存區與提交。
- [ ] 我提交前看過實際差異。
- [ ] 我知道 commit、push 與部署是不同階段。

## 參考資料

- [Git：gittutorial（提交、差異與歷史）](https://git-scm.com/docs/gittutorial)
