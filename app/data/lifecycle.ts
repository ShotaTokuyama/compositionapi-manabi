import type { APIEntry } from './types'

export const lifecycleAPIs: APIEntry[] = [
  // ─── onMounted() ──────────────────────────────────────────────
  {
    id: 'onMounted',
    name: 'onMounted()',
    category: 'lifecycle',
    summary: 'コンポーネントがDOMにマウントされた直後に実行される。DOMアクセスや非同期初期化の起点。',
    signature: `function onMounted(callback: () => void): void`,
    description: `\`onMounted()\` はコンポーネントのDOMが生成され、ページに挿入された直後に呼ばれます。

このタイミングでは \`el\`（テンプレートの参照）やDOM要素に安全にアクセスできます。\`setup()\` の実行中（同期フェーズ）はまだDOMが存在しないため、DOM操作は必ず \`onMounted\` 以降で行います。

**非同期処理の起点**としても使われます。APIフェッチ・ライブラリの初期化・サードパーティSDKのセットアップなど、DOMや外部リソースへの依存がある処理に適しています。

サーバーサイドレンダリング（SSR/Nuxt）環境では、\`onMounted\` はクライアントサイドでのみ実行されます。\`window\` や \`document\` へのアクセスは必ず \`onMounted\` 内で行うことでSSRエラーを防げます。`,
    whenToUse: [
      'テンプレートrefでDOM要素にアクセスするとき（`el.value` がnullでなくなるのはここから）',
      'コンポーネント初期化時にAPIデータをフェッチするとき',
      'Chart.js・Swiper などのサードパーティDOMライブラリを初期化するとき',
      'イベントリスナーやResizeObserverを登録するとき（`onUnmounted` でクリーンアップとセットで）',
      'SSR環境でブラウザ専用API（window / document / localStorage）を使うとき',
    ],
    whenNotToUse: [
      'DOMに依存しない純粋な初期値の設定——`setup()` 内で直接行う',
      '子コンポーネントのDOMにアクセスしたいとき——子の `onMounted` が先に実行されるが、孫まで含めると `nextTick` が必要な場合がある',
    ],
    pitfalls: [
      '`onMounted` 内で `async/await` を使う場合、関数全体を async にするとエラーハンドリングが省略されがちです。try/catch を忘れずに実装してください。',
      'テンプレートref（`const el = ref<HTMLElement | null>(null)`）は `onMounted` 実行前は `null` です。型定義に `| null` を含め、アクセス前にnullチェックをしてください。',
      'SSR環境（Nuxt等）でサーバー側で実行されないことを前提にしたコードは `onMounted` に限定してください。`setup()` のトップレベルに書くとSSRでエラーになります。',
    ],
    relatedAPIs: ['onBeforeMount', 'onUnmounted', 'onUpdated'],
    comparisons: [
      {
        targetAPI: 'onBeforeMount()',
        summary: 'onBeforeMount はDOMが生成される直前。テンプレートrefはまだnull。DOMへのアクセスは onMounted まで待つ必要がある。',
        useThisWhen: 'DOMアクセス・ライブラリ初期化・APIフェッチなど、ほぼすべての初期化処理',
        useOtherWhen: 'DOMが存在する前に何か特別な処理が必要な稀なケース（ほぼ使わない）',
      },
    ],
    codeExample: `<script setup lang="ts">
import { ref, onMounted } from 'vue'

// テンプレートref — マウント前は null
const canvasEl = ref<HTMLCanvasElement | null>(null)
const message = ref('マウント待ち...')
const apiData = ref<string | null>(null)

onMounted(() => {
  // ✅ DOM要素に安全にアクセスできる
  if (canvasEl.value) {
    const ctx = canvasEl.value.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#42b883'
      ctx.fillRect(10, 10, 80, 80)
      ctx.fillStyle = 'white'
      ctx.font = '14px sans-serif'
      ctx.fillText('Vue!', 32, 55)
    }
  }
  message.value = 'マウント完了 ✅'
})

// 非同期処理も onMounted の起点から
onMounted(async () => {
  await new Promise(resolve => setTimeout(resolve, 800))
  apiData.value = 'データ取得完了（模擬）'
})
</script>

<template>
  <div style="font-family: sans-serif; padding: 16px;">
    <p>状態: {{ message }}</p>
    <canvas
      ref="canvasEl"
      width="100"
      height="100"
      style="border: 1px solid #e2e8f0; border-radius: 4px; margin: 8px 0;"
    />
    <p style="font-size: 13px; color: #718096;">
      API: {{ apiData ?? '取得中...' }}
    </p>
  </div>
</template>`,
  },

  // ─── onUnmounted() ────────────────────────────────────────────
  {
    id: 'onUnmounted',
    name: 'onUnmounted()',
    category: 'lifecycle',
    summary: 'コンポーネントがDOMから取り除かれた後に実行される。イベントリスナーやタイマーのクリーンアップに必須。',
    signature: `function onUnmounted(callback: () => void): void`,
    description: `\`onUnmounted()\` はコンポーネントのDOMが削除され、リアクティブな監視もすべて停止した後に呼ばれます。

主な用途は**リソースのクリーンアップ**です。\`onMounted\` で登録したものは \`onUnmounted\` で必ず解除することがメモリリーク防止の基本パターンです。

クリーンアップが必要なものの代表例：
- \`addEventListener\` → \`removeEventListener\`
- \`setInterval\` / \`setTimeout\` → \`clearInterval\` / \`clearTimeout\`
- \`ResizeObserver\` / \`IntersectionObserver\` → \`.disconnect()\`
- WebSocketやEventSource → \`.close()\`
- サードパーティライブラリのインスタンス → \`.destroy()\`

Vue の \`watch\` や \`watchEffect\` はコンポーネントのアンマウント時に自動停止するため、手動クリーンアップは不要です。`,
    whenToUse: [
      '`addEventListener` で登録したイベントリスナーを解除するとき',
      '`setInterval` などのタイマーをクリアするとき',
      'ResizeObserver / IntersectionObserver などのObserverを切断するとき',
      'WebSocket / EventSource などの持続的接続を閉じるとき',
      'Chart.js など外部ライブラリのインスタンスを破棄するとき',
    ],
    whenNotToUse: [
      'Vue の `watch` / `watchEffect` の停止——コンポーネントのアンマウント時に自動で停止する',
      'computed の破棄——こちらも自動',
    ],
    pitfalls: [
      'クリーンアップ関数に渡す参照が onMounted 時と同じインスタンスであることを確認してください。毎回新しい関数を `addEventListener` に渡していると、`removeEventListener` が一致せず解除できません。関数は変数に保持してから登録・解除するか、`watchEffect` の `onCleanup` を使ってください。',
      'コンポーネントが一度もマウントされずに破棄される場合（SSRや条件付きレンダリング）は onMounted が呼ばれないため、onUnmounted も呼ばれません。クリーンアップが確実に実行されるかを設計段階で確認してください。',
    ],
    relatedAPIs: ['onMounted', 'onBeforeUnmount', 'watchEffect'],
    comparisons: [
      {
        targetAPI: 'onBeforeUnmount()',
        summary: 'onBeforeUnmount はDOMがまだ存在している「アンマウント直前」。onUnmounted はDOMが取り除かれた「後」。DOMにアクセスしながらクリーンアップしたい場合は onBeforeUnmount を使う。',
        useThisWhen: 'DOMが存在しなくてよいクリーンアップ（タイマー・接続など）の大部分',
        useOtherWhen: 'まだDOMが存在する間に最終処理が必要な稀なケース',
      },
    ],
    codeExample: `<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const windowWidth = ref(window.innerWidth)
const seconds = ref(0)
let timerId: ReturnType<typeof setInterval> | null = null

// ✅ イベントリスナー: 同じ関数参照を保持する
function onResize() {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  // 登録
  window.addEventListener('resize', onResize)
  timerId = setInterval(() => { seconds.value++ }, 1000)
})

onUnmounted(() => {
  // 必ず解除・クリア
  window.removeEventListener('resize', onResize)
  if (timerId !== null) clearInterval(timerId)
})
</script>

<template>
  <div style="font-family: sans-serif; padding: 16px;">
    <p>ウィンドウ幅: <strong>{{ windowWidth }}px</strong></p>
    <p>経過秒数: <strong>{{ seconds }}秒</strong></p>
    <p style="font-size: 12px; color: #718096; margin-top: 8px;">
      このコンポーネントがアンマウントされると<br>
      リスナーとタイマーは自動的に解除されます
    </p>
  </div>
</template>`,
  },

  // ─── onBeforeMount() / onBeforeUnmount() ─────────────────────
  {
    id: 'onBeforeMount',
    name: 'onBeforeMount() / onBeforeUnmount()',
    category: 'lifecycle',
    summary: 'DOMの生成前・削除前に実行される。実際に使う機会は少なく、大抵は onMounted / onUnmounted で足りる。',
    signature: `function onBeforeMount(callback: () => void): void
function onBeforeUnmount(callback: () => void): void`,
    description: `**\`onBeforeMount()\`** はコンポーネントのDOMが生成される直前に呼ばれます。この時点ではテンプレートrefはまだ \`null\` であり、DOM要素にはアクセスできません。リアクティブな状態と算出プロパティは利用可能です。

**\`onBeforeUnmount()\`** はアンマウント処理が始まる直前に呼ばれ、コンポーネントの全機能（DOM・リアクティビティ）がまだ動作している状態です。「DOMが存在する最後のタイミング」でのクリーンアップに使えます。

**実際の使用頻度は低いです。** ほとんどのユースケースは \`onMounted\` と \`onUnmounted\` でカバーできます。これらが必要になるのは非常に特殊なケースに限られます。`,
    whenToUse: [
      '`onBeforeMount`: DOMが存在する前に必要な準備処理（グローバル状態の同期など）——ほぼ使わない',
      '`onBeforeUnmount`: DOMにアクセスしながら行う最終クリーンアップ（Canvasの状態保存など）——稀なケース',
    ],
    whenNotToUse: [
      'DOMアクセスが必要な初期化——`onMounted` を使う',
      'イベントリスナーやタイマーのクリーンアップ——DOMアクセス不要なら `onUnmounted` を使う',
      '通常のAPIフェッチや状態初期化——`setup()` または `onMounted` で行う',
    ],
    pitfalls: [
      '`onBeforeMount` 内でテンプレートrefにアクセスしようとしても `null` です。DOMが存在するのは `onMounted` 以降です。',
    ],
    relatedAPIs: ['onMounted', 'onUnmounted'],
    comparisons: [
      {
        targetAPI: 'onMounted()',
        summary: 'onMounted は DOM生成「後」なのでDOM要素にアクセスできる。onBeforeMount は DOM生成「前」なのでアクセス不可。初期化処理は原則 onMounted を使う。',
        useThisWhen: 'DOM存在前に必要な非常に特殊な処理（ほぼ不要）',
        useOtherWhen: 'DOMアクセス・ライブラリ初期化・APIフェッチなど一般的な初期化処理すべて',
      },
    ],
    codeExample: `<script setup lang="ts">
import { ref, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from 'vue'

const el = ref<HTMLDivElement | null>(null)
const log = ref<string[]>([])

function addLog(msg: string) {
  log.value.push(\`[\${new Date().toLocaleTimeString()}] \${msg}\`)
}

onBeforeMount(() => {
  addLog('onBeforeMount: DOMはまだ存在しない')
  addLog(\`  → el.value = \${el.value}\`) // null
})

onMounted(() => {
  addLog('onMounted: DOMが存在する')
  addLog(\`  → el.value = \${el.value ? '<div>' : 'null'}\`)
})

onBeforeUnmount(() => {
  addLog('onBeforeUnmount: DOMがまだ存在する')
})

onUnmounted(() => {
  addLog('onUnmounted: DOMが取り除かれた')
})
</script>

<template>
  <div style="font-family: sans-serif; padding: 16px;">
    <div ref="el" style="display: inline-block; padding: 4px 8px; background: #ebf8ff; border-radius: 4px; margin-bottom: 12px; font-size: 13px;">
      テンプレートref対象のdiv
    </div>
    <ul style="list-style: none; padding: 0; font-size: 12px; font-family: monospace; background: #f7fafc; border-radius: 4px; padding: 12px;">
      <li v-for="(entry, i) in log" :key="i" style="margin-bottom: 4px;">{{ entry }}</li>
    </ul>
  </div>
</template>`,
  },

  // ─── onUpdated() / onBeforeUpdate() ───────────────────────────
  {
    id: 'onUpdated',
    name: 'onUpdated() / onBeforeUpdate()',
    category: 'lifecycle',
    summary: 'リアクティブな状態変化によりDOMが再レンダリングされたとき（前後）に実行される。無限ループに注意。',
    signature: `function onUpdated(callback: () => void): void
function onBeforeUpdate(callback: () => void): void`,
    description: `**\`onUpdated()\`** はコンポーネントのリアクティブな状態が変化し、DOMが更新された直後に呼ばれます。更新後のDOMの状態にアクセスしたいときに使います。

**\`onBeforeUpdate()\`** はDOMが更新される直前に呼ばれます。更新前のDOMの状態を記録したいときに使います。

**最大の落とし穴：無限ループ。** \`onUpdated\` 内でリアクティブな状態を更新すると、再レンダリングが発生し、また \`onUpdated\` が呼ばれる……という無限ループになります。

多くの場合、\`watch\` や \`computed\` でより宣言的に同じことが実現できます。\`onUpdated\` が必要になるのは、VirtualDOM では追跡できない低レベルなDOM操作が必要なときに限られます。`,
    whenToUse: [
      '更新後のDOM要素のサイズ・位置を計算したいとき（`getBoundingClientRect()` など）',
      '外部ライブラリ（Chart.jsなど）のインスタンスをVueの状態に合わせて手動更新するとき',
      '`onBeforeUpdate`: 更新前のDOMの値（スクロール位置など）を保存するとき',
    ],
    whenNotToUse: [
      '状態変化に応じて別の状態を更新したいとき——`watch` や `computed` を使う（onUpdatedで状態更新すると無限ループ）',
      'データ取得のトリガーにしたいとき——`watch` を使う',
    ],
    pitfalls: [
      '`onUpdated` 内でリアクティブな状態（ref・reactive）を更新すると無限ループになります。状態の連動には `watch` または `computed` を使ってください。',
      '`onUpdated` は**親・子の両方**でリアクティブな変化があれば呼ばれます。特定の状態変化だけに反応したい場合は `watch` の方が適切です。',
    ],
    relatedAPIs: ['onMounted', 'watch', 'nextTick'],
    comparisons: [
      {
        targetAPI: 'watch()',
        summary: '`watch` は特定のリアクティブな値の変化に反応する宣言的な方法。`onUpdated` はDOMの更新後に何らかの副作用が必要な命令的な方法。状態の連動には watch を優先する。',
        useThisWhen: '更新後のDOM要素に直接アクセスする必要があるとき',
        useOtherWhen: 'リアクティブな状態の変化に応じて別の処理をするとき（watch が適切）',
      },
    ],
    codeExample: `<script setup lang="ts">
import { ref, onBeforeUpdate, onUpdated } from 'vue'

const items = ref(['りんご', 'バナナ', 'さくらんぼ'])
const newItem = ref('')
const listEl = ref<HTMLUListElement | null>(null)
const heightLog = ref<{ before: number; after: number } | null>(null)

let beforeHeight = 0

onBeforeUpdate(() => {
  // 更新前の高さを記録
  if (listEl.value) {
    beforeHeight = listEl.value.offsetHeight
  }
})

onUpdated(() => {
  // 更新後の高さを取得してdiffを表示
  if (listEl.value) {
    heightLog.value = {
      before: beforeHeight,
      after: listEl.value.offsetHeight,
    }
  }
})

function addItem() {
  if (newItem.value.trim()) {
    items.value.push(newItem.value.trim())
    newItem.value = ''
  }
}
</script>

<template>
  <div style="font-family: sans-serif; padding: 16px;">
    <ul ref="listEl" style="padding: 0 0 0 20px; margin: 0 0 12px;">
      <li v-for="(item, i) in items" :key="i">{{ item }}</li>
    </ul>
    <div style="display: flex; gap: 8px; margin-bottom: 12px;">
      <input
        v-model="newItem"
        placeholder="アイテムを追加"
        @keydown.enter="addItem"
        style="border: 1px solid #ccc; padding: 4px 8px; border-radius: 4px; flex: 1;"
      />
      <button @click="addItem" style="padding: 4px 12px; background: #42b883; color: white; border: none; border-radius: 4px; cursor: pointer;">
        追加
      </button>
    </div>
    <div v-if="heightLog" style="font-size: 12px; background: #f7fafc; padding: 8px; border-radius: 4px; font-family: monospace;">
      更新前: {{ heightLog.before }}px → 更新後: {{ heightLog.after }}px
      （差分: +{{ heightLog.after - heightLog.before }}px）
    </div>
  </div>
</template>`,
  },

  // ─── onErrorCaptured() ────────────────────────────────────────
  {
    id: 'onErrorCaptured',
    name: 'onErrorCaptured()',
    category: 'lifecycle',
    summary: '子孫コンポーネントから発生したエラーをキャプチャする。Reactのエラーバウンダリに相当するパターン。',
    signature: `function onErrorCaptured(
  handler: (
    err: unknown,
    instance: ComponentPublicInstance | null,
    info: string
  ) => boolean | void
): void`,
    description: `\`onErrorCaptured()\` は子孫コンポーネントで発生したエラーを上位コンポーネントでキャッチするための仕組みです。React の ErrorBoundary と同じ考え方です。

キャプチャできるエラーの発生源：
- コンポーネントのレンダリング（テンプレート評価）
- イベントハンドラー
- ライフサイクルフック
- \`setup()\` 関数
- 子コンポーネントの \`watchEffect\`・\`watch\`

ハンドラーが \`false\` を返すと**エラーの伝播を停止**できます。返さない（\`void\`）か \`true\` を返すとエラーは上位コンポーネントや \`app.config.errorHandler\` に伝播します。

エラーが発生したコンポーネント自身のエラーはキャプチャできません。必ず「親以上」のコンポーネントに実装します。`,
    whenToUse: [
      'エラーが発生した子孫のみフォールバックUIに置き換え、残りのUIは維持したいとき',
      'エラーログをサーバーに送信するとき（Sentry など）',
      '「エラーバウンダリ」パターンを実装するとき',
    ],
    whenNotToUse: [
      '同じコンポーネント内のエラー処理——try/catch を使う',
      'グローバルなエラーハンドリング——`app.config.errorHandler` を使う',
    ],
    pitfalls: [
      'ハンドラー内でエラーが発生すると、そのエラーも親に伝播します。ハンドラー自体のコードはシンプルに保ってください。',
      '非同期処理（`async/await` で発生したエラー）は `onErrorCaptured` でキャプチャできます。ただし `setTimeout` コールバック内のエラーはキャプチャできません。',
    ],
    relatedAPIs: ['onMounted', 'onUnmounted'],
    comparisons: [
      {
        targetAPI: 'app.config.errorHandler',
        summary: 'onErrorCaptured はコンポーネントツリーの特定の境界でエラーを局所的にキャッチする。app.config.errorHandler はアプリ全体で捕捉されなかったエラーのグローバルなフォールバック。',
        useThisWhen: '部分的なエラーバウンダリ（コンポーネント単位でフォールバックUIを出したいとき）',
        useOtherWhen: 'エラーログ送信などアプリ全体で一括処理したいとき',
      },
    ],
    codeExample: `<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const errorMessage = ref('')

onErrorCaptured((err, instance, info) => {
  hasError.value = true
  errorMessage.value = err instanceof Error ? err.message : String(err)
  console.error('キャプチャしたエラー:', err, '発生箇所:', info)
  return false // エラーの伝播を停止
})

// エラーを発生させる子コンポーネントをシミュレート
const BrokenChild = {
  setup() {
    throw new Error('子コンポーネントでエラーが発生しました！')
  },
  template: '<div>表示されません</div>',
}

const showChild = ref(true)

function retry() {
  hasError.value = false
  errorMessage.value = ''
  showChild.value = false
  setTimeout(() => { showChild.value = true }, 100)
}
</script>

<template>
  <div style="font-family: sans-serif; padding: 16px;">
    <div v-if="hasError" style="background: #fff5f5; border: 1px solid #fed7d7; border-radius: 4px; padding: 16px;">
      <p style="color: #e53e3e; font-weight: bold; margin: 0 0 8px;">
        ⚠️ エラーが発生しました
      </p>
      <p style="font-size: 13px; font-family: monospace; margin: 0 0 12px;">
        {{ errorMessage }}
      </p>
      <button @click="retry" style="padding: 6px 12px; background: #42b883; color: white; border: none; border-radius: 4px; cursor: pointer;">
        再試行
      </button>
    </div>
    <component v-else-if="showChild" :is="BrokenChild" />
    <p v-else style="color: #718096; font-size: 13px;">読み込み中...</p>
  </div>
</template>`,
  },
]
