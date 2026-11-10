---
{
  "slug": "verify-ai-answers",
  "title": "回答很流暢，然後呢？練習查核 AI",
  "summary": "分開檢查主張、來源與推論，避免把看似合理的回答直接當成事實。",
  "category": "foundations",
  "tags": ["資訊查核", "批判思考"],
  "date": "2026-11-10",
  "minutes": 4,
  "featured": false,
  "related": ["from-question-to-prompt", "git-for-learning-notes"]
}
---

## 學習目標

從 AI 回答抽出可查核的主張，找出支持它的原始文件，標記仍不確定的部分。

## 核心概念

生成式 AI 可能產生錯誤內容，甚至給出看似完整但不存在的引用。流暢程度不能取代證據。查核時把回答拆成三層：它**聲稱什麼**、**依據在哪裡**，以及從依據到結論**做了什麼推論**。

對軟體功能與版本等會變動的資訊，要檢查文件日期和適用版本。對計算問題，先看量綱、假設與極限情況。這是本手札採用的學習檢查流程，不是準確率保證。

## 動手練習

這是本手札設計的練習。讓 AI 回答「GitHub Pages 是否可以直接執行 Python 後端？請附來源」，再自己開啟 GitHub 官方說明。

- 抽出主張：Pages 提供哪一種網站託管？
- 在文件中區分「建置時執行程式」與「訪客請求時執行後端」。
- 確認來源存在，而且直接支持回答；連到官方首頁仍不夠。
- 以「有支持／缺少支持／需要更新」標記，再寫自己的修正版。

預期能說明：Pages 發布靜態檔案；在建置流程中使用 Python，不等於 Pages 會執行 Python 後端。若答案混淆兩者，就標記並修正。

## 自我檢核

- [ ] 我打開引用並確認內容支持回答。
- [ ] 我能區分事實、推論與建議。
- [ ] 我會保留不確定性，不用猜測補上缺口。

## 參考資料

- [NIST：Generative Artificial Intelligence Profile（生成式 AI 風險脈絡）](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
- [GitHub：What is GitHub Pages?（靜態網站服務）](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
