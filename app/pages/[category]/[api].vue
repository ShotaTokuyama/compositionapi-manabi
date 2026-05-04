<script setup lang="ts">
import { getAPIById, getAllCategories } from '~/data/index'

const route = useRoute()
const apiId = route.params.api as string

const api = getAPIById(apiId)
const categories = getAllCategories()
const category = categories.find(c => c.id === api?.category)

if (!api) {
  throw createError({ statusCode: 404, statusMessage: 'APIが見つかりません' })
}

useSeoMeta({ title: `${api.name} — Vue Composition API ガイド` })
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto space-y-8">

    <!-- ヘッダー -->
    <div>
      <div class="flex items-center gap-2 mb-2">
        <UBadge
          :label="category!.name"
          :icon="category!.icon"
          variant="soft"
          color="primary"
        />
      </div>
      <h1 class="text-3xl font-bold font-mono">{{ api!.name }}</h1>
      <p class="text-lg text-muted mt-2">{{ api!.summary }}</p>
    </div>

    <!-- シグネチャ -->
    <div>
      <h2 class="text-sm font-semibold uppercase tracking-wider text-muted mb-2">シグネチャ</h2>
      <CodeBlock :code="api!.signature" lang="typescript" />
    </div>

    <!-- 解説 -->
    <div>
      <h2 class="text-xl font-semibold mb-3">解説</h2>
      <div class="text-muted leading-relaxed whitespace-pre-line">{{ api!.description }}</div>
    </div>

    <!-- いつ使うか / 使わないか -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UCard>
        <template #header>
          <p class="font-semibold flex items-center gap-2">
            <UIcon name="i-heroicons-check-circle" class="text-success text-lg" />
            使うべきケース
          </p>
        </template>
        <ul class="space-y-2">
          <li v-for="(item, i) in api!.whenToUse" :key="i" class="flex gap-2 text-sm">
            <span class="text-success mt-0.5">•</span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </UCard>

      <UCard>
        <template #header>
          <p class="font-semibold flex items-center gap-2">
            <UIcon name="i-heroicons-x-circle" class="text-error text-lg" />
            使うべきでないケース
          </p>
        </template>
        <ul class="space-y-2">
          <li v-for="(item, i) in api!.whenNotToUse" :key="i" class="flex gap-2 text-sm">
            <span class="text-error mt-0.5">•</span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </UCard>
    </div>

    <!-- よくある落とし穴 -->
    <div v-if="api!.pitfalls?.length">
      <h2 class="text-xl font-semibold mb-3">よくある落とし穴</h2>
      <div class="space-y-3">
        <UAlert
          v-for="(pitfall, i) in api!.pitfalls"
          :key="i"
          icon="i-heroicons-exclamation-triangle"
          color="warning"
          variant="soft"
          :description="pitfall"
        />
      </div>
    </div>

    <!-- コード例 -->
    <div>
      <h2 class="text-xl font-semibold mb-3">コード例</h2>
      <CodeBlock :code="api!.codeExample" lang="vue" />
      <div class="mt-3">
        <PlaygroundLink :code="api!.codeExample" />
      </div>
    </div>

    <!-- 類似APIとの比較 -->
    <div v-if="api!.comparisons?.length">
      <h2 class="text-xl font-semibold mb-3">類似APIとの比較</h2>
      <ApiComparison :comparisons="api!.comparisons" :current-a-p-i-name="api!.name" />
    </div>

    <!-- 関連API -->
    <div v-if="api!.relatedAPIs.length">
      <h2 class="text-xl font-semibold mb-3">関連API</h2>
      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="relatedId in api!.relatedAPIs"
          :key="relatedId"
          :to="`/${api!.category}/${relatedId}`"
        >
          <UBadge
            :label="`${relatedId}()`"
            variant="outline"
            color="neutral"
            class="hover:ring-1 hover:ring-primary transition-all cursor-pointer"
          />
        </NuxtLink>
      </div>
    </div>

  </div>
</template>
