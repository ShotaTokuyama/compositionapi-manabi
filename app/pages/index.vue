<script setup lang="ts">
import { getAllCategories, getCategoryAPIs } from '~/data/index'

const categories = getAllCategories()
</script>

<template>
  <div>
    <UPageHero
      title="Vue Composition API ガイド"
      description="「何をするか」ではなく「いつ使うか・使わないか」の判断基準を学ぶ実践リファレンス。ref と reactive の使い分けから、composable の設計パターンまで。"
    />

    <UPageSection>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="`/${category.id}`"
          class="group"
        >
          <UCard class="h-full hover:ring-1 hover:ring-primary transition-all">
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon :name="category.icon" class="text-2xl text-primary" />
                <span class="font-semibold">{{ category.name }}</span>
                <UBadge
                  :label="`${getCategoryAPIs(category.id).length} API`"
                  variant="soft"
                  size="sm"
                  class="ml-auto"
                />
              </div>
            </template>
            <p class="text-sm text-muted">{{ category.description }}</p>
          </UCard>
        </NuxtLink>
      </div>
    </UPageSection>
  </div>
</template>
