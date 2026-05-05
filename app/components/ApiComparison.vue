<script setup lang="ts">
import { getAllAPIs } from '~/data/index'
import type { APIComparison } from '~/data/types'

defineProps<{
  comparisons: APIComparison[]
  currentAPIName: string
}>()

// targetAPI は "watch()" のような表記のため、ID（括弧なし）に変換してルックアップ
const apiMap = Object.fromEntries(
  getAllAPIs().map(api => [api.id, api])
)

function resolveLink(targetAPI: string): string | null {
  const id = targetAPI.replace(/\(\)$/, '').trim()
  const entry = apiMap[id]
  return entry ? `/${entry.category}/${entry.id}` : null
}
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="comparison in comparisons"
      :key="comparison.targetAPI"
    >
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-arrows-right-left" class="text-primary" />
            <span class="font-semibold">
              {{ currentAPIName }}
              <span class="text-muted mx-1">vs</span>
              <NuxtLink
                v-if="resolveLink(comparison.targetAPI)"
                :to="resolveLink(comparison.targetAPI)!"
                class="text-primary hover:underline"
              >
                {{ comparison.targetAPI }}
              </NuxtLink>
              <span v-else class="text-muted">{{ comparison.targetAPI }}</span>
            </span>
          </div>
          <p class="text-sm text-muted mt-1">{{ comparison.summary }}</p>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <p class="text-sm font-medium flex items-center gap-1">
              <UIcon name="i-heroicons-check-circle" class="text-success" />
              {{ currentAPIName }} を使うとき
            </p>
            <p class="text-sm text-muted">{{ comparison.useThisWhen }}</p>
          </div>
          <div class="space-y-2">
            <p class="text-sm font-medium flex items-center gap-1">
              <UIcon name="i-heroicons-check-circle" class="text-success" />
              {{ comparison.targetAPI }} を使うとき
            </p>
            <p class="text-sm text-muted">{{ comparison.useOtherWhen }}</p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
