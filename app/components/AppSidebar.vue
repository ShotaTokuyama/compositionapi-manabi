<script setup lang="ts">
import { getAllCategories, getCategoryAPIs, getAllAPIs } from '~/data/index'

defineEmits<{
  navigate: []
}>()

const route = useRoute()
const searchQuery = ref('')

const categories = getAllCategories()

const filteredAPIs = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return null
  return getAllAPIs().filter(api =>
    api.name.toLowerCase().includes(q) ||
    api.summary.toLowerCase().includes(q)
  )
})

function isActive(categoryId: string, apiId: string) {
  return route.params.category === categoryId && route.params.api === apiId
}
</script>

<template>
  <div class="py-4 space-y-4">
    <div class="px-3">
      <UInput
        v-model="searchQuery"
        placeholder="APIを検索..."
        icon="i-heroicons-magnifying-glass"
        size="sm"
        variant="soft"
      />
    </div>

    <!-- 検索結果 -->
    <div v-if="filteredAPIs !== null">
      <p class="px-3 text-xs font-semibold text-muted uppercase tracking-wider mb-1">
        検索結果 ({{ filteredAPIs.length }})
      </p>
      <p v-if="filteredAPIs.length === 0" class="px-3 text-sm text-muted">
        見つかりませんでした
      </p>
      <ul v-else>
        <li v-for="api in filteredAPIs" :key="api.id">
          <NuxtLink
            :to="`/${api.category}/${api.id}`"
            class="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md mx-1 transition-colors"
            :class="isActive(api.category, api.id)
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-muted hover:text-highlighted hover:bg-neutral-100 dark:hover:bg-neutral-800'"
            @click="$emit('navigate')"
          >
            <code class="text-xs">{{ api.name }}</code>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <!-- カテゴリ別リスト -->
    <div v-else>
      <div v-for="category in categories" :key="category.id" class="space-y-0.5">
        <NuxtLink
          :to="`/${category.id}`"
          class="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors"
          :class="route.params.category === category.id
            ? 'text-primary'
            : 'text-muted hover:text-highlighted'"
          @click="$emit('navigate')"
        >
          <UIcon :name="category.icon" class="text-base shrink-0" />
          {{ category.name }}
        </NuxtLink>

        <ul>
          <li v-for="api in getCategoryAPIs(category.id)" :key="api.id">
            <NuxtLink
              :to="`/${category.id}/${api.id}`"
              class="flex items-center px-3 py-1.5 pl-8 text-sm rounded-md mx-1 transition-colors"
              :class="isActive(category.id, api.id)
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted hover:text-highlighted hover:bg-neutral-100 dark:hover:bg-neutral-800'"
              @click="$emit('navigate')"
            >
              <code class="text-xs">{{ api.name }}</code>
            </NuxtLink>
          </li>

          <li v-if="getCategoryAPIs(category.id).length === 0">
            <span class="block px-3 py-1.5 pl-8 text-xs text-muted italic">
              コンテンツ準備中
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
