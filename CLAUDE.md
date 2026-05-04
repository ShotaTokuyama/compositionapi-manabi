# CLAUDE.md — Vue Composition API 学習アプリ

## プロジェクト概要

個人用のVue Composition API学習アプリ。将来的にポートフォリオとして公開する想定。
各APIの「何をするか」ではなく「いつ使うか・使わないか」の判断基準を学ぶコンテンツを提供する。

## 技術スタック

- **フレームワーク**: Nuxt 3
- **言語**: TypeScript（strict モード）
- **UIライブラリ**: Nuxt UI（Tailwind CSS内包）
- **ルーティング**: Nuxt ファイルベースルーティング
- **コンテンツ管理**: TypeScript データファイル（`data/` ディレクトリ）

## ディレクトリ構成

```
app/
├── pages/
│   ├── index.vue                  # ホーム（ヒーロー＋カテゴリ一覧）
│   ├── [category]/index.vue       # カテゴリページ
│   └── [category]/[api].vue       # API詳細ページ
├── layouts/
│   └── default.vue                # サイドバー付きメインレイアウト
├── components/
│   ├── AppSidebar.vue             # カテゴリ・API一覧・検索
│   ├── ApiCard.vue                # カテゴリページのAPIカード
│   ├── CodeBlock.vue              # コード表示
│   ├── PlaygroundLink.vue         # Vue SFC Playgroundリンクボタン
│   └── ApiComparison.vue          # 類似API比較セクション
├── composables/
│   └── usePlaygroundUrl.ts        # PlaygroundURL生成composable
├── data/
│   ├── types.ts                   # 型定義（APIEntry, Category等）
│   ├── index.ts                   # 全データのエクスポートとヘルパー関数
│   ├── reactivity.ts              # Reactivity APIデータ
│   ├── lifecycle.ts               # Lifecycle Hooksデータ
│   ├── di.ts                      # Dependency Injectionデータ
│   └── composables.ts             # Composables設計パターンデータ
└── utils/
    └── playground.ts              # Vue SFC Playground URL生成ユーティリティ
```

## コンテンツルール

### 言語
- **すべての解説文・UIテキストは日本語**
- API名・TypeScript型・コードは英語のまま
- コメントは日本語で記述

### データファイル形式
- 各APIは `data/types.ts` の `APIEntry` インターフェースに従って定義する
- カテゴリIDは `'reactivity' | 'lifecycle' | 'di' | 'composables'` の4種
- `codeExample` は実際に動くVue SFCのソースコード（`<script setup>` + `<template>`）
- `whenToUse` / `whenNotToUse` は箇条書き（配列）で記述

### PlaygroundURL生成
- `utils/playground.ts` の `generatePlaygroundURL()` を使用する
- コンポーネント内では `composables/usePlaygroundUrl.ts` を経由する
- `data/` ファイル内でURLを直接ハードコードしない

## コーディング規約

- `<script setup lang="ts">` を必ず使用
- `defineProps` / `defineEmits` は型引数形式で定義
- composableは `use` プレフィックス必須
- `any` 型は使用禁止。型が不明な場合は `unknown` を使う
- コメントは必要な場合のみ（自明な処理には書かない）

## Nuxt UI 使用指針

- サイドバー: `UNavigationTree` または `UVerticalNavigation`
- 検索: `UInput` でフィルタリング（クライアントサイド）
- コードブロック: `UCard` + Shiki（Nuxt標準のコードハイライト）
- ダークモード: `useColorMode()` composable（Nuxt UI標準）
- アイコン: `@iconify-json/heroicons` を使用

## 新しいAPIコンテンツを追加する場合

1. `data/types.ts` の `APIEntry` 型を確認する
2. 対応するカテゴリの `data/[category].ts` にエントリを追加する
3. `data/index.ts` のエクスポートに含まれていることを確認する
4. `codeExample` は `<script setup>` + `<template>` を含む完全なSFCとする
5. `comparisons` フィールドには類似APIとの使い分けを必ず記述する
