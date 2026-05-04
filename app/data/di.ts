import type { APIEntry } from './types'

export const diAPIs: APIEntry[] = [
  // ─── provide() ────────────────────────────────────────────────
  {
    id: 'provide',
    name: 'provide()',
    category: 'di',
    summary: '祖先コンポーネントから子孫全体に値を注入する。propsのバケツリレーを避けるための仕組み。',
    signature: `function provide<T>(key: InjectionKey<T> | string, value: T): void

// InjectionKey — 型安全なキー定義
const key: InjectionKey<T> = Symbol()`,
    description: `\`provide()\` は祖先コンポーネントが値をコンポーネントツリーに「公開」するための関数です。どれだけ深くネストされた子孫コンポーネントでも、\`inject()\` を呼ぶだけで受け取れます。

**propsのバケツリレー（prop drilling）** を避けるための主要な手段です。テーマ・認証情報・i18n設定など、多くのコンポーネントで共有されるが毎回propsで渡したくない値に適しています。

**キーには \`Symbol\` ベースの \`InjectionKey<T>\` を使うのが推奨パターンです。** 文字列キーは異なるライブラリ間で衝突する恐れがあり、型情報も失われます。

**\`readonly()\` との組み合わせ**が重要です。\`provide()\` で渡した \`reactive\` オブジェクトは子孫から直接変更できてしまいます。変更は祖先が提供するメソッド経由のみに制限するため、\`readonly()\` でラップして渡すパターンが推奨です。`,
    whenToUse: [
      'テーマ・ロケール・認証情報など、コンポーネントツリー全体で共有する設定値を渡すとき',
      '中間コンポーネントに関係のないpropsをバケツリレーせずに済ませたいとき',
      'composable（`useXxx`）と組み合わせてアプリ全体の状態管理を構築するとき',
    ],
    whenNotToUse: [
      '直接の親子間のデータ受け渡し——propsで十分',
      'アプリ全体のグローバル状態管理——Pinia などの状態管理ライブラリを検討する',
      '頻繁に変わる状態——provide/injectは変化検知が発生するが、最適化が難しい',
    ],
    pitfalls: [
      '文字列キー（`provide("theme", value)`）は型安全ではなく、キーの衝突リスクもあります。`Symbol()` + `InjectionKey<T>` パターンを使ってください。',
      '`provide()` は `setup()` の同期フェーズ内で呼ぶ必要があります。非同期処理の後（`await` 以降）で呼ぶと動作しません。',
      '`reactive` オブジェクトをそのまま provide すると、子孫から変更できてしまいます。`readonly()` でラップして渡し、変更はメソッド経由に限定してください。',
    ],
    relatedAPIs: ['inject', 'readonly', 'reactive'],
    comparisons: [
      {
        targetAPI: 'inject()',
        summary: 'provide と inject は常にペアで使う。provide が「公開」、inject が「取得」。単独では成立しない。',
        useThisWhen: '祖先コンポーネントで値を公開するとき',
        useOtherWhen: '子孫コンポーネントで値を受け取るとき',
      },
    ],
    codeExample: `<script setup lang="ts">
import { reactive, readonly, provide } from 'vue'
import type { InjectionKey } from 'vue'

// ✅ Symbol + InjectionKey で型安全なキーを定義
interface ThemeContext {
  isDark: boolean
  toggle: () => void
}
export const ThemeKey: InjectionKey<ThemeContext> = Symbol('theme')

// 状態と更新メソッド
const theme = reactive({ isDark: false })

function toggle() {
  theme.isDark = !theme.isDark
}

// readonly でラップして provide — 子孫からの直接変更を防ぐ
provide(ThemeKey, {
  isDark: readonly(theme).isDark, // プリミティブは computed で渡す方がベター
  toggle,
})

// 実用的には computed ref を使う
import { computed } from 'vue'
const isDarkRef = computed(() => theme.isDark)
provide(ThemeKey, { isDark: isDarkRef.value, toggle })
</script>

<template>
  <div
    :style="{
      fontFamily: 'sans-serif',
      padding: '16px',
      background: theme.isDark ? '#1a202c' : '#fff',
      color: theme.isDark ? '#e2e8f0' : '#1a202c',
      minHeight: '100px',
      borderRadius: '4px',
      transition: 'all 0.2s',
    }"
  >
    <p style="margin: 0 0 12px;">現在のテーマ: {{ theme.isDark ? '🌙 ダーク' : '☀️ ライト' }}</p>
    <button
      @click="toggle"
      style="padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; background: #42b883; color: white;"
    >
      テーマ切替
    </button>
    <p style="margin: 12px 0 0; font-size: 12px; opacity: 0.6;">
      ※ このデモでは provide の設定を同コンポーネントで確認しています。<br>
      実際は子孫コンポーネントから inject() で受け取ります。
    </p>
  </div>
</template>`,
  },

  // ─── inject() ─────────────────────────────────────────────────
  {
    id: 'inject',
    name: 'inject()',
    category: 'di',
    summary: '祖先コンポーネントが provide した値を取得する。キーが一致する最も近い祖先から受け取る。',
    signature: `// デフォルト値なし（見つからない場合は undefined）
function inject<T>(key: InjectionKey<T> | string): T | undefined

// デフォルト値あり
function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T

// デフォルト値をファクトリ関数で指定（オブジェクト生成コストを避けたい場合）
function inject<T>(
  key: InjectionKey<T> | string,
  defaultValue: () => T,
  treatDefaultAsFactory: true
): T`,
    description: `\`inject()\` は \`provide()\` でツリーに公開された値を取得します。同じキーが複数の祖先から提供されている場合、**最も近い祖先**の値が優先されます。

**デフォルト値を設定する**ことで、provide されていない環境（単体テスト・Storybookなど）でも安全に動作します。

**型安全のために \`InjectionKey<T>\` を使うと**、TypeScript が inject の戻り値の型を自動的に推論します。文字列キーでは \`as T\` キャストが必要になり型安全性が下がります。

**inject は必ず \`setup()\` の同期フェーズか、\`setup()\` から呼ばれる composable 内で使います。** 非同期処理の後（\`await\` 以降）では動作しません。`,
    whenToUse: [
      '祖先が `provide()` した値を子孫コンポーネントで受け取るとき',
      'composable 内で provide された値を使いたいとき（composable を呼ぶコンポーネントが provide していれば機能する）',
    ],
    whenNotToUse: [
      '直接の親子関係——props を使う（意図が明確になる）',
      'provide されているかどうか不明なとき——デフォルト値を必ず設定する',
    ],
    pitfalls: [
      'inject は `setup()` の同期フェーズ内でのみ呼び出せます。`await` の後に inject を呼ぶと動作しません。',
      'デフォルト値を省略すると戻り値の型に `undefined` が含まれます。存在を保証したい場合は非null assertionより、デフォルト値を設定するかエラーをスローする方が安全です。',
      '`inject()` した値が `reactive` オブジェクトの場合、provide 側が `readonly()` でラップしていなければ変更できてしまいます。変更してよいかどうかは provide 側の設計に従ってください。',
    ],
    relatedAPIs: ['provide', 'readonly', 'ref'],
    comparisons: [
      {
        targetAPI: 'provide()',
        summary: 'provide が「値を公開する祖先側」、inject が「値を受け取る子孫側」。常にペアで設計する。',
        useThisWhen: '子孫コンポーネント・composable で provide された値を受け取るとき',
        useOtherWhen: '祖先コンポーネントで値を公開するとき',
      },
    ],
    codeExample: `<script setup lang="ts">
import { inject, computed } from 'vue'
import type { InjectionKey, Ref } from 'vue'

// provide 側と同じ InjectionKey を import して使う（型安全）
interface UserContext {
  user: Ref<{ name: string; role: 'admin' | 'viewer' }>
  logout: () => void
}
const UserKey: InjectionKey<UserContext> = Symbol('user')

// ✅ デフォルト値を設定してフォールバック
const { user, logout } = inject(UserKey, {
  user: { value: { name: 'ゲスト', role: 'viewer' as const } } as Ref<{ name: string; role: 'admin' | 'viewer' }>,
  logout: () => console.warn('ログアウト機能が provide されていません'),
})

const isAdmin = computed(() => user.value.role === 'admin')
</script>

<template>
  <div style="font-family: sans-serif; padding: 16px; background: #f7fafc; border-radius: 4px;">
    <p>ユーザー: <strong>{{ user.name }}</strong></p>
    <p>ロール: <strong>{{ user.role }}</strong></p>
    <p v-if="isAdmin" style="color: #42b883;">✅ 管理者権限あり</p>
    <p v-else style="color: #718096;">👤 閲覧のみ</p>
    <button
      @click="logout"
      style="padding: 6px 12px; background: #e53e3e; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 8px;"
    >
      ログアウト
    </button>
    <p style="margin-top: 12px; font-size: 11px; color: #718096;">
      ※ このデモは provide なしで動作するためデフォルト値（ゲストユーザー）を使用
    </p>
  </div>
</template>`,
  },

  // ─── provide + inject パターン（実践）─────────────────────────
  {
    id: 'provide-inject-pattern',
    name: 'provide / inject 設計パターン',
    category: 'di',
    summary: 'Symbol キー・readonly・composable ラッパーを組み合わせた、型安全で保守しやすい provide/inject の実践パターン。',
    signature: `// 推奨パターン: キー・型・provide・inject をひとつのファイルに集約
// composables/useTheme.ts

import { inject, provide, reactive, readonly } from 'vue'
import type { InjectionKey } from 'vue'

interface ThemeContext { ... }
const ThemeKey: InjectionKey<ThemeContext> = Symbol('ThemeKey')

export function provideTheme() { ... }  // 祖先コンポーネントで呼ぶ
export function useTheme() { ... }      // 子孫コンポーネントで呼ぶ`,
    description: `provide / inject を使うとき、いくつかのベストプラクティスを組み合わせることでメンテナンスしやすいコードになります。

**パターン1: Symbol + InjectionKey で型安全にする**
文字列キーは型情報がなく衝突リスクもあります。\`InjectionKey<T>\` を使うと inject の戻り値が自動的に型推論されます。

**パターン2: composable にラップして隠蔽する**
キーや provide/inject の呼び出し方を composable（\`provideXxx\` / \`useXxx\`）にまとめると、呼び出し側はキーを意識せずに使えます。

**パターン3: readonly でラップして変更を制限する**
reactive オブジェクトをそのまま provide すると子孫から変更できてしまいます。\`readonly()\` でラップして、変更は祖先が提供するメソッド経由のみにします。

**パターン4: inject が見つからない場合に明示的にエラーを出す**
デフォルト値として \`undefined\` を返すより、provide されていない場合に例外をスローする方が、デバッグ時の原因特定が容易です。`,
    whenToUse: [
      'チームで共有するコンポーネントライブラリや、再利用性の高い機能を provide/inject で構築するとき',
      'provide 側と inject 側が別ファイルに分かれていて、キーを安全に共有したいとき',
    ],
    whenNotToUse: [
      '小規模・単一ファイルでの簡易的な共有——過設計になる',
    ],
    pitfalls: [
      '`provideXxx()` を呼ぶコンポーネントより「上」のコンポーネントから inject しようとしても取得できません。provide はツリーの「下方向」にのみ伝播します。',
    ],
    relatedAPIs: ['provide', 'inject', 'readonly', 'reactive'],
    comparisons: [
      {
        targetAPI: 'Pinia',
        summary: 'provide/inject はコンポーネントツリー内の局所的な依存注入に向く。Pinia はアプリ全体で共有するグローバル状態管理に向く。用途が異なるので競合しない。',
        useThisWhen: '特定のコンポーネントサブツリー内でスコープされた状態や機能を共有するとき',
        useOtherWhen: 'ルーターをまたぐようなアプリ全体の状態（カート・認証・通知など）',
      },
    ],
    codeExample: `<script setup lang="ts">
// ── composables/useCounter.ts に相当するロジック ──────────────
import { reactive, readonly, inject, provide } from 'vue'
import type { InjectionKey } from 'vue'

interface CounterContext {
  count: number  // readonly なので直接変更不可
  increment: () => void
  decrement: () => void
  reset: () => void
}

// Symbol キー — 型情報が付いている
const CounterKey: InjectionKey<CounterContext> = Symbol('CounterKey')

// 祖先コンポーネント用: provide をラップ
function provideCounter() {
  const state = reactive({ count: 0 })

  function increment() { state.count++ }
  function decrement() { state.count-- }
  function reset() { state.count = 0 }

  // readonly でラップして公開
  provide(CounterKey, {
    count: readonly(state).count,
    increment,
    decrement,
    reset,
  })

  return state // 祖先自身も使えるよう返す
}

// 子孫コンポーネント用: inject をラップ
function useCounter(): CounterContext {
  const ctx = inject(CounterKey)
  if (!ctx) {
    // provide 忘れを即座に検知
    throw new Error('useCounter() は provideCounter() の子孫で呼んでください')
  }
  return ctx
}

// ── このデモでは同一コンポーネントで両方呼ぶ ──────────────────
const state = provideCounter()       // 祖先側
const { increment, decrement, reset } = useCounter() // 子孫側（同コンポーネントでシミュレート）
</script>

<template>
  <div style="font-family: sans-serif; padding: 16px;">
    <p style="font-size: 24px; font-weight: bold; text-align: center; margin: 0 0 16px;">
      {{ state.count }}
    </p>
    <div style="display: flex; gap: 8px; justify-content: center;">
      <button @click="decrement" style="padding: 8px 16px; background: #e53e3e; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 18px;">−</button>
      <button @click="reset" style="padding: 8px 16px; background: #718096; color: white; border: none; border-radius: 4px; cursor: pointer;">リセット</button>
      <button @click="increment" style="padding: 8px 16px; background: #42b883; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 18px;">＋</button>
    </div>
    <p style="margin-top: 16px; font-size: 11px; color: #718096; text-align: center;">
      provideCounter() → readonly でラップして provide<br>
      useCounter() → inject + 未提供時にエラー
    </p>
  </div>
</template>`,
  },
]
