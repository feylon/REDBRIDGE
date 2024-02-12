<script setup>
import { computed } from 'vue';
import { scoreTone } from '@/utils/format';

const props = defineProps({
  value: { type: Number, default: null },
  label: { type: [String, Number], default: null },
});

const tone = computed(() => scoreTone(props.value));
</script>

<template>
  <span class="score" :class="`is-${tone}`">{{ label ?? (value == null ? '—' : value.toFixed(1)) }}</span>
</template>

<style lang="scss" scoped>
.score {
  display: inline-grid;
  place-items: center;
  min-width: 40px;
  height: 28px;
  padding: 0 8px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}

.is-excellent {
  background: var(--success-50);
  color: var(--success);
}

.is-good {
  background: var(--info-50);
  color: var(--info);
}

.is-average {
  background: var(--warning-50);
  color: var(--warning);
}

.is-poor {
  background: var(--danger-50);
  color: var(--danger);
}

.is-empty {
  background: var(--surface-2);
  color: var(--subtle);
}
</style>
