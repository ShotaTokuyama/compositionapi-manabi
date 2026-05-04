<script setup lang="ts">
import type { APIComparison } from '~/data/types'

defineProps<{
  comparisons: APIComparison[]
  currentAPIName: string
}>()
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
                :to="`./${comparison.targetAPI}`"
                class="text-primary hover:underline"
              >
                {{ comparison.targetAPI }}()
              </NuxtLink>
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
              {{ comparison.targetAPI }}() を使うとき
            </p>
            <p class="text-sm text-muted">{{ comparison.useOtherWhen }}</p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
