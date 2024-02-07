<script setup>
import { computed } from 'vue';
import icons from './icons';

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 18 },
  stroke: { type: [Number, String], default: 2 },
});

const path = computed(() => icons[props.name] || '');
</script>

<template>
  <svg
    class="icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="stroke"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    v-html="path"
  ></svg>
</template>

<style scoped>
.icon {
  flex-shrink: 0;
}
</style>
