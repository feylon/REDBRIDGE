<script setup>
import { computed } from 'vue';
import { initials } from '@/utils/format';

const props = defineProps({
  person: { type: Object, default: null },
  size: { type: Number, default: 38 },
});

const palette = ['#d62839', '#2563eb', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#db2777'];

const color = computed(() => {
  const seed = props.person?.id || props.person?.userName || '';
  const sum = [...seed].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return palette[sum % palette.length];
});
</script>

<template>
  <span
    class="avatar"
    :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${size * 0.36}px`, '--tone': color }"
  >
    {{ initials(person) }}
  </span>
</template>

<style scoped>
.avatar {
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 50%;
  font-weight: 700;
  color: var(--tone);
  background: color-mix(in srgb, var(--tone) 12%, white);
  border: 1px solid color-mix(in srgb, var(--tone) 18%, white);
}
</style>
