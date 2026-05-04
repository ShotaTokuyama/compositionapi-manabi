<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'ja'
  }
})

useSeoMeta({
  title: 'Vue Composition API ガイド',
  description: 'Vue Composition APIの「いつ使うか・使わないか」を学ぶ実践リファレンス'
})
</script>

<template>
  <UApp>
    <UHeader toggle-side="left">
      <template #left>
        <NuxtLink
          to="/"
          class="font-bold text-base text-highlighted hover:text-primary transition-colors"
        >
          Vue Composition API ガイド
        </NuxtLink>
      </template>

      <template #right>
        <UColorModeButton />
      </template>

      <!-- モバイル時のサイドバー — UHeader 組み込みのトグルで開閉 -->
      <template #content="{ close }">
        <div class="p-4">
          <AppSidebar @navigate="close" />
        </div>
      </template>
    </UHeader>

    <UMain>
      <div class="flex">
        <aside class="hidden md:block w-64 shrink-0 border-r border-default sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <AppSidebar />
        </aside>
        <div class="flex-1 min-w-0">
          <NuxtPage />
        </div>
      </div>
    </UMain>
  </UApp>
</template>
