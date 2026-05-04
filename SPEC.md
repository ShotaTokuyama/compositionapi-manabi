# SPEC.md — Vue Composition API 学習アプリ 仕様書

作成日: 2026-05-04

---

## 1. プロジェクト概要

### 目的

Vue Composition APIを「いつ使うか・使わないか」の判断基準まで含めて習得するための個人学習アプリ。
将来的にポートフォリオとして公開し、Vueへの理解の深さを示すコンテンツ品質を目指す。

### 学習ゴール

- Reactivity / Lifecycle / Dependency Injection / Composables設計の主要APIを網羅的に理解する
- 「似たAPIのどちらを選ぶか」の判断基準を身につける
- 設計上の落とし穴（意図しないリアクティビティ等）を事前に知る

### ターゲットユーザー

自分自身（Composition APIに触れた経験あり。setup/refは使えるが深いAPIや設計応用に不安がある状態）

---

## 2. 機能仕様

### 2-1. ホームページ（`/`）

| 要素 | 内容 |
|------|------|
| ヒーローセクション | アプリ名・キャッチコピー・簡潔な説明文 |
| カテゴリ一覧 | 4カテゴリのカード（名前・説明・アイコン・API数） |
| ナビゲーション | 各カテゴリカードクリックでカテゴリページへ遷移 |

### 2-2. カテゴリページ（`/[category]`）

| 要素 | 内容 |
|------|------|
| カテゴリ名・説明 | ページ上部に表示 |
| APIカード一覧 | カテゴリに属するAPIをグリッド表示 |
| APIカード内容 | API名・一行説明・「詳細を見る」リンク |

### 2-3. API詳細ページ（`/[category]/[api]`）

各APIの詳細ページ。以下のセクションを順番に表示する。

#### ① ヘッダー情報
- API名（例: `shallowRef()`）
- カテゴリバッジ
- 一行サマリー

#### ② シグネチャ
- TypeScript関数シグネチャのコード表示

#### ③ 解説
- 詳細な日本語解説テキスト

#### ④ いつ使うか / 使わないか
- 「使うべきケース」箇条書き
- 「使うべきでないケース」箇条書き

#### ⑤ よくある落とし穴（あれば）
- 注意すべき挙動・誤解しやすい点

#### ⑥ コード例
- シンタックスハイライト付きコード表示
- 「Vue SFC Playgroundで開く」ボタン（新規タブで開く）

#### ⑦ 類似APIとの比較（あれば）
- 比較対象APIへのリンク
- 違いの概要
- 「こちらを使うべきケース」vs「相手を使うべきケース」の対比表示

#### ⑧ 関連API
- 関連するAPIへのリンクリスト

### 2-4. サイドバー（全ページ共通）

| 機能 | 仕様 |
|------|------|
| API検索 | 入力テキストでAPI名をフィルタリング（クライアントサイド） |
| カテゴリ別リスト | 4カテゴリのグループ化されたAPIリンク |
| アクティブ表示 | 現在表示中のAPIをハイライト |
| モバイル対応 | ハンバーガーメニューでドロワー表示 |

### 2-5. グローバル機能

| 機能 | 仕様 |
|------|------|
| ダークモード | ヘッダーのトグルで切り替え。`useColorMode()` で永続化 |
| レスポンシブ | モバイル（〜768px）・タブレット・PC に対応 |
| Vue Playgroundリンク | 各APIのコード例をVue SFC Playgroundで開く |

---

## 3. 対象API一覧

### Phase 1（本実装対象）

#### Reactivity API（12件）

| API | 説明 |
|-----|------|
| `ref()` | 任意の値をリアクティブな参照にする（深い追跡） |
| `reactive()` | オブジェクトをリアクティブにする（深い追跡） |
| `computed()` | 依存値から派生する算出プロパティを作る |
| `watch()` | 特定のソースを明示的に監視して副作用を実行する |
| `watchEffect()` | 依存を自動追跡しながら副作用を実行する |
| `shallowRef()` | 表層のみリアクティブな参照（深い追跡なし） |
| `shallowReactive()` | 表層のみリアクティブなオブジェクト |
| `toRef()` / `toRefs()` | reactive オブジェクトのプロパティを ref に変換する |
| `readonly()` | リアクティブオブジェクトを読み取り専用にする |
| `isRef()` / `isReactive()` / `isReadonly()` | リアクティビティ状態の判定ユーティリティ |
| `unref()` | ref なら `.value` を、それ以外はそのまま返す |
| `triggerRef()` | shallowRef の手動更新トリガー |

#### Lifecycle Hooks（5件）

| API | 説明 |
|-----|------|
| `onMounted()` | DOMマウント後に実行 |
| `onUnmounted()` | コンポーネント破棄時のクリーンアップ |
| `onBeforeMount()` / `onBeforeUnmount()` | マウント・アンマウント直前 |
| `onUpdated()` / `onBeforeUpdate()` | リアクティブ更新後・直前 |
| `onErrorCaptured()` | 子孫コンポーネントのエラーキャプチャ |

#### Dependency Injection（1件）

| API | 説明 |
|-----|------|
| `provide()` + `inject()` | 祖先から子孫コンポーネントへの依存注入 |

#### Composables設計（2パターン）

| パターン | 説明 |
|----------|------|
| useXxx() 基礎 | リアクティブな状態とロジックを抽出する基本パターン |
| useXxx() 応用 | イベントリスナー・非同期処理を含む実践的パターン |

### Phase 2（将来追加候補）

- `effectScope()` / `onScopeDispose()`
- `customRef()`
- `shallowReadonly()`
- `markRaw()`
- `toRaw()`
- `watchPostEffect()` / `watchSyncEffect()`

---

## 4. データモデル

### 型定義（`data/types.ts`）

```typescript
export type APICategory = 'reactivity' | 'lifecycle' | 'di' | 'composables'

export interface APIComparison {
  targetAPI: string      // 比較対象API名（id）
  summary: string        // 違いの概要（日本語）
  useThisWhen: string    // このAPIを使うべきケース
  useOtherWhen: string   // 比較対象を使うべきケース
}

export interface APIEntry {
  id: string             // URLスラッグ（例: "shallowRef"）
  name: string           // 表示名（例: "shallowRef()"）
  category: APICategory
  summary: string        // 一行日本語説明
  signature: string      // TypeScript関数シグネチャ
  description: string    // 詳細日本語解説
  whenToUse: string[]    // 使うべきケース（箇条書き）
  whenNotToUse: string[] // 使うべきでないケース
  pitfalls?: string[]    // よくある落とし穴
  relatedAPIs: string[]  // 関連APIのid配列
  comparisons?: APIComparison[]
  codeExample: string    // Vue SFCソースコード（Playground用）
}

export interface Category {
  id: APICategory
  name: string           // 表示名（日本語）
  description: string    // 説明（日本語）
  icon: string           // Heroiconsアイコン名
}
```

### ヘルパー関数（`data/index.ts`）

```typescript
getAllAPIs(): APIEntry[]                          // 全APIを返す
getCategoryAPIs(category: APICategory): APIEntry[] // カテゴリ別API一覧
getAPIById(id: string): APIEntry | undefined      // ID検索
getAllCategories(): Category[]                     // 全カテゴリ情報
```

---

## 5. Vue SFC Playground URL生成

Vue公式Playgroundは `lz-string` によるLZ圧縮+Base64でSFCコードをURLに埋め込む。

```typescript
// utils/playground.ts
import lzString from 'lz-string'

export function generatePlaygroundURL(sfcCode: string): string {
  const encoded = lzString.compressToBase64(sfcCode)
  return `https://play.vuejs.org/#${encoded}`
}
```

各APIの `codeExample` は `<script setup>` + `<template>` を含む完全なSFC文字列として保持し、
表示時に `generatePlaygroundURL()` で動的にURLを生成する。

---

## 6. 画面レイアウト仕様

### デスクトップ（768px以上）

```
┌──────────────────────────────────────────────────┐
│ ヘッダー: アプリ名 / ダークモード切替              │
├────────────┬─────────────────────────────────────┤
│ サイドバー │ メインコンテンツ                     │
│ [検索ボックス]          │                          │
│                        │                          │
│ Reactivity             │  API詳細コンテンツ       │
│  ref                   │                          │
│  reactive              │                          │
│  computed              │                          │
│  ...                   │                          │
│ Lifecycle              │                          │
│  onMounted             │                          │
│  ...                   │                          │
└────────────┴─────────────────────────────────────┘
```

### モバイル（768px未満）

```
┌────────────────────────────┐
│ ☰  アプリ名  🌙            │
├────────────────────────────┤
│                            │
│  メインコンテンツ          │
│                            │
└────────────────────────────┘
（ハンバーガーでドロワー展開）
```

---

## 7. 技術制約・トレードオフ

| 決定事項 | 採用理由 | トレードオフ |
|----------|----------|-------------|
| TypeScriptデータファイル | 型安全・IDEサポート | Markdownより記述量が多い |
| SFCコードを文字列で保持 | Playground連携が容易 | コードの独立したテスト困難 |
| Playground外部リンク | 実装コスト最小 | ページを離れる必要がある |
| 進捗管理なし | シンプルさ優先 | 学習状況の把握ができない |
| Nuxt UI | Nuxtとの相性・デザイン品質 | カスタマイズの自由度がやや低い |

---

## 8. 非機能要件

- **レスポンシブ**: Tailwindブレークポイント（`sm` / `md` / `lg`）で対応
- **アクセシビリティ**: Nuxt UIコンポーネントのデフォルトa11y属性を活用
- **パフォーマンス**: 全APIデータはビルド時に静的に確定。実行時のデータ取得なし
- **ブラウザサポート**: モダンブラウザ（Chrome/Firefox/Safari/Edge最新版）
