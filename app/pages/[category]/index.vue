<script setup lang="ts">
import { getCategoryAPIs, getAllCategories } from '~/data/index'
import type { APICategory } from '~/data/types'

const route = useRoute()
const categoryId = route.params.category as APICategory

const categories = getAllCategories()
const category = categories.find(c => c.id === categoryId)
const apis = getCategoryAPIs(categoryId)

if (!category) {
  throw createError({ statusCode: 404, statusMessage: 'カテゴリが見つかりません' })
}

useSeoMeta({ title: `${category.name} — Vue Composition API ガイド` })
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="flex items-center gap-3 mb-2">
      <UIcon :name="category!.icon" class="text-3xl text-primary" />
      <h1 class="text-2xl font-bold">{{ category!.name }}</h1>
    </div>
    <p class="text-muted mb-8">{{ category!.description }}</p>

    <div v-if="apis.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <ApiCard v-for="api in apis" :key="api.id" :api="api" />
    </div>
    <div v-else class="text-center py-16 text-muted">
      <UIcon name="i-heroicons-clock" class="text-4xl mb-3" />
      <p>このカテゴリのコンテンツは準備中です</p>
    </div>
  </div>
</template>
