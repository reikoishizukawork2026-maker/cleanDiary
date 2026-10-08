# cleandiary

カレンダー付きの日記アプリです。ブラウザで開いて使います。

- 月のカレンダーから日付を選んで、その日の日記を書けます（過去・今日・未来のどの日付にも書けます）
- 日記を書いた日には、カレンダーに印が付きます
- 日記はタイトル（任意・50 文字まで）と本文（必須・5,000 文字まで）で、1 日 1 件です
- キーワードで、タイトルと本文を検索できます

## 日記の保存先について

日記は、使っているブラウザの中（localStorage）に保存します。サーバーには送りません。

- 保存した日記は、**同じパソコンの同じブラウザでしか見られません**
- ブラウザの閲覧データ（Cookie とサイトデータ）を消すと、**日記も消えます**

## 動かし方

[Node.js](https://nodejs.org/)（バージョン 22.22 以上）が必要です。

```sh
npm install      # 初回だけ。必要なパッケージを入れる
npm run dev      # 開発用に起動する → http://localhost:5173 を開く
```

## コマンド

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発用に起動する。ファイルを保存すると画面にすぐ反映される |
| `npm test` | テストを実行する |
| `npm run test:watch` | ファイルを保存するたびにテストを実行する |
| `npm run lint` | コードの書き方をチェックする |
| `npm run build` | 公開用のファイルを `dist/` に作る |
| `npm run preview` | `npm run build` で作ったものを起動して確認する |

## フォルダ構成

```
src/
  main.jsx            アプリの入り口
  App.jsx             画面の切り替え（React Router）を用意する
  routes.jsx          URL と画面の対応表
  pages/              画面（カレンダー、日記表示、日記編集、検索結果）
  components/         画面を組み立てる部品
  hooks/              カスタムフック（未保存の警告）
  storage/            日記の保存・読み込み・検索（localStorage）
  utils/              日付の計算、検索結果の表示用の関数
  test/               テスト用の設定と道具
```

画面の URL は次のとおりです（サーバーを持たないため、`#` の後ろで画面を切り替えています）。

| URL | 画面 |
|---|---|
| `#/` または `#/?month=2026-10` | カレンダー |
| `#/diary/2026-10-08` | 日記表示 |
| `#/diary/2026-10-08/edit` | 日記編集 |
| `#/search?q=キーワード` | 検索結果 |

## 使っている技術

- [React](https://react.dev/)（JavaScript）
- [Vite](https://vite.dev/)（開発用サーバーとビルド）
- [React Router](https://reactrouter.com/)（画面の切り替え）
- [Vitest](https://vitest.dev/) と [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)（テスト）
- [oxlint](https://oxc.rs/docs/guide/usage/linter)（lint）
