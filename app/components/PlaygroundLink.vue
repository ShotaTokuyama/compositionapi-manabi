<script setup lang="ts">
import { generatePlaygroundURL } from '~/utils/playground'

const props = defineProps<{
  code: string
}>()

const url = generatePlaygroundURL(props.code)
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
