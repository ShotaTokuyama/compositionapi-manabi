<script setup lang="ts">
import type { APIEntry } from '~/data/types'

defineProps<{
  api: APIEntry
}>()
</script>

<template>
  <UCard class="hover:ring-1 hover:ring-primary transition-all">
    <template #header>
      <code class="text-primary font-mono font-semibold text-base">{{ api.name }}</code>
    </template>

    <p class="text-sm text-muted line-clamp-2">{{ api.summary }}</p>

    <template #footer>
      <NuxtLink
        :to="`/${api.category}/${api.id}`"
        class="text-sm text-primary hover:underline flex items-center gap-1"
      >
        詳細を見る
        <UIcon name="i-heroicons-arrow-right" class="text-xs" />
      </NuxtLink>
    </template>
  </UCard>
</template>
