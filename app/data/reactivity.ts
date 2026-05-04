import type { APIEntry } from './types'

export const reactivityAPIs: APIEntry[] = [
  {
    id: 'ref',
    name: 'ref()',
    category: 'reactivity',
    summary: '任意の値をリアクティブな参照にする。スクリプト内では `.value` でアクセスする。',
    signature: `function ref<T>(value: T): Ref<T>

interface Ref<T> {
  value: T
}`,
    description: `\`ref()\` はプリミティブ値・オブジェクト問わず、あらゆる値をリアクティブな参照（Ref）にラップします。

スクリプト内では必ず \`.value\` を通じてアクセス・更新します。テンプレート内では自動アンラップが働くため \`.value\` は不要です。

オブジェクトを渡した場合、内部では \`reactive()\` と同様の深いリアクティビティが適用されます。つまり \`ref({ count: 0 }).value.count\` の変更も追跡されます。

composable から状態を返す場合、\`ref\` は分割代入してもリアクティビティを保持できるため、\`reactive\` より安全です。`,
    whenToUse: [
      'string / number / boolean などプリミティブ値をリアクティブにするとき',
      'composable の戻り値として単一の値を返すとき（分割代入に強い）',
      'watch() の引数にそのまま渡したいとき',
      '値の置き換え（再代入）が発生するとき（配列全体の入れ替えなど）'
    ],
    whenNotToUse: [
      '複数の関連プロパティをひとまとめにしたいだけのとき（reactive の方がコードが短い）',
      '.value を書く手間が許容できないほど参照箇所が多いとき'
    ],
    pitfalls: [
      'テンプレートでは自動アンラップされるが、スクリプト内では .value を忘れやすい。count++ と書いても反応しない（count.value++ が正しい）。',
      'ref をオブジェクトから分割代入してもリアクティビティは保持されるが、reactive を分割代入すると失われる。この非対称性に注意。',
      'reactive オブジェクトの中に ref を入れると自動アンラップされ、.value が不要になる。意図しない挙動になりやすいので混在は避ける。'
    ],
    relatedAPIs: ['reactive', 'computed', 'unref', 'isRef', 'toRef', 'toRefs', 'shallowRef'],
    comparisons: [
      {
        targetAPI: 'reactive',
        summary: 'ref は .value 経由でアクセスする単一値のラッパー。reactive は .value なしで直接プロパティにアクセスできるオブジェクト専用のラッパー。',
        useThisWhen: 'プリミティブ値を扱うとき、または composable から値を返すとき（分割代入してもリアクティビティが失われない）',
        useOtherWhen: 'フォームの状態など、複数の関連プロパティをひとまとめにしたいとき。.value を書かずに直接 form.name のようにアクセスしたいとき'
      }
    ],
    codeExample: `<script setup lang="ts">
import { ref } from 'vue'

// プリミティブ値
const count = ref(0)
const message = ref('こんにちは')
const isVisible = ref(true)

// オブジェクトも扱える（内部で reactive と同等の深いリアクティビティ）
const user = ref({ name: 'Alice', age: 25 })

function increment() {
  count.value++ // スクリプト内では .value が必要
}

function toggleVisibility() {
  isVisible.value = !isVisible.value
}

function updateUser() {
  // オブジェクトごと置き換えも可能
  user.value = { name: 'Bob', age: 30 }
}
</script>

<template>
  <div style="padding: 16px; font-family: sans-serif;">
    <!-- テンプレートでは .value 不要（自動アンラップ） -->
    <p>カウント: {{ count }}</p>
    <button @click="increment">+1</button>

    <hr style="margin: 12px 0;" />

    <p>メッセージ: {{ message }}</p>
    <input v-model="message" style="border: 1px solid #ccc; padding: 4px;" />

    <hr style="margin: 12px 0;" />

    <button @click="toggleVisibility">
      {{ isVisible ? '隠す' : '表示する' }}
    </button>
    <p v-if="isVisible" style="color: green;">表示されています</p>

    <hr style="margin: 12px 0;" />

    <p>ユーザー: {{ user.name }}（{{ user.age }}歳）</p>
    <button @click="updateUser">ユーザーを変更</button>
  </div>
</template>`
  },

  {
    id: 'reactive',
    name: 'reactive()',
    category: 'reactivity',
    summary: 'オブジェクトを深くリアクティブにする。プロパティに直接アクセスでき、.value が不要。',
    signature: `function reactive<T extends object>(target: T): UnwrapNestedRefs<T>`,
    description: `\`reactive()\` はオブジェクト・配列・Map・Set などを Proxy でラップし、すべてのプロパティを深くリアクティブにします。

\`ref\` と異なり \`.value\` は不要で、\`state.count\` のように直接プロパティへアクセスできます。内部で Proxy を使うため、プロパティの追加・削除も追跡されます。

ネストしたオブジェクトも自動的にリアクティブになります（深いリアクティビティ）。

**重要な制約**: \`reactive\` はオブジェクト型専用です。\`reactive(0)\` のようにプリミティブ値を渡すとエラーになります。また、分割代入するとリアクティビティが失われます。`,
    whenToUse: [
      'フォームの状態など、複数の関連プロパティをひとまとめに管理するとき',
      'オブジェクトのプロパティに頻繁にアクセスし、.value を毎回書きたくないとき',
      'Map / Set をリアクティブにするとき'
    ],
    whenNotToUse: [
      'string / number / boolean などプリミティブ値を直接リアクティブにしたいとき（ref を使う）',
      'composable から状態を返すとき（分割代入でリアクティビティが失われるため ref が安全）',
      '値全体を別のオブジェクトで置き換える操作が必要なとき（再代入できない）'
    ],
    pitfalls: [
      '分割代入でリアクティビティが失われる: const { count } = reactive({ count: 0 }) の count はただの number になる。toRefs() を使って ref に変換すること。',
      'reactive オブジェクト自体を別の変数に再代入してもリアクティビティは切れる: let state = reactive({...}); state = reactive({...}) のような置き換えは追跡されない。',
      'プリミティブ値（number, string, boolean）を渡すと実行時エラーになる。'
    ],
    relatedAPIs: ['ref', 'toRef', 'toRefs', 'shallowReactive', 'readonly', 'isReactive'],
    comparisons: [
      {
        targetAPI: 'ref',
        summary: 'reactive は .value なしでオブジェクトプロパティに直接アクセスできる。ref はプリミティブ含む全ての値を扱え、composable からの返却に向いている。',
        useThisWhen: '複数の関連プロパティをひとつのオブジェクトとして管理し、.value を書きたくないとき。フォーム状態の管理が典型例。',
        useOtherWhen: 'プリミティブ値を扱うとき、または composable から状態を返すとき（分割代入してもリアクティビティが保持される）'
      }
    ],
    codeExample: `<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  agreed: false
})

const state = reactive({
  loading: false,
  submitted: false,
  error: null as string | null
})

async function submit() {
  if (!form.name || !form.email) {
    state.error = '名前とメールアドレスを入力してください'
    return
  }
  state.loading = true
  state.error = null
  await new Promise(resolve => setTimeout(resolve, 800))
  state.loading = false
  state.submitted = true
}

function reset() {
  form.name = ''
  form.email = ''
  form.agreed = false
  state.submitted = false
  state.error = null
}
</script>

<template>
  <div style="padding: 16px; font-family: sans-serif; max-width: 320px;">
    <div v-if="state.submitted">
      <p style="color: green;">✅ 登録完了！</p>
      <button @click="reset">戻る</button>
    </div>

    <form v-else @submit.prevent="submit">
      <div style="margin-bottom: 8px;">
        <input v-model="form.name" placeholder="名前" style="border: 1px solid #ccc; padding: 4px; width: 100%;" />
      </div>
      <div style="margin-bottom: 8px;">
        <input v-model="form.email" placeholder="メールアドレス" style="border: 1px solid #ccc; padding: 4px; width: 100%;" />
      </div>
      <div style="margin-bottom: 12px;">
        <label>
          <input v-model="form.agreed" type="checkbox" />
          利用規約に同意する
        </label>
      </div>
      <button type="submit" :disabled="state.loading || !form.agreed">
        {{ state.loading ? '送信中...' : '登録する' }}
      </button>
      <p v-if="state.error" style="color: red; margin-top: 8px;">{{ state.error }}</p>
    </form>
  </div>
</template>`
  },

  {
    id: 'computed',
    name: 'computed()',
    category: 'reactivity',
    summary: 'リアクティブな依存関係からキャッシュ付きで値を導出する。依存が変わるまで再計算しない。',
    signature: `// 読み取り専用
function computed<T>(getter: () => T): ComputedRef<T>

// 読み書き可能（getter + setter）
function computed<T>(options: {
  get: () => T
  set: (value: T) => void
}): WritableComputedRef<T>`,
    description: `\`computed()\` は他のリアクティブな値から派生した値を定義します。メモ化（キャッシュ）が自動で行われ、依存する値が変化したときだけ再計算されます。

依存が変わらない限り、何度アクセスしても getter は再実行されません。これはメソッドとの大きな違いです。

**setter の使い所**: \`v-model\` で使いたいが、元データを直接変更せずに変換ロジックを挟みたいケースに有効です。ただし setter は副作用を含まないようにする必要があります（計算の「逆変換」のみ行う）。

**副作用は禁止**: computed の getter で \`fetch()\` などの非同期処理や DOM操作を行ってはいけません。それらは \`watch()\` または \`watchEffect()\` を使います。`,
    whenToUse: [
      '他のリアクティブな値から派生した値を使いたいとき（フィルタ済みリスト、合計金額など）',
      '同じ計算結果をテンプレートや複数箇所で参照するとき（メモ化によるパフォーマンス改善）',
      'v-model でデータを変換しながらバインドしたいとき（setter を使う）'
    ],
    whenNotToUse: [
      '非同期処理（API呼び出しなど）の結果を扱いたいとき（watch + ref を使う）',
      '副作用（ログ・DOM操作・外部更新）が必要なとき（watchEffect を使う）',
      '単純に一度だけ計算する値（メソッドや通常の変数で十分）'
    ],
    pitfalls: [
      'getter の中で副作用を実行しないこと。computed は純粋関数として扱う。DOM操作や非同期処理はwatchを使う。',
      'setter で「逆計算」以外の処理を書かない。setter は "get の逆" のみを担当するべきで、別の状態を更新する副作用に使うと追跡が困難になる。',
      'ComputedRef は .value でアクセスする（ref と同じ）。テンプレートでは自動アンラップされる。'
    ],
    relatedAPIs: ['ref', 'watch', 'watchEffect'],
    comparisons: [
      {
        targetAPI: 'watch',
        summary: 'computed は値を「返す」ために使い、watch は変化に「反応して処理する」ために使う。computed にキャッシュがあり watch にはない。',
        useThisWhen: '他の値から派生した値が欲しいとき。テンプレートに表示したい計算結果が典型例。',
        useOtherWhen: 'リアクティブな値の変化を検知して、非同期処理・ログ・DOM操作などの副作用を実行したいとき。'
      }
    ],
    codeExample: `<script setup lang="ts">
import { ref, computed } from 'vue'

const items = ref([
  { name: 'りんご', price: 120, inStock: true },
  { name: 'バナナ', price: 80, inStock: false },
  { name: 'みかん', price: 100, inStock: true },
  { name: 'ぶどう', price: 300, inStock: true },
])

const filterInStock = ref(false)

// 派生した値：依存（items, filterInStock）が変わるまでキャッシュされる
const filteredItems = computed(() => {
  return filterInStock.value
    ? items.value.filter(item => item.inStock)
    : items.value
})

const totalPrice = computed(() =>
  filteredItems.value
    .filter(item => item.inStock)
    .reduce((sum, item) => sum + item.price, 0)
)

// setter 付き computed：税込み価格で入力 → 税抜きに変換して保存
const taxRate = ref(0.1)
const basePrice = ref(1000)
const priceWithTax = computed({
  get: () => Math.round(basePrice.value * (1 + taxRate.value)),
  set: (v: number) => {
    basePrice.value = Math.round(v / (1 + taxRate.value))
  }
})
</script>

<template>
  <div style="padding: 16px; font-family: sans-serif;">
    <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
      <input v-model="filterInStock" type="checkbox" />
      在庫あり のみ表示
    </label>

    <ul style="list-style: none; padding: 0; margin-bottom: 12px;">
      <li v-for="item in filteredItems" :key="item.name"
          style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #eee;">
        <span :style="{ color: item.inStock ? 'inherit' : '#999' }">
          {{ item.name }} {{ item.inStock ? '' : '（在庫切れ）' }}
        </span>
        <span>¥{{ item.price }}</span>
      </li>
    </ul>

    <p>在庫あり商品の合計: <strong>¥{{ totalPrice }}</strong></p>

    <hr style="margin: 16px 0;" />

    <p>税抜き価格: ¥{{ basePrice }}</p>
    <label>
      税込み価格で入力:
      <input :value="priceWithTax" @input="priceWithTax = Number(($event.target as HTMLInputElement).value)"
             type="number" style="border: 1px solid #ccc; padding: 4px; width: 80px; margin-left: 8px;" />
    </label>
    <p style="color: #666; font-size: 0.85em;">← 税込みで入力すると税抜きに逆算されます</p>
  </div>
</template>`
  },

  {
    id: 'watch',
    name: 'watch()',
    category: 'reactivity',
    summary: 'リアクティブなソースを監視し、変化したときに副作用を実行する。変化前後の値を受け取れる。',
    signature: `// 単一ソース
function watch<T>(
  source: WatchSource<T>,
  callback: (newValue: T, oldValue: T, onCleanup: (fn: () => void) => void) => void,
  options?: WatchOptions
): WatchStopHandle

// 複数ソース
function watch<T extends readonly unknown[]>(
  sources: [...{ [K in keyof T]: WatchSource<T[K]> }],
  callback: (newValues: T, oldValues: T, onCleanup: ...) => void,
  options?: WatchOptions
): WatchStopHandle

interface WatchOptions {
  immediate?: boolean  // 初回すぐ実行（デフォルト: false）
  deep?: boolean       // ネストしたオブジェクトも追跡（デフォルト: false）
  flush?: 'pre' | 'post' | 'sync'  // コールバック実行タイミング
  once?: boolean       // 一度だけ実行
}`,
    description: `\`watch()\` はリアクティブなソース（ref・computedRef・リアクティブオブジェクトのプロパティ・それらの配列）を監視し、変化したときにコールバックを実行します。

**watchEffect との最大の違い**: watch は「何を監視するか」を明示的に指定します。コールバックには変化前（oldValue）と変化後（newValue）の両方が渡されます。初回実行はデフォルトで行われません（\`immediate: true\` で変更可能）。

**ソースの種類**:
- \`ref\` や \`computed\` はそのまま渡す（\`.value\` は不要）
- \`reactive\` オブジェクトのプロパティはゲッター関数 \`() => state.count\` で渡す
- \`reactive\` オブジェクト全体を渡すと暗黙的に deep になる

**クリーンアップ**: 非同期処理の途中でウォッチャーが再実行された場合にキャンセルしたい処理は \`onCleanup\` 関数に登録します。`,
    whenToUse: [
      '非同期処理（API呼び出し・ファイル読み込みなど）をリアクティブな値の変化に応じて実行したいとき',
      '変化前後の値（newValue / oldValue）を使いたいとき',
      '監視対象を明示的に指定したいとき（watchEffectより制御しやすい）',
      '特定の条件下でのみ副作用を実行したい、または一度だけ実行したいとき（once オプション）'
    ],
    whenNotToUse: [
      '値を「導出」したいだけのとき（computed を使う）',
      '複数の依存を自動追跡させたいとき、または即時実行が必須のとき（watchEffect の方がシンプル）',
      '依存の変化に関係なく DOM 更新後に一度だけ処理したいとき（onMounted を使う）'
    ],
    pitfalls: [
      'reactive オブジェクトのプロパティを直接渡すと監視されない: watch(state.count, ...) はNG。必ずゲッター関数 watch(() => state.count, ...) を使うこと。',
      'deep: true は大きなオブジェクトのパフォーマンスに影響する。特定のプロパティだけ監視したい場合はゲッター関数で絞り込む。',
      'immediate: true と組み合わせると初回実行時に oldValue が undefined になる。型で考慮する必要がある。',
      'コンポーネント外（setup() 外）で作成したウォッチャーはコンポーネント破棄時に自動停止されない。戻り値の stop 関数を手動で呼ぶ必要がある。'
    ],
    relatedAPIs: ['watchEffect', 'computed', 'ref', 'reactive'],
    comparisons: [
      {
        targetAPI: 'watchEffect',
        summary: 'watch は監視対象を明示・oldValue を受け取れる・遅延実行がデフォルト。watchEffect は依存を自動追跡・即時実行がデフォルト。',
        useThisWhen: '監視するソースを明確に指定したいとき、変化前後の値が必要なとき、または非同期処理のキャンセルを制御したいとき。',
        useOtherWhen: '複数の依存をまとめて追跡したいとき、または「何に依存するか」をコードで明示しなくてよいシンプルな副作用のとき。'
      }
    ],
    codeExample: `<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

const userId = ref(1)
const userData = ref<{ name: string; email: string } | null>(null)
const loading = ref(false)

// ref をそのまま監視（.value は不要）
watch(userId, async (newId, oldId) => {
  console.log(\`ユーザーID: \${oldId} → \${newId}\`)
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 600))
  // 実際はここで API 呼び出し
  userData.value = {
    name: \`ユーザー \${newId}\`,
    email: \`user\${newId}@example.com\`
  }
  loading.value = false
})

// reactive のプロパティはゲッター関数で監視
const filter = reactive({ keyword: '', onlyActive: false })
const logs = ref<string[]>([])

watch(
  () => filter.keyword,
  (newKeyword) => {
    logs.value.push(\`キーワード変更: "\${newKeyword}"\`)
  }
)

// 複数ソースをまとめて監視
watch(
  [() => filter.keyword, () => filter.onlyActive],
  ([keyword, onlyActive]) => {
    logs.value.push(\`フィルター更新: keyword=\${keyword}, onlyActive=\${onlyActive}\`)
  }
)
</script>

<template>
  <div style="padding: 16px; font-family: sans-serif;">
    <div style="margin-bottom: 16px;">
      <p>ユーザーID: {{ userId }}</p>
      <button @click="userId--" :disabled="userId <= 1" style="margin-right: 8px;">-</button>
      <button @click="userId++">+</button>
      <p v-if="loading" style="color: #666;">読み込み中...</p>
      <p v-else-if="userData">{{ userData.name }} / {{ userData.email }}</p>
      <p v-else style="color: #999;">IDを変更するとデータが表示されます</p>
    </div>

    <hr style="margin: 12px 0;" />

    <div style="margin-bottom: 8px;">
      <input v-model="filter.keyword" placeholder="キーワード" style="border: 1px solid #ccc; padding: 4px;" />
      <label style="margin-left: 8px;">
        <input v-model="filter.onlyActive" type="checkbox" /> アクティブのみ
      </label>
    </div>

    <ul style="font-size: 0.85em; color: #555; max-height: 120px; overflow-y: auto; border: 1px solid #eee; padding: 8px;">
      <li v-for="(log, i) in logs" :key="i">{{ log }}</li>
      <li v-if="logs.length === 0" style="color: #aaa;">ログなし（フィルターを変更してみてください）</li>
    </ul>
  </div>
</template>`
  },

  {
    id: 'watchEffect',
    name: 'watchEffect()',
    category: 'reactivity',
    summary: 'コールバック内で使われたリアクティブな値を自動追跡し、いずれかが変化したら即時に再実行する。',
    signature: `function watchEffect(
  effect: (onCleanup: (fn: () => void) => void) => void,
  options?: WatchEffectOptions
): WatchStopHandle

interface WatchEffectOptions {
  flush?: 'pre' | 'post' | 'sync'  // デフォルト: 'pre'
}`,
    description: `\`watchEffect()\` はコールバック関数を即座に実行し、その実行中にアクセスしたすべてのリアクティブな値を自動的に依存として追跡します。依存のいずれかが変化すると、コールバックが再実行されます。

**watch との最大の違い**: 監視するソースを明示的に指定する必要がありません。コールバック内で参照したものすべてが依存になります。また、初回は必ず即時実行されます（\`immediate: true\` 相当）。

**flush オプション**:
- \`'pre'\`（デフォルト）: コンポーネントの DOM 更新前に実行
- \`'post'\`: DOM 更新後に実行（DOM にアクセスしたい場合）
- \`'sync'\`: 同期的に即座に実行（パフォーマンスに注意）

\`flush: 'post'\` を指定する場合は \`watchPostEffect()\` というエイリアスが使えます。

**クリーンアップ**: 引数の \`onCleanup\` にキャンセル処理を登録することで、再実行前に前回の処理をキャンセルできます。`,
    whenToUse: [
      '複数のリアクティブな値に依存する副作用を、依存を列挙せずシンプルに書きたいとき',
      'セットアップ時に即時実行が必要な副作用（初回ロードとその後の更新を同じ処理で扱いたい）',
      'DOM 更新後にリアクティブな値を使って何か処理したいとき（flush: "post"）'
    ],
    whenNotToUse: [
      '変化前後の値（oldValue / newValue）が必要なとき（watch を使う）',
      '特定の条件下でのみ実行したいとき（watch + 条件分岐の方が意図が明確）',
      'どの値に依存しているか明示したいとき（watchは依存が明確で可読性が高い）'
    ],
    pitfalls: [
      '依存が自動追跡されるため、意図せず余分な値に依存してしまうことがある。コールバックの中で「実は関係ない」ref を参照すると無駄な再実行が起きる。',
      '非同期処理を含む場合、await より後の参照は追跡されない。非同期関数全体を watchEffect に入れても、await 以降のリアクティブアクセスは依存に含まれない。',
      'コンポーネント外（setup() 外）で作成したものはコンポーネント破棄時に自動停止されない。戻り値の stop 関数を手動で呼ぶ必要がある。'
    ],
    relatedAPIs: ['watch', 'computed', 'ref'],
    comparisons: [
      {
        targetAPI: 'watch',
        summary: 'watchEffect は依存を自動追跡・即時実行・oldValue なし。watch は依存を明示・遅延実行（デフォルト）・oldValue あり。',
        useThisWhen: '「この値が変わったら処理する」という依存を列挙したくないとき、または初期化と更新を同一処理にまとめたいとき。',
        useOtherWhen: '変化前後の値が必要なとき、または監視対象を明確にして可読性を上げたいとき。非同期処理のキャンセルを細かく制御したいときも watch が向いている。'
      }
    ],
    codeExample: `<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const searchQuery = ref('')
const category = ref('all')
const results = ref<string[]>([])
const loading = ref(false)

// searchQuery と category 両方に依存 — 明示的な指定は不要
watchEffect(async (onCleanup) => {
  const query = searchQuery.value
  const cat = category.value

  if (!query) {
    results.value = []
    return
  }

  loading.value = true

  let cancelled = false
  onCleanup(() => { cancelled = true })

  await new Promise(resolve => setTimeout(resolve, 400))

  if (!cancelled) {
    results.value = [
      \`[\${cat}] \${query} の結果1\`,
      \`[\${cat}] \${query} の結果2\`,
      \`[\${cat}] \${query} の結果3\`,
    ]
    loading.value = false
  }
})
</script>

<template>
  <div style="padding: 16px; font-family: sans-serif;">
    <div style="margin-bottom: 8px;">
      <input
        v-model="searchQuery"
        placeholder="検索キーワード"
        style="border: 1px solid #ccc; padding: 4px; margin-right: 8px;"
      />
      <select v-model="category" style="border: 1px solid #ccc; padding: 4px;">
        <option value="all">すべて</option>
        <option value="news">ニュース</option>
        <option value="blog">ブログ</option>
      </select>
    </div>

    <p v-if="loading" style="color: #666;">検索中...</p>
    <ul v-else-if="results.length > 0" style="margin: 0; padding-left: 20px;">
      <li v-for="(r, i) in results" :key="i">{{ r }}</li>
    </ul>
    <p v-else-if="searchQuery" style="color: #999;">結果なし</p>
    <p v-else style="color: #aaa;">キーワードを入力すると検索します</p>
  </div>
</template>`
  },

  {
    id: 'shallowRef',
    name: 'shallowRef()',
    category: 'reactivity',
    summary: '`.value` の置き換えのみを追跡する浅いref。ネストしたプロパティの変化は追跡しない。',
    signature: `function shallowRef<T>(value: T): ShallowRef<T>

interface ShallowRef<T> {
  value: T  // .value の置き換えのみリアクティブ
}`,
    description: `\`shallowRef()\` は \`ref()\` の浅いバージョンです。\`.value\` そのものの置き換えはリアクティブに追跡しますが、\`.value\` 内部のプロパティの変化は追跡しません。

\`ref()\` にオブジェクトを渡すと内部で \`reactive()\` 相当の深いリアクティビティが適用されます。\`shallowRef()\` ではこれが行われないため、大きなオブジェクトを扱う際のパフォーマンス最適化に使えます。

**triggerRef との組み合わせ**: ネストしたプロパティを直接変更した後、手動で \`triggerRef()\` を呼ぶことで強制的に再描画できます。ただしこのパターンは例外的な用途向けで、通常は \`.value\` ごと置き換える設計にするべきです。`,
    whenToUse: [
      '大きなオブジェクト・配列を扱い、内部プロパティの変化を追跡する必要がないとき（パフォーマンス最適化）',
      '常に .value ごと置き換える（イミュータブルな更新）設計になっているとき',
      '外部ライブラリのオブジェクトをリアクティブにしたいが深い追跡のオーバーヘッドを避けたいとき'
    ],
    whenNotToUse: [
      '内部プロパティ（state.value.count++ など）を直接変更してリアクティビティを期待するとき（通常の ref を使う）',
      'ネストしたプロパティの変化を watch / computed で追跡したいとき'
    ],
    pitfalls: [
      'shallowRef のネストしたプロパティを変更しても UI は更新されない: list.value.push(item) は追跡されない。list.value = [...list.value, item] のように .value ごと置き換えること。',
      'triggerRef を使えばネストの変更後に強制更新できるが、これは例外的な手段。設計を見直してイミュータブルな更新パターンにする方が安全。'
    ],
    relatedAPIs: ['ref', 'triggerRef', 'shallowReactive'],
    comparisons: [
      {
        targetAPI: 'ref',
        summary: 'ref はネストしたプロパティまで深く追跡する。shallowRef は .value の置き換えのみ追跡し、内部の変化は無視する。',
        useThisWhen: '大きなオブジェクトを常に .value ごと置き換える設計で、パフォーマンスを優先したいとき。',
        useOtherWhen: 'ネストしたプロパティを直接変更してリアクティビティを得たいとき、またはプリミティブ値を扱うとき（この場合 ref と shallowRef に違いはない）。'
      }
    ],
    codeExample: `<script setup lang="ts">
import { shallowRef, triggerRef } from 'vue'

// 大きなリストを shallowRef で管理（深い追跡のオーバーヘッドを避ける）
const items = shallowRef([
  { id: 1, name: 'アイテム A', done: false },
  { id: 2, name: 'アイテム B', done: false },
  { id: 3, name: 'アイテム C', done: false },
])

// ✅ .value ごと置き換え → リアクティブに更新される
function addItem() {
  const newId = items.value.length + 1
  items.value = [
    ...items.value,
    { id: newId, name: \`アイテム \${String.fromCharCode(64 + newId)}\`, done: false }
  ]
}

function removeItem(id: number) {
  items.value = items.value.filter(item => item.id !== id)
}

// ⚠️ ネストしたプロパティを直接変更（通常は UI 更新されない）
// triggerRef で強制更新できるが、設計として避けるべき
function toggleDone(id: number) {
  const item = items.value.find(i => i.id === id)
  if (item) {
    item.done = !item.done
    triggerRef(items) // 手動で強制更新（例外的な使い方）
  }
}
</script>

<template>
  <div style="padding: 16px; font-family: sans-serif;">
    <button @click="addItem" style="margin-bottom: 12px;">アイテム追加</button>
    <ul style="list-style: none; padding: 0;">
      <li v-for="item in items" :key="item.id"
          style="display: flex; align-items: center; gap: 8px; padding: 4px 0; border-bottom: 1px solid #eee;">
        <input type="checkbox" :checked="item.done" @change="toggleDone(item.id)" />
        <span :style="{ textDecoration: item.done ? 'line-through' : 'none', color: item.done ? '#999' : 'inherit' }">
          {{ item.name }}
        </span>
        <button @click="removeItem(item.id)" style="margin-left: auto; color: red; background: none; border: none; cursor: pointer;">
          削除
        </button>
      </li>
    </ul>
  </div>
</template>`
  },

  {
    id: 'shallowReactive',
    name: 'shallowReactive()',
    category: 'reactivity',
    summary: 'トップレベルのプロパティのみリアクティブにする浅いreactive。ネストしたオブジェクトは追跡しない。',
    signature: `function shallowReactive<T extends object>(target: T): T`,
    description: `\`shallowReactive()\` は \`reactive()\` の浅いバージョンです。オブジェクトのトップレベルのプロパティへのアクセス・変更のみをリアクティブに追跡します。ネストしたオブジェクトのプロパティ変更は追跡されません。

\`reactive()\` はネストしたすべてのオブジェクトを再帰的に Proxy でラップします。\`shallowReactive()\` はトップレベルのみ Proxy でラップし、ネスト先のオブジェクトは通常のオブジェクトのままです。

これにより、深いネストを持つ大きなオブジェクト構造で不要なリアクティビティのオーバーヘッドを削減できます。`,
    whenToUse: [
      '大きなオブジェクト構造で、トップレベルのプロパティの変化のみ追跡したいとき',
      'ネストしたオブジェクトはイミュータブルに（丸ごと置き換える形で）更新する設計のとき',
      '外部ライブラリのデータ構造を浅くラップしたいとき'
    ],
    whenNotToUse: [
      'ネストしたオブジェクトのプロパティを直接変更してリアクティビティを得たいとき（通常の reactive を使う）',
      '単純なフォーム状態など、深いネストが不要なケース（reactive で十分）'
    ],
    pitfalls: [
      'ネストしたオブジェクトのプロパティを変更しても UI は更新されない: state.user.name = "Bob" は追跡されない。state.user = { ...state.user, name: "Bob" } のようにトップレベルのプロパティを置き換えること。',
      'shallowReactive と reactive の使い分けを迷ったら reactive を選ぶ。最適化が必要になったときに shallowReactive へ移行する。'
    ],
    relatedAPIs: ['reactive', 'shallowRef', 'readonly'],
    comparisons: [
      {
        targetAPI: 'reactive',
        summary: 'reactive は全ネストを深く追跡する。shallowReactive はトップレベルのみ追跡し、ネストしたオブジェクトは追跡しない。',
        useThisWhen: '大きなネスト構造でパフォーマンスを最適化したいとき、またはネストしたオブジェクトをイミュータブルに更新する設計のとき。',
        useOtherWhen: 'ネストしたプロパティも直接変更してリアクティビティを得たいとき（ほとんどの通常ユースケース）。'
      }
    ],
    codeExample: `<script setup lang="ts">
import { shallowReactive } from 'vue'

const state = shallowReactive({
  title: 'Vue学習メモ',
  count: 0,
  // ネストしたオブジェクト — 深い追跡はされない
  author: { name: 'Alice', age: 25 },
  tags: ['vue', 'javascript'],
})

// ✅ トップレベルのプロパティ変更 → 追跡される
function updateTitle() {
  state.title = '更新されたタイトル'
}

function increment() {
  state.count++
}

// ✅ トップレベルのプロパティごと置き換え → 追跡される
function updateAuthor() {
  state.author = { name: 'Bob', age: 30 }
}

// ❌ ネストしたプロパティの直接変更 → 追跡されない（UI更新なし）
function tryDirectUpdate() {
  state.author.name = 'Charlie' // これは UI に反映されない
}
</script>

<template>
  <div style="padding: 16px; font-family: sans-serif;">
    <p><strong>タイトル:</strong> {{ state.title }}</p>
    <p><strong>カウント:</strong> {{ state.count }}</p>
    <p><strong>著者:</strong> {{ state.author.name }}（{{ state.author.age }}歳）</p>

    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px;">
      <button @click="updateTitle">タイトル更新 ✅</button>
      <button @click="increment">カウント++ ✅</button>
      <button @click="updateAuthor">著者を置き換え ✅</button>
      <button @click="tryDirectUpdate" style="color: #c00;">
        著者名を直接変更 ❌（UI更新されない）
      </button>
    </div>
  </div>
</template>`
  },

  {
    id: 'toRef',
    name: 'toRef()',
    category: 'reactivity',
    summary: 'reactiveオブジェクトのプロパティ、またはgetterをRefとして切り出す。元オブジェクトとの同期を保つ。',
    signature: `// reactive のプロパティから
function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K,
  defaultValue?: T[K]
): ToRef<T[K]>

// getter から（Vue 3.3+）
function toRef<T>(
  getter: () => T
): Readonly<Ref<T>>`,
    description: `\`toRef()\` は \`reactive\` オブジェクトの特定のプロパティを、元オブジェクトと同期した \`Ref\` として取り出します。

取り出した Ref の \`.value\` を変更すると元の \`reactive\` オブジェクトのプロパティも更新されます。逆も同様です。これが \`ref(state.count)\` とは決定的に異なる点で、\`ref()\` でコピーすると同期が切れます。

**主な用途**:
1. composable に \`reactive\` オブジェクトのプロパティを渡す際に、リアクティビティを保持したまま渡す
2. props からリアクティブな参照を作成する（\`toRef(props, 'modelValue')\`）

Vue 3.3 以降は getter 形式 \`toRef(() => props.value)\` も使えます。`,
    whenToUse: [
      'reactive オブジェクトの特定プロパティを、リアクティビティを保ったまま単体の Ref として切り出したいとき',
      'composable に reactive のプロパティを渡すとき（分割代入すると失われるため）',
      'props のプロパティをリアクティブな Ref として扱いたいとき'
    ],
    whenNotToUse: [
      'reactive オブジェクトの全プロパティを一括で Ref にしたいとき（toRefs を使う）',
      '元オブジェクトとの同期が不要なコピーを作りたいとき（ref(state.count) でコピーする）'
    ],
    pitfalls: [
      'ref(state.count) と toRef(state, "count") は別物: ref() はその時点の値のコピーを作るため元の reactive との同期はない。toRef() は同期した参照を作る。',
      'toRef で取り出した Ref の .value を変更すると元の reactive オブジェクトのプロパティも変わる。意図しない副作用に注意。'
    ],
    relatedAPIs: ['toRefs', 'reactive', 'ref', 'unref'],
    comparisons: [
      {
        targetAPI: 'toRefs',
        summary: 'toRef は特定の1プロパティだけを Ref として取り出す。toRefs はオブジェクトの全プロパティを一括で Ref に変換する。',
        useThisWhen: '特定の1つのプロパティだけを取り出したいとき、または props の特定プロパティを参照したいとき。',
        useOtherWhen: 'composable の戻り値として reactive を分割代入させたいとき、またはオブジェクトの全プロパティを Ref にしたいとき。'
      }
    ],
    codeExample: `<script setup lang="ts">
import { reactive, toRef, watch } from 'vue'

const state = reactive({
  firstName: 'Alice',
  lastName: 'Smith',
  age: 25,
})

// reactive のプロパティを Ref として切り出す（元オブジェクトと同期）
const firstName = toRef(state, 'firstName')
const age = toRef(state, 'age')

// firstName.value を変更 → state.firstName も変わる
function updateFirstName() {
  firstName.value = 'Bob'
}

// state.age を変更 → age.value も変わる（双方向同期）
function birthday() {
  state.age++
}

// watch に直接渡せる（Ref として機能するため）
watch(age, (newAge) => {
  console.log(\`年齢が変わりました: \${newAge}\`)
})

// ❌ ref() でコピーすると同期が切れる
// const ageCopy = ref(state.age)
// ageCopy.value++ しても state.age は変わらない
</script>

<template>
  <div style="padding: 16px; font-family: sans-serif;">
    <p>state.firstName: <strong>{{ state.firstName }}</strong></p>
    <p>firstName.value（toRef）: <strong>{{ firstName }}</strong></p>
    <p>state.age: <strong>{{ state.age }}</strong></p>
    <p>age.value（toRef）: <strong>{{ age }}</strong></p>

    <div style="display: flex; gap: 8px; margin-top: 12px;">
      <button @click="updateFirstName">firstName.value を変更（state にも反映）</button>
      <button @click="birthday">state.age を変更（age にも反映）</button>
    </div>
    <p style="margin-top: 8px; font-size: 0.85em; color: #666;">
      どちらを変更しても両方が同期して更新されます
    </p>
  </div>
</template>`
  },

  {
    id: 'toRefs',
    name: 'toRefs()',
    category: 'reactivity',
    summary: 'reactiveオブジェクトの全プロパティをRefに変換する。分割代入してもリアクティビティが保持される。',
    signature: `function toRefs<T extends object>(
  object: T
): { [K in keyof T]: ToRef<T[K]> }`,
    description: `\`toRefs()\` は \`reactive\` オブジェクトの各プロパティを \`toRef()\` で個別に Ref 化し、同じキーを持つオブジェクトとして返します。

**最大の用途**: composable の戻り値です。composable が \`reactive\` で状態を管理している場合、そのまま返すと呼び出し側で分割代入したときにリアクティビティが失われます。\`toRefs()\` を通して返すことで、分割代入しても各プロパティがリアクティブな Ref として機能し続けます。

返ってきた各 Ref は元の \`reactive\` オブジェクトと同期しているため、どちらを変更しても両方に反映されます。`,
    whenToUse: [
      'composable から reactive の状態を返すとき（分割代入でリアクティビティを失わせないため）',
      'reactive オブジェクトを分割代入して使いたいとき',
      'reactive の全プロパティを一括で Ref に変換したいとき'
    ],
    whenNotToUse: [
      '特定の1プロパティだけを取り出したいとき（toRef を使う）',
      'reactive を分割代入する予定がなく、常に state.xxx の形でアクセスするとき（変換不要）'
    ],
    pitfalls: [
      'toRefs で取り出した Ref はテンプレートで .value が自動アンラップされるが、スクリプト内では .value が必要。',
      'toRefs は呼び出し時点で存在するプロパティのみ変換する。後から reactive に追加されたプロパティは toRefs の結果に含まれない。',
      'composable 内で reactive を使う場合、toRefs を返すか ref のみで構成するかをチームで統一しておくとコードが読みやすい。'
    ],
    relatedAPIs: ['toRef', 'reactive', 'ref'],
    comparisons: [
      {
        targetAPI: 'toRef',
        summary: 'toRefs はオブジェクトの全プロパティを一括 Ref 化する。toRef は特定の1プロパティだけを Ref として取り出す。',
        useThisWhen: 'composable の戻り値として reactive を分割代入可能な形で返したいとき、またはオブジェクト全体を一括変換したいとき。',
        useOtherWhen: '特定の1プロパティだけが必要なとき。props の特定プロパティを参照するときも toRef が向いている。'
      }
    ],
    codeExample: `<script setup lang="ts">
import { reactive, toRefs } from 'vue'

// composable の実装パターン
function useUserForm() {
  const state = reactive({
    name: '',
    email: '',
    submitted: false,
  })

  function submit() {
    if (state.name && state.email) {
      state.submitted = true
    }
  }

  function reset() {
    state.name = ''
    state.email = ''
    state.submitted = false
  }

  // toRefs で返すことで、呼び出し側が分割代入してもリアクティビティ保持
  return { ...toRefs(state), submit, reset }
}

// 分割代入しても name / email / submitted は Ref として機能する
const { name, email, submitted, submit, reset } = useUserForm()
</script>

<template>
  <div style="padding: 16px; font-family: sans-serif; max-width: 300px;">
    <div v-if="submitted" style="color: green;">
      <p>✅ 送信完了！ {{ name }}（{{ email }}）</p>
      <button @click="reset">戻る</button>
    </div>
    <div v-else>
      <div style="margin-bottom: 8px;">
        <input v-model="name" placeholder="名前" style="border: 1px solid #ccc; padding: 4px; width: 100%;" />
      </div>
      <div style="margin-bottom: 12px;">
        <input v-model="email" placeholder="メールアドレス" style="border: 1px solid #ccc; padding: 4px; width: 100%;" />
      </div>
      <button @click="submit" :disabled="!name || !email">送信</button>
    </div>
  </div>
</template>`
  },

  // ─── readonly() ───────────────────────────────────────────────
  {
    id: 'readonly',
    name: 'readonly()',
    category: 'reactivity',
    summary: 'リアクティブオブジェクトまたは ref の読み取り専用プロキシを返す。変更しようとすると警告が出る。',
    signature: `function readonly<T extends object>(target: T): DeepReadonly<T>`,
    description: `\`readonly()\` はリアクティブなオブジェクト（\`reactive\`・\`ref\`・\`computed\` の結果など）を受け取り、すべてのプロパティへの書き込みをブロックする読み取り専用プロキシを返します。

元のリアクティブオブジェクトへの変更はプロキシにも反映されます。つまり「読み取り専用のビュー」を作るだけで、元データ自体は通常どおり更新できます。

**provide / inject パターンとの組み合わせ**が最も典型的な用途です。親コンポーネントが状態を提供する際に \`readonly()\` でラップすることで、子孫が誤って直接書き換えるのを防ぎつつ、更新は親の公開するメソッド経由でのみ行わせる設計にできます。

ネストされたオブジェクトも再帰的に読み取り専用になります（\`DeepReadonly\`）。`,
    whenToUse: [
      'provide / inject で状態を渡すとき——子孫からの直接変更を防ぐため',
      'composable が内部状態を外部に公開するが、変更は公開メソッド経由にしたいとき',
      'props のように「受け取る側は変更しない」という契約をコードで表現したいとき',
    ],
    whenNotToUse: [
      '読み書き両方が必要な場所（無意味に制約が増えるだけ）',
      'computed() で十分な場合（1つの値を導出するだけなら computed で済む）',
    ],
    pitfalls: [
      '`readonly()` は JavaScript の Object.freeze() とは異なり、元のリアクティブオブジェクトへの変更はプロキシにも反映されます。完全な不変オブジェクトが欲しい場合は Object.freeze() を使うか、immer 等のライブラリを検討してください。',
      '開発環境ではコンソール警告が出るだけで、実際に例外はスローされません。本番ビルドでは警告も消えます。重要なデータ保護には別の設計も考慮してください。',
    ],
    relatedAPIs: ['reactive', 'ref', 'shallowReadonly'],
    comparisons: [
      {
        targetAPI: 'reactive()',
        summary: 'reactive は読み書き可能なリアクティブオブジェクト。readonly はそれを「読み取り専用のビュー」に変換するラッパー。',
        useThisWhen: 'provide/inject で子孫に渡すなど、変更させたくない場合',
        useOtherWhen: '状態を通常どおり読み書きする場合',
      },
    ],
    codeExample: `<script setup lang="ts">
import { reactive, readonly, provide } from 'vue'

// 親コンポーネントが状態と更新メソッドを管理
const state = reactive({
  count: 0,
  message: 'こんにちは'
})

// 子孫には読み取り専用プロキシだけを渡す
const readonlyState = readonly(state)

function increment() {
  state.count++ // 元オブジェクトは書き換えられる
}

provide('state', readonlyState)    // 読み取り専用で公開
provide('increment', increment)    // 変更手段も公開

// 読み取り専用プロキシへの書き込み試みを確認
function tryMutate() {
  // @ts-expect-error — TypeScript も警告する
  readonlyState.count++ // 開発環境でコンソール警告
}
</script>

<template>
  <div style="font-family: sans-serif; padding: 16px;">
    <p>カウント: {{ readonlyState.count }}</p>
    <p>メッセージ: {{ readonlyState.message }}</p>
    <div style="display: flex; gap: 8px; margin-top: 12px;">
      <button @click="increment" style="padding: 6px 12px; background: #42b883; color: white; border: none; border-radius: 4px; cursor: pointer;">
        ✅ increment()（元オブジェクト経由）
      </button>
      <button @click="tryMutate" style="padding: 6px 12px; background: #e53e3e; color: white; border: none; border-radius: 4px; cursor: pointer;">
        ❌ readonlyState.count++（警告）
      </button>
    </div>
    <p style="margin-top: 8px; font-size: 12px; color: #718096;">
      ❌ ボタンはコンソールに警告を出します（値は変わらない）
    </p>
  </div>
</template>`,
  },

  // ─── isRef() / isReactive() / isReadonly() ───────────────────
  {
    id: 'isRef',
    name: 'isRef() / isReactive() / isReadonly()',
    category: 'reactivity',
    summary: '値がリアクティブな型かどうかを実行時に判定するガード関数。型の絞り込みにも使える。',
    signature: `function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
function isReactive(value: unknown): boolean
function isReadonly(value: unknown): boolean

// 補足: isShallow() も同様のパターン
function isShallow(value: unknown): boolean`,
    description: `これら3つのガード関数は、実行時に値のリアクティビティ型を確認するために使います。

**\`isRef()\`** は TypeScript の型ガードとして機能し、\`true\` を返した後は型が \`Ref<T>\` に絞り込まれます。

**\`isReactive()\`** は \`reactive()\` でラップされているオブジェクトを判定します。\`readonly(reactive({}))\` のようにラップされていても \`true\` を返します。

**\`isReadonly()\`** は \`readonly()\` や \`computed()\`（setterなし）でラップされているものを判定します。

主な用途は汎用ライブラリや composable のデバッグ・ロギングです。アプリケーションコードでこれらを頻繁に使っている場合、設計を見直す余地があるかもしれません。`,
    whenToUse: [
      '型が `Ref<T> | T` のように不確かな引数を受け取るライブラリ・汎用composableを作るとき',
      'デバッグ・開発ツールでリアクティビティの状態を検査するとき',
      'テストコードで期待通りのリアクティブ型が返っているか確認するとき',
    ],
    whenNotToUse: [
      'アプリケーション内のコンポーネントで使う場合——型が明確なはずなので分岐が不要',
      '`isRef()` の代わりに `!!value?.value` のようなチェックをしているとき（型安全でない）',
    ],
    pitfalls: [
      '`isReactive(readonly(reactive({})))` は `true` を返します。readonly でラップしても reactive の性質は残ります。readonly かどうかを確認するには `isReadonly()` を別途呼ぶ必要があります。',
    ],
    relatedAPIs: ['ref', 'reactive', 'readonly', 'unref'],
    comparisons: [
      {
        targetAPI: 'unref()',
        summary: 'isRef は「ref かどうか判定する」だけ。unref は「ref なら .value を、そうでなければそのままを返す」と値を取り出す処理まで行う。',
        useThisWhen: 'リアクティブ型の確認や条件分岐をしたいとき',
        useOtherWhen: '判定+アンラップを一括で済ませたいとき',
      },
    ],
    codeExample: `<script setup lang="ts">
import { ref, reactive, readonly, computed, isRef, isReactive, isReadonly } from 'vue'

const count = ref(0)
const state = reactive({ name: 'Vue' })
const ro = readonly(state)
const doubled = computed(() => count.value * 2)

interface CheckResult {
  label: string
  isRef: boolean
  isReactive: boolean
  isReadonly: boolean
}

const checks: CheckResult[] = [
  {
    label: 'ref(0)',
    isRef: isRef(count),
    isReactive: isReactive(count),
    isReadonly: isReadonly(count),
  },
  {
    label: "reactive({ name: 'Vue' })",
    isRef: isRef(state),
    isReactive: isReactive(state),
    isReadonly: isReadonly(state),
  },
  {
    label: 'readonly(state)',
    isRef: isRef(ro),
    isReactive: isReactive(ro),   // true — reactive の性質は残る
    isReadonly: isReadonly(ro),
  },
  {
    label: 'computed(() => count * 2)',
    isRef: isRef(doubled),         // computed は Ref でもある
    isReactive: isReactive(doubled),
    isReadonly: isReadonly(doubled), // getter のみ computed は readonly
  },
]

// isRef の型ガード活用例
function printValue(val: number | typeof count) {
  if (isRef(val)) {
    console.log('Ref の値:', val.value) // ここで val は Ref<number> に絞られる
  } else {
    console.log('プリミティブ:', val)
  }
}
</script>

<template>
  <div style="font-family: sans-serif; padding: 16px;">
    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
      <thead>
        <tr style="background: #f7fafc;">
          <th style="padding: 8px; border: 1px solid #e2e8f0; text-align: left;">値</th>
          <th style="padding: 8px; border: 1px solid #e2e8f0;">isRef</th>
          <th style="padding: 8px; border: 1px solid #e2e8f0;">isReactive</th>
          <th style="padding: 8px; border: 1px solid #e2e8f0;">isReadonly</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in checks" :key="c.label">
          <td style="padding: 8px; border: 1px solid #e2e8f0; font-family: monospace;">{{ c.label }}</td>
          <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">{{ c.isRef ? '✅' : '—' }}</td>
          <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">{{ c.isReactive ? '✅' : '—' }}</td>
          <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">{{ c.isReadonly ? '✅' : '—' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>`,
  },

  // ─── unref() ──────────────────────────────────────────────────
  {
    id: 'unref',
    name: 'unref()',
    category: 'reactivity',
    summary: '引数が Ref なら `.value` を返し、そうでなければそのまま返す。`isRef(val) ? val.value : val` の糖衣構文。',
    signature: `function unref<T>(ref: T | Ref<T>): T`,
    description: `\`unref()\` は \`isRef(val) ? val.value : val\` のショートハンドです。

主な用途は、**\`Ref<T> | T\` という union 型の引数を受け取る汎用composable・ライブラリ関数**の中で、型を気にせずに値を取り出すことです。

Vue のテンプレート内アンラップと似た動作をスクリプト内で再現できます。

例えば Vue Router や VueUse のユーティリティは、\`ref\` でも生の値でも受け取れるような柔軟なAPIをこのパターンで実現しています。`,
    whenToUse: [
      '`Ref<T> | T` を受け取る汎用関数・composable の中で統一的に値を取り出したいとき',
      'props が `ref` として渡されることも、生の値で渡されることもある設計のとき',
      'VueUse ライクなユーティリティを自作するとき',
    ],
    whenNotToUse: [
      '型が明確に `Ref<T>` とわかっている場合（`.value` で直接アクセスする方が明快）',
      '`reactive` オブジェクトのプロパティを取り出したい場合（`toRef()` / `toRefs()` が適切）',
    ],
    pitfalls: [
      '`unref()` は `reactive()` オブジェクト自体には特別な処理をしません。`reactive` オブジェクトをそのまま返します。あくまで `Ref` のアンラップ専用です。',
    ],
    relatedAPIs: ['ref', 'isRef', 'toRef'],
    comparisons: [
      {
        targetAPI: 'isRef()',
        summary: 'isRef は判定だけ。unref は判定＋値取り出しまで一括でやる。isRef が必要なのは、ref かどうかで異なる処理をしたいときだけ。',
        useThisWhen: 'Ref でも生の値でも同じように値を取り出したいとき',
        useOtherWhen: 'ref かどうかで処理を分岐させたいとき',
      },
    ],
    codeExample: `<script setup lang="ts">
import { ref, unref } from 'vue'
import type { Ref } from 'vue'

// MaybeRef 型：Ref でも生の値でも受け取れる汎用型
type MaybeRef<T> = T | Ref<T>

// unref を使った汎用ユーティリティ関数
function double(value: MaybeRef<number>): number {
  return unref(value) * 2  // Ref でも数値でも同じコードで扱える
}

function greet(name: MaybeRef<string>): string {
  return \`こんにちは、\${unref(name)}さん！\`
}

const countRef = ref(5)
const nameRef = ref('太郎')

const doubled1 = double(countRef)   // Ref を渡す
const doubled2 = double(10)         // 生の数値を渡す
const greeting1 = greet(nameRef)    // Ref を渡す
const greeting2 = greet('花子')    // 生の文字列を渡す
</script>

<template>
  <div style="font-family: sans-serif; padding: 16px;">
    <h3 style="margin-top: 0;">unref() の活用</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
      <thead>
        <tr style="background: #f7fafc;">
          <th style="padding: 8px; border: 1px solid #e2e8f0; text-align: left;">呼び出し</th>
          <th style="padding: 8px; border: 1px solid #e2e8f0; text-align: left;">結果</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 8px; border: 1px solid #e2e8f0; font-family: monospace;">double(countRef) — ref(5)</td>
          <td style="padding: 8px; border: 1px solid #e2e8f0;">{{ doubled1 }}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #e2e8f0; font-family: monospace;">double(10) — 生の値</td>
          <td style="padding: 8px; border: 1px solid #e2e8f0;">{{ doubled2 }}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #e2e8f0; font-family: monospace;">greet(nameRef) — ref</td>
          <td style="padding: 8px; border: 1px solid #e2e8f0;">{{ greeting1 }}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #e2e8f0; font-family: monospace;">greet('花子') — 生の値</td>
          <td style="padding: 8px; border: 1px solid #e2e8f0;">{{ greeting2 }}</td>
        </tr>
      </tbody>
    </table>
    <p style="margin-top: 12px; font-size: 12px; color: #718096;">
      同じ関数が Ref でも生の値でも動作する
    </p>
  </div>
</template>`,
  },

  // ─── triggerRef() ─────────────────────────────────────────────
  {
    id: 'triggerRef',
    name: 'triggerRef()',
    category: 'reactivity',
    summary: 'shallowRef に対して強制的に更新通知を発火する。深い変更をしたあと手動でUIを同期させるために使う。',
    signature: `function triggerRef(ref: ShallowRef): void`,
    description: `\`triggerRef()\` は \`shallowRef\` の浅いリアクティビティを意図的にバイパスするための脱出ハッチです。

\`shallowRef\` は \`.value\` への**再代入**のみを追跡するため、\`.value\` の中のオブジェクトを深く変更しても更新は通知されません。\`triggerRef()\` を手動で呼ぶことで、その時点の値で強制的に再レンダリングをトリガーできます。

**使い所は限定的です。** 通常は \`.value\` を再代入する（イミュータブルな更新）方が明快で安全です。triggerRef が必要になるのは、大きなオブジェクトをコピーせず直接変更したい（パフォーマンス最適化）という特殊なケースに限られます。

\`shallowRef\` と組み合わせる場合のみ意味を持ちます。通常の \`ref\` には効果がありません（ref は深い変更も自動追跡するため）。`,
    whenToUse: [
      '`shallowRef` で管理している大きなオブジェクトを直接ミューテートした後、手動で更新通知を発火したいとき',
      'イミュータブルな再代入を避けてパフォーマンスを最適化したい特殊なケース',
    ],
    whenNotToUse: [
      '通常の `ref` に対して使う場合（ref は自動で深い変更を追跡するため意味がない）',
      '`shallowRef` のイミュータブル更新（`.value = { ...newObj }`）で代替できる場合——triggerRef は最後の手段',
    ],
    pitfalls: [
      '`triggerRef()` を多用しているなら、設計を見直すサインです。`shallowRef` + `triggerRef` のペアは「ミュータブルな更新 + 手動通知」というパターンで、テストや予測が難しくなります。シンプルさが優先される場合は通常の `ref` + イミュータブル更新に戻してください。',
    ],
    relatedAPIs: ['shallowRef', 'ref', 'shallowReactive'],
    comparisons: [
      {
        targetAPI: 'shallowRef()',
        summary: 'shallowRef は浅いリアクティビティを提供する。triggerRef はその shallowRef に対して強制的に更新通知を送る補完ツール。常にセットで考える。',
        useThisWhen: 'shallowRef の値を深く変更した後に更新を通知したいとき',
        useOtherWhen: '`.value` の再代入（イミュータブル更新）で済む場合——triggerRef 不要',
      },
    ],
    codeExample: `<script setup lang="ts">
import { shallowRef, triggerRef } from 'vue'

interface Item {
  id: number
  name: string
  done: boolean
}

const items = shallowRef<Item[]>([
  { id: 1, name: 'Vue を学ぶ', done: false },
  { id: 2, name: 'Nuxt を試す', done: false },
  { id: 3, name: 'アプリを公開する', done: false },
])

// ✅ イミュータブル更新（推奨）— triggerRef 不要
function toggleImmutable(id: number) {
  items.value = items.value.map(item =>
    item.id === id ? { ...item, done: !item.done } : item
  )
}

// ⚠️ ミュータブル直接変更 + triggerRef（パフォーマンス最適化時のみ）
function toggleMutable(id: number) {
  const item = items.value.find(i => i.id === id)
  if (item) {
    item.done = !item.done      // shallowRef は検知できない
    triggerRef(items)           // 手動で更新通知を発火
  }
}
</script>

<template>
  <div style="font-family: sans-serif; padding: 16px;">
    <ul style="list-style: none; padding: 0;">
      <li
        v-for="item in items"
        :key="item.id"
        style="display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid #e2e8f0;"
      >
        <span :style="{ textDecoration: item.done ? 'line-through' : 'none', flex: 1 }">
          {{ item.done ? '✅' : '⬜' }} {{ item.name }}
        </span>
        <button @click="toggleImmutable(item.id)" style="padding: 4px 8px; font-size: 12px; background: #42b883; color: white; border: none; border-radius: 3px; cursor: pointer;">
          再代入
        </button>
        <button @click="toggleMutable(item.id)" style="padding: 4px 8px; font-size: 12px; background: #ed8936; color: white; border: none; border-radius: 3px; cursor: pointer;">
          triggerRef
        </button>
      </li>
    </ul>
    <p style="margin-top: 8px; font-size: 12px; color: #718096;">
      どちらのボタンも同じ結果になるが、内部の仕組みが異なる
    </p>
  </div>
</template>`,
  },
]
