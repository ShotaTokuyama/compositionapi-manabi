import type { APICategory, APIEntry, Category } from './types'
import { reactivityAPIs } from './reactivity'
import { lifecycleAPIs } from './lifecycle'
import { diAPIs } from './di'
import { composablesAPIs } from './composables'

export const categories: Category[] = [
  {
    id: 'reactivity',
    name: 'Reactivity API',
    description: 'ref・reactive・computed・watchなど、リアクティブなデータを扱うための中核API群。どのAPIをいつ使うかの判断基準を身につける。',
    icon: 'i-heroicons-bolt'
  },
  {
    id: 'lifecycle',
    name: 'Lifecycle Hooks',
    description: 'コンポーネントのマウント・更新・アンマウント時に処理を差し込むフック。副作用の登録とクリーンアップの正しいパターンを学ぶ。',
    icon: 'i-heroicons-arrow-path'
  },
  {
    id: 'di',
    name: 'Dependency Injection',
    description: 'provide / inject による祖先から子孫への依存注入。Propsドリリングを避けながら型安全に状態を共有する方法。',
    icon: 'i-heroicons-link'
  },
  {
    id: 'composables',
    name: 'Composables 設計',
    description: 'useXxx() パターンによるロジックの抽出と再利用。状態とライフサイクルをまとめて持ち運べる設計パターン。',
    icon: 'i-heroicons-puzzle-piece'
  }
]

const allAPIs: APIEntry[] = [
  ...reactivityAPIs,
  ...lifecycleAPIs,
  ...diAPIs,
  ...composablesAPIs
]

export function getAllAPIs(): APIEntry[] {
  return allAPIs
}

export function getCategoryAPIs(category: APICategory): APIEntry[] {
  return allAPIs.filter(api => api.category === category)
}

export function getAPIById(id: string): APIEntry | undefined {
  return allAPIs.find(api => api.id === id)
}

export function getAllCategories(): Category[] {
  return categories
}
