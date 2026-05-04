<script setup lang="ts">
const props = defineProps<{
  code: string
}>()

const url = usePlaygroundUrl(props.code)
</script>

<template>
  <UButton
    :to="url"
    target="_blank"
    icon="i-heroicons-arrow-top-right-on-square"
    color="primary"
    variant="soft"
  >
    Vue SFC Playground で開く
  </UButton>
</template>
