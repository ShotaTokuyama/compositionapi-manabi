import type { APIEntry } from './types'

export const composablesAPIs: APIEntry[] = [
  // ─── 基礎パターン ─────────────────────────────────────────────
  {
    id: 'composable-basics',
    name: 'useXxx() 基礎パターン',
    category: 'composables',
    summary: '状態とロジックを関数に抽出して再利用する。ref で返す・use プレフィックス・単一責務が3つの基本ルール。',
    signature: `// composables/useCounter.ts
export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  function increment() { count.value++ }
  function decrement() { count.value-- }
  function reset() { count.value = initialValue }
  return { count, increment, decrement, reset }
}`,
    description: `composable（コンポーザブル）は \`setup()\` の中で使われることを前提に、**状態とそれに関連するロジックをひとつの関数にまとめたもの**です。Vue の Composition API を最大限活かすための設計パターンです。

**3つの基本ルール：**

1. **\`use\` プレフィックスを付ける** — \`useCounter\`・\`useUserForm\` のように。Vue のオートインポートや lint ルールでも composable として認識されます。

2. **状態は \`ref\` で返す** — \`reactive\` オブジェクトとして返すと、分割代入したときにリアクティビティが失われます（\`toRefs\` を使えば回避できますが、\`ref\` で返す方がシンプル）。

3. **単一責務を意識する** — 1つの composable は1つの関心事を扱います。肥大化してきたら分割のサイン。

composable はコンポーネントを跨いで**ロジックを再利用**するだけでなく、コンポーネントの \`setup()\` を読みやすくするための**関心の分離**にも役立ちます。`,
    whenToUse: [
      '同じ状態＋ロジックのセットを複数コンポーネントで使いまわすとき',
      '`setup()` が長くなり、関心ごとに分割したいとき',
      'ユニットテストしやすい形でロジックを切り出したいとき',
    ],
    whenNotToUse: [
      '1箇所でしか使わない単純なロジック——setup() にそのまま書く',
      '純粋な計算関数（副作用なし・リアクティビティ不要）——通常の関数として定義する',
      'コンポーネントをまたがない単純なUIロジック——コンポーネント内で完結させる',
    ],
    pitfalls: [
      '`reactive` オブジェクトをそのまま返して分割代入すると、リアクティビティが失われます。`return { count: state.count }` ではなく `return { count }` のように ref をそのまま返してください。',
      'composable は `setup()` の同期フェーズか、`setup()` から呼ばれる関数内でのみ使えます。イベントハンドラや setTimeout の中から呼ぶとライフサイクルフックが正しく機能しません。',
      '`composables/` ディレクトリに置くと Nuxt がオートインポートします。ファイル名（`useCounter.ts`）と関数名（`useCounter`）を一致させておくと検索しやすくなります。',
    ],
    relatedAPIs: ['ref', 'reactive', 'toRefs', 'computed'],
    comparisons: [
      {
        targetAPI: 'reactive()',
        summary: '`reactive` はオブジェクトのリアクティビティ。composable はロジックの抽出と再利用のパターン。composable の中で `reactive` を使うことはあるが、返り値は ref で返すのが推奨。',
        useThisWhen: 'ロジックを再利用・テスト・分離したいとき',
        useOtherWhen: '単一コンポーネント内で複数プロパティをまとめてリアクティブにするとき',
      },
    ],
    codeExample: `<script setup lang="ts">
import { ref, computed } from 'vue'

// ── composables/useCounter.ts に相当 ──────────────────────────
function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const isZero = computed(() => count.value === 0)

  function increment() { count.value++ }
  function decrement() { count.value-- }
  function reset() { count.value = initialValue }

  // ✅ ref をそのまま返す（分割代入してもリアクティビティ保持）
  return { count, isZero, increment, decrement, reset }
}

// ── コンポーネントで使う ───────────────────────────────────────
// 分割代入してもリアクティビティが保たれる
const { count, isZero, increment, decrement, reset } = useCounter(10)

// 複数インスタンスも独立した状態を持つ
const counterA = useCounter(0)
const counterB = useCounter(100)
</script>

<template>
  <div style="font-family: sans-serif; padding: 16px;">
    <div style="margin-bottom: 16px; padding: 12px; background: #f7fafc; border-radius: 4px;">
      <p style="margin: 0 0 8px; font-weight: bold;">メインカウンター</p>
      <p style="font-size: 28px; text-align: center; margin: 0 0 8px;">{{ count }}</p>
      <p v-if="isZero" style="text-align: center; color: #718096; font-size: 12px; margin: 0 0 8px;">ゼロです</p>
      <div style="display: flex; gap: 8px; justify-content: center;">
        <button @click="decrement" style="padding: 6px 12px; background: #e53e3e; color: white; border: none; border-radius: 4px; cursor: pointer;">−</button>
        <button @click="reset" style="padding: 6px 12px; background: #718096; color: white; border: none; border-radius: 4px; cursor: pointer;">リセット</button>
        <button @click="increment" style="padding: 6px 12px; background: #42b883; color: white; border: none; border-radius: 4px; cursor: pointer;">＋</button>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
      <div style="padding: 10px; background: #ebf8ff; border-radius: 4px; text-align: center;">
        <p style="margin: 0 0 4px; font-size: 12px; color: #2b6cb0;">インスタンスA</p>
        <p style="font-size: 20px; margin: 0 0 6px;">{{ counterA.count }}</p>
        <div style="display: flex; gap: 4px; justify-content: center;">
          <button @click="counterA.decrement()" style="padding: 2px 8px; background: #e53e3e; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">−</button>
          <button @click="counterA.increment()" style="padding: 2px 8px; background: #42b883; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">＋</button>
        </div>
      </div>
      <div style="padding: 10px; background: #faf5ff; border-radius: 4px; text-align: center;">
        <p style="margin: 0 0 4px; font-size: 12px; color: #553c9a;">インスタンスB</p>
        <p style="font-size: 20px; margin: 0 0 6px;">{{ counterB.count }}</p>
        <div style="display: flex; gap: 4px; justify-content: center;">
          <button @click="counterB.decrement()" style="padding: 2px 8px; background: #e53e3e; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">−</button>
          <button @click="counterB.increment()" style="padding: 2px 8px; background: #42b883; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">＋</button>
        </div>
      </div>
    </div>
    <p style="margin-top: 8px; font-size: 11px; color: #718096; text-align: center;">
      各インスタンスは独立した状態を持つ
    </p>
  </div>
</template>`,
  },

  // ─── 応用パターン（イベントリスナー管理） ────────────────────
  {
    id: 'composable-event-listener',
    name: 'useXxx() — イベントリスナー管理パターン',
    category: 'composables',
    summary: 'onMounted での登録と onUnmounted でのクリーンアップをセットにして composable に閉じ込める。呼び出し側はリソース管理を意識しなくてよくなる。',
    signature: `// composables/useEventListener.ts
export function useEventListener<K extends keyof WindowEventMap>(
  target: EventTarget | Ref<EventTarget | null>,
  event: K,
  handler: (e: WindowEventMap[K]) => void
): void {
  onMounted(() => unref(target)?.addEventListener(event, handler as EventListener))
  onUnmounted(() => unref(target)?.removeEventListener(event, handler as EventListener))
}`,
    description: `composable でライフサイクルフックをカプセル化するパターンは、Vue Composition API の最も強力な特徴のひとつです。

**問題:** \`onMounted\` で登録したイベントリスナーは、\`onUnmounted\` で必ず解除しなければなりません。これをコンポーネントに都度書くのは冗長で、解除忘れによるメモリリークの原因になります。

**解決:** 登録と解除のロジックをまとめて composable に封じ込めます。コンポーネントは composable を呼ぶだけで、クリーンアップは自動化されます。

**ポイント:** composable 内で呼んだ \`onMounted\` / \`onUnmounted\` は、**その composable を呼び出したコンポーネントのライフサイクル**に紐付きます。コンポーネントがアンマウントされると、composable 内のクリーンアップも自動的に実行されます。

VueUse はこのパターンを徹底的に活用したライブラリです（\`useEventListener\`・\`useResizeObserver\`・\`useIntersectionObserver\` など）。`,
    whenToUse: [
      'イベントリスナー・Observer・タイマーなど「登録→解除」がペアになるリソースを扱うとき',
      '複数コンポーネントで同じリスナー登録が必要なとき',
      'VueUse を使わずに同等の機能を自作するとき',
    ],
    whenNotToUse: [
      '1コンポーネントでしか使わないシンプルなケース——onMounted/onUnmounted を直接書く方が明快',
      'Vue の watch / watchEffect で代替できる状態変化の監視',
    ],
    pitfalls: [
      'composable 内のライフサイクルフックは `setup()` の同期フェーズで呼ばれる必要があります。composable を `async` 関数にして `await` の後にライフサイクルフックを呼ぼうとすると動作しません。',
      'テンプレートrefを composable に渡す場合（`useEventListener(elRef, ...)`）、onMounted 時点で ref が解決されていることを確認してください。',
    ],
    relatedAPIs: ['onMounted', 'onUnmounted', 'ref', 'unref'],
    comparisons: [
      {
        targetAPI: 'onMounted() / onUnmounted()',
        summary: 'onMounted/onUnmounted をコンポーネントに直接書くのはシンプルだが再利用できない。composable に閉じ込めることで再利用可能になり、コンポーネントはリソース管理を意識しなくてよくなる。',
        useThisWhen: '登録・解除ロジックを複数箇所で再利用するとき、またはコンポーネントをシンプルに保ちたいとき',
        useOtherWhen: '1コンポーネント限定の単純なケース',
      },
    ],
    codeExample: `<script setup lang="ts">
import { ref, onMounted, onUnmounted, unref } from 'vue'
import type { Ref } from 'vue'

// ── composables/useEventListener.ts に相当 ────────────────────
function useEventListener(
  target: EventTarget | Ref<EventTarget | null> | null,
  event: string,
  handler: (e: Event) => void
) {
  onMounted(() => {
    const el = unref(target)
    el?.addEventListener(event, handler)
  })
  onUnmounted(() => {
    const el = unref(target)
    el?.removeEventListener(event, handler)
    // コンポーネントがアンマウントされると自動で解除される ✅
  })
}

// ── composables/useMousePosition.ts に相当 ────────────────────
function useMousePosition() {
  const x = ref(0)
  const y = ref(0)

  // ライフサイクル管理も composable の中に隠蔽
  useEventListener(window, 'mousemove', (e: Event) => {
    const me = e as MouseEvent
    x.value = me.clientX
    y.value = me.clientY
  })

  return { x, y }
}

// ── コンポーネントで使う ───────────────────────────────────────
// マウス座標の追跡 — クリーンアップは不要
const { x, y } = useMousePosition()

// ウィンドウ幅の追跡
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0)
useEventListener(window, 'resize', () => {
  windowWidth.value = window.innerWidth
})
</script>

<template>
  <div style="font-family: sans-serif; padding: 16px;">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
      <div style="padding: 12px; background: #f0fff4; border-radius: 4px;">
        <p style="margin: 0 0 4px; font-size: 12px; color: #276749;">useMousePosition()</p>
        <p style="font-family: monospace; margin: 0; font-size: 14px;">
          x: {{ x }}, y: {{ y }}
        </p>
      </div>
      <div style="padding: 12px; background: #ebf8ff; border-radius: 4px;">
        <p style="margin: 0 0 4px; font-size: 12px; color: #2b6cb0;">ウィンドウ幅</p>
        <p style="font-family: monospace; margin: 0; font-size: 14px;">
          {{ windowWidth }}px
        </p>
      </div>
    </div>
    <p style="font-size: 11px; color: #718096; margin: 0;">
      マウスを動かすと座標が更新されます。<br>
      このコンポーネントがアンマウントされると、すべてのリスナーが自動解除されます。
    </p>
  </div>
</template>`,
  },

  // ─── 応用パターン（非同期処理） ───────────────────────────────
  {
    id: 'composable-async',
    name: 'useXxx() — 非同期処理パターン',
    category: 'composables',
    summary: 'fetch の状態（data / isLoading / error）を composable にまとめる。コンポーネントは表示に専念できる。',
    signature: `// composables/useFetch.ts
interface UseFetchResult<T> {
  data: Ref<T | null>
  isLoading: Ref<boolean>
  error: Ref<Error | null>
  execute: () => Promise<void>
}

export function useFetch<T>(url: MaybeRef<string>): UseFetchResult<T>`,
    description: `非同期データ取得は多くのコンポーネントで繰り返されるパターンです。\`data\`・\`isLoading\`・\`error\` の3状態を毎回書くのではなく、composable に抽出します。

**設計のポイント：**

1. **3状態を必ず返す** — \`data\`・\`isLoading\`・\`error\` はセットで管理します。どれか欠けると表示の分岐が難しくなります。

2. **URL を \`MaybeRef\` にする** — URLが \`ref\` の場合（例: \`computed(() => \`/api/users/\${id.value}\`)\`）、\`watch\` で変化を検知して再フェッチできます。

3. **即時実行 vs 手動実行** — \`immediate: true\` でマウント時に自動実行するか、\`execute()\` を返して手動トリガーにするか、用途に合わせて選びます。

4. **クリーンアップ（キャンセル）** — コンポーネントがアンマウントされたり、URLが変わったりしたときに進行中のフェッチをキャンセルするには \`AbortController\` を使います。

Nuxt 環境では \`useFetch()\`・\`useAsyncData()\` が SSR 対応の同等機能を提供しているため、通常はこれらを使います。`,
    whenToUse: [
      '同じフェッチパターン（data/isLoading/error）を複数コンポーネントで使うとき',
      'フェッチロジックを分離してコンポーネントを表示専用にシンプルにしたいとき',
      'URL の変化に自動追従する再フェッチが必要なとき',
    ],
    whenNotToUse: [
      'Nuxt 環境——`useFetch()` や `useAsyncData()` がSSR対応でより機能が充実している',
      '1回限りのシンプルなフェッチ——`onMounted` 内に直接書く',
    ],
    pitfalls: [
      '`async setup()` の代わりに `onMounted` 内で非同期処理を行ってください。`await` を `setup()` トップレベルで使うと、Suspense 境界の設定が必要になります（意図的な場合を除く）。',
      'コンポーネントのアンマウント後にフェッチが完了して状態を更新しようとすると、Vue が警告を出します。`AbortController` でキャンセルするか、アンマウント済みフラグで更新をスキップしてください。',
    ],
    relatedAPIs: ['ref', 'watch', 'onMounted', 'onUnmounted'],
    comparisons: [
      {
        targetAPI: 'onMounted()',
        summary: 'onMounted に直接フェッチを書くのは1コンポーネント限定でよければ十分。composable に抽出すると再利用・テスト・関心の分離が容易になる。',
        useThisWhen: '複数コンポーネントで同じフェッチパターンを使うとき、またはコンポーネントをシンプルに保ちたいとき',
        useOtherWhen: '1コンポーネント限定の単純なフェッチ',
      },
    ],
    codeExample: `<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import type { Ref } from 'vue'

type MaybeRef<T> = T | Ref<T>

// ── composables/useJsonFetch.ts に相当 ────────────────────────
function useJsonFetch<T>(url: MaybeRef<string>) {
  const data = ref<T | null>(null)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  let controller: AbortController | null = null

  async function execute() {
    // 進行中のリクエストをキャンセル
    controller?.abort()
    controller = new AbortController()

    isLoading.value = true
    error.value = null

    try {
      const resolvedUrl = typeof url === 'string' ? url : url.value
      const res = await fetch(resolvedUrl, { signal: controller.signal })
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
      data.value = await res.json() as T
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        error.value = e instanceof Error ? e : new Error(String(e))
      }
    } finally {
      isLoading.value = false
    }
  }

  // URL が ref の場合は変化を監視して再フェッチ
  watch(() => (typeof url === 'string' ? url : url.value), execute, { immediate: true })

  onUnmounted(() => controller?.abort())

  return { data, isLoading, error, execute }
}

// ── コンポーネントで使う ───────────────────────────────────────
interface Post {
  id: number
  title: string
  body: string
}

const postId = ref(1)
const { data: post, isLoading, error, execute } = useJsonFetch<Post>(
  // computed ref を渡すと postId の変化で自動再フェッチ
  { value: \`https://jsonplaceholder.typicode.com/posts/\${postId.value}\` } as Ref<string>
)

function nextPost() {
  if (postId.value < 10) {
    postId.value++
    execute()
  }
}
function prevPost() {
  if (postId.value > 1) {
    postId.value--
    execute()
  }
}
</script>

<template>
  <div style="font-family: sans-serif; padding: 16px;">
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
      <button @click="prevPost" :disabled="postId <= 1 || isLoading" style="padding: 4px 10px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;">◀</button>
      <span style="font-size: 13px;">Post #{{ postId }}</span>
      <button @click="nextPost" :disabled="postId >= 10 || isLoading" style="padding: 4px 10px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;">▶</button>
      <button @click="execute" :disabled="isLoading" style="padding: 4px 10px; background: #42b883; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 4px;">再取得</button>
    </div>

    <div v-if="isLoading" style="color: #718096; font-size: 13px;">読み込み中...</div>
    <div v-else-if="error" style="color: #e53e3e; font-size: 13px;">エラー: {{ error.message }}</div>
    <div v-else-if="post" style="background: #f7fafc; padding: 12px; border-radius: 4px; font-size: 13px;">
      <p style="font-weight: bold; margin: 0 0 6px;">{{ post.title }}</p>
      <p style="color: #718096; margin: 0; line-height: 1.5;">{{ post.body }}</p>
    </div>
  </div>
</template>`,
  },
]
