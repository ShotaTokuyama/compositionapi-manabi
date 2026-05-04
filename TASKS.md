# TASKS.md — Vue Composition API 学習アプリ 実装タスク

作成日: 2026-05-04

---

## Phase 1: プロジェクト基盤の構築

### T1-1: Nuxt 3 プロジェクト初期化 ✅

- [x] `nuxi init` でNuxt **4** プロジェクト作成（uiテンプレート、pnpm）
- [x] TypeScript設定（`tsconfig.json` — Nuxt 4方式で`.nuxt/tsconfig.*.json`参照）
- [x] `.gitignore` 設定（テンプレートに含まれていた）

### T1-2: 依存パッケージのインストール ✅

- [x] `@nuxt/ui` v4（テンプレートに含まれていた）
- [x] `lz-string` インストール（Playground URL生成用、型定義内包）
- [x] `@iconify-json/heroicons` インストール
- [x] `nuxt.config.ts` に `@nuxt/ui` モジュール登録済み

### T1-3: 型定義ファイルの作成（`data/types.ts`）✅

- [x] `APICategory` 型を定義
- [x] `APIEntry` インターフェースを定義（SPEC.mdのデータモデル参照）
- [x] `APIComparison` インターフェースを定義
- [x] `Category` インターフェースを定義

### T1-4: Playground URLユーティリティ（`utils/playground.ts`）✅

- [x] `lz-string` を使った `generatePlaygroundURL(sfcCode: string): string` を実装
- [ ] Vue SFC Playground URL形式の動作確認（実際にPlaygroundで開けるか）— Phase 2で確認

### T1-5: Playground URL composable（`composables/usePlaygroundUrl.ts`）✅

- [x] `usePlaygroundUrl(code: string)` composableを実装
- [x] `utils/playground.ts` をラップして返す

### T1-6: レイアウト構築（`app.vue`）✅

> Nuxt 4 + Nuxt UI v4 では `layouts/default.vue` ではなく `app.vue` に直接実装するパターンを採用。

- [x] Nuxt UIのレイアウトコンポーネントを使ってサイドバー＋メインの2カラム構成を作成
- [x] ヘッダー（アプリ名・ダークモード切替ボタン）
- [x] サイドバー領域（`AppSidebar.vue` を埋め込み）
- [x] モバイル時のハンバーガーメニュー対応（`UDrawer`）

### T1-7: サイドバーコンポーネント（`components/AppSidebar.vue`）✅

- [x] API名検索ボックス（`UInput` でリアルタイムフィルタリング、API名・サマリーをマッチ）
- [x] カテゴリ別にグループ化したAPIナビゲーションリスト（カテゴリアイコン付き）
- [x] 現在表示中のAPIのアクティブスタイル（`bg-primary/10 text-primary`）
- [x] データ未登録カテゴリには「コンテンツ準備中」を表示

### T1-8: 共通コンポーネントの作成 ✅

- [x] `components/CodeBlock.vue` — Shikiによるクライアントサイドシンタックスハイライト・ダークモード対応
- [x] `components/PlaygroundLink.vue` — Playgroundで開くボタン
- [x] `components/ApiComparison.vue` — 類似API比較セクション（2カラム対比）
- [x] `components/ApiCard.vue` — カテゴリページ用APIカード

---

## Phase 2: コンテンツ層の構築（Reactivity API）

### T2-1: カテゴリデータとヘルパー関数 ✅

- [x] `data/index.ts` に `Category` データ（4件）を定義
- [x] ヘルパー関数を実装（`getAllAPIs`, `getCategoryAPIs`, `getAPIById`, `getAllCategories`）
- [x] 各カテゴリデータファイル（`reactivity.ts` / `lifecycle.ts` / `di.ts` / `composables.ts`）のスタブ作成

### T2-2: Reactivity APIデータ（`data/reactivity.ts`）

以下の各APIについて `APIEntry` 形式でコンテンツを記述:

- [x] `ref()` — 解説・whenToUse/whenNotToUse・pitfalls・codeExample・vs reactive比較
- [x] `reactive()` — 解説・vs ref比較
- [x] `computed()` — getter/setter・副作用の禁止・vs watch比較
- [x] `watch()` — ソースの種類・flush オプション・vs watchEffect比較
- [x] `watchEffect()` — 自動依存追跡・即時実行・vs watch比較
- [x] `shallowRef()` — 浅いリアクティビティの意味・triggerRef連携・vs ref比較
- [x] `shallowReactive()` — vs reactive比較
- [x] `toRef()` / `toRefs()` — reactive分割代入の問題解決
- [x] `readonly()` — 読み取り専用の保証・provide/inject連携
- [x] `isRef()` / `isReactive()` / `isReadonly()` — ガード関数としての使い方
- [x] `unref()` — ref/非refの統一的な扱い方
- [x] `triggerRef()` — shallowRefとの組み合わせのみ有効

### T2-3: ページ実装 ✅

- [x] `pages/index.vue` — ホームページ（ヒーロー＋カテゴリカード一覧）
- [x] `pages/[category]/index.vue` — カテゴリページ（API一覧グリッド）
- [x] `pages/[category]/[api].vue` — API詳細ページ（全セクション表示）

### T2-4: Reactivity APIコンテンツの動作確認

- [x] 開発サーバーで全Reactivity API詳細ページを確認
- [x] Playgroundリンクが正しいコードで開くことを確認
- [x] 比較セクションの表示確認
- [x] モバイルでのレイアウト確認

---

## Phase 3: コンテンツ追加（Lifecycle / DI / Composables）

### T3-1: Lifecycle Hooksデータ（`data/lifecycle.ts`）

- [x] `onMounted()` — DOMアクセス・非同期初期化・vs onBeforeMount比較
- [x] `onUnmounted()` — クリーンアップ・メモリリーク防止パターン
- [x] `onBeforeMount()` / `onBeforeUnmount()`
- [x] `onUpdated()` / `onBeforeUpdate()` — DOM更新後の処理・無限ループの罠
- [x] `onErrorCaptured()` — エラーバウンダリパターン

### T3-2: Dependency Injectionデータ（`data/di.ts`）

- [x] `provide()` + `inject()` — Symbol keyパターン・型安全なinject・readonlyの組み合わせ

### T3-3: Composables設計データ（`data/composables.ts`）

- [x] `useXxx()` 基礎パターン — 状態とロジックの抽出・`ref`の返し方・命名規則
- [x] `useXxx()` 応用パターン — イベントリスナー管理（onMountedとonUnmountedのセット）・非同期処理

### T3-4: Phase 3コンテンツの動作確認

- [x] Lifecycle / DI / Composablesの全詳細ページ確認
- [x] サイドバーの全カテゴリ・全APIリンク確認
- [x] ダークモード切替確認
- [x] レスポンシブ確認（モバイル・タブレット）

---

## Phase 4: デプロイ対応（後回し）

> ⚠️ このフェーズはPhase 1〜3完了後に着手する。

### T4-1: Vercelデプロイ設定

- [ ] Vercelアカウントとリポジトリを連携
- [ ] `nuxt.config.ts` にVercel向け設定を追加（必要に応じて）
- [ ] 本番ビルド確認（`nuxi build`）

### T4-2: GitHub Pagesオプション（代替案）

- [ ] `nuxt.config.ts` に `ssr: false` または `nitro.preset: 'github-pages'` 設定
- [ ] GitHub Actions ワークフロー作成（`nuxi generate` → gh-pagesブランチにデプロイ）

### T4-3: 公開前チェック

- [ ] OGP メタタグの設定
- [ ] ページタイトル・Descriptionの確認
- [ ] 404ページの実装
- [ ] Lighthouse スコア確認

---

## 進捗メモ

作業ログをここに残す（日付・完了事項・課題など）

---
