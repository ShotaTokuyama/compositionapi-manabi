<script setup lang="ts">
const props = defineProps<{
  code: string
  lang?: 'vue' | 'typescript'
}>()

const colorMode = useColorMode()
const highlighted = ref<string | null>(null)

async function highlight() {
  const { codeToHtml } = await import('shiki')
  highlighted.value = await codeToHtml(props.code, {
    lang: props.lang ?? 'vue',
    theme: colorMode.value === 'dark' ? 'github-dark' : 'github-light'
  })
}

onMounted(highlight)
watch(() => colorMode.value, highlight)
</script>

<template>
  <div class="rounded-lg overflow-hidden text-sm">
    <!-- v-html: Shiki が生成したシンタックスハイライト済みHTML。入力は静的データのみでShikiがエスケープ済み -->
    <div v-if="highlighted" class="overflow-x-auto" v-html="highlighted" />
    <pre v-else class="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto"><code>{{ code }}</code></pre>
  </div>
</template>

<style scoped>
:deep(pre) {
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 0;
}
</style>
