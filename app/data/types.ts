export type APICategory = 'reactivity' | 'lifecycle' | 'di' | 'composables'

export interface APIComparison {
  targetAPI: string
  summary: string
  useThisWhen: string
  useOtherWhen: string
}

export interface APIEntry {
  id: string
  name: string
  category: APICategory
  summary: string
  signature: string
  description: string
  whenToUse: string[]
  whenNotToUse: string[]
  pitfalls?: string[]
  relatedAPIs: string[]
  comparisons?: APIComparison[]
  codeExample: string
}

export interface Category {
  id: APICategory
  name: string
  description: string
  icon: string
}
