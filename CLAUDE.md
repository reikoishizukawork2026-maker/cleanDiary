# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクトの状態

カレンダー付き日記アプリ「cleandiary」。2026-10-08 に Vite + React（JavaScript）の雛形を作成した。開発は次の手順で進める（各ステップの終わりにコミットする）:

0. 準備（雛形・テスト環境）← 完了
1. 日付計算（`src/utils/`）と localStorage の読み書き（`src/storage/`）、およびそのテスト ← 完了
2. React Router で 4 画面の切り替え ← 完了
3. カレンダー画面
4. 日記の表示と削除
5. 日記の編集・保存・未保存の警告
6. キーワード検索
7. 仕上げ（見た目、手動確認、ビルド確認）

ユーザーへの回答は日本語で行う。

## コマンド

- `npm run dev`: 開発サーバーを起動（http://localhost:5173）
- `npm test`: テストを 1 回実行（Vitest + React Testing Library、環境は jsdom）
- `npm test -- src/routes.test.jsx`: 1 ファイルだけテストを実行
- `npm run test:watch`: ファイルの変更を監視してテストを実行
- `npm run lint`: lint（oxlint、設定は `.oxlintrc.json`）
- `npm run build`: 本番用にビルド（`dist/` に出力）

テストは対象ファイルの隣に `*.test.js(x)` として置く。共通の設定は `src/test/setup.js`（各テストの後に localStorage を空にする）。画面のテストは `src/test/renderWithRouter.jsx` で URL を指定して表示する。

## 構成

- 言語は JavaScript（TypeScript は使わない）
- `src/pages/`: 画面、`src/components/`: 部品、`src/storage/`: localStorage の読み書き、`src/utils/`: 日付の計算

## 要件定義

要件の正本は Claude Docs の「カレンダー付き日記アプリ 要件定義書」: https://claude.ai/code/artifact/d505bd72-f170-48c6-be5c-fb2e95fb233f
実装前に読み、要件と食い違う変更をする場合はユーザーに確認する。

決定済みの前提:

- ブラウザで開く Web アプリ。フロントエンドは React、サーバーは持たない
- 日記はブラウザ内（localStorage）に保存する。日付をキーに 1 日 1 件
- 日記の項目: 日付、タイトル（任意・50 文字まで）、本文（必須・5,000 文字まで）、作成日時、更新日時
- 過去・今日・未来のどの日付にも書ける
- カレンダーは月表示で、週は月曜日始まり
- 画面は 4 つ: カレンダー（起点）、日記表示、日記編集、検索結果
- v1 の必須機能: 月カレンダー、月の切り替え、記入済みの印、日記の作成・閲覧・編集・削除（削除は確認あり）、保存、未保存の警告、キーワード検索
- v1 では作らない: 気分の記録、ダークモード、ログイン、複数ユーザー、写真の添付、他端末との同期
- 学習用の題材なので、画面や部品（コンポーネント）ごとにファイルを分け、読みやすい構成にする
- 画面の切り替えは React Router（`react-router` パッケージ）。URL と画面の対応は `src/routes.jsx` にまとめる
  - `/` カレンダー、`/diary/:date` 日記表示、`/diary/:date/edit` 日記編集、`/search?q=` 検索結果（日付は `YYYY-MM-DD`）
  - サーバーを持たないため `createHashRouter` を使う（URL は `#/diary/...` の形）。未保存の警告で `useBlocker` を使うため、データルーター（`createHashRouter` + `RouterProvider`）にしている
- 全画面に共通する枠（ヘッダー）は `src/components/Layout.jsx`
