<script setup>
import AppIcon from './AppIcon.vue';

defineProps({
  label: { type: String, required: true },
  value: { type: [Number, String], default: 0 },
  icon: { type: String, required: true },
  tone: { type: String, default: 'primary' },
  hint: { type: String, default: '' },
  to: { type: [String, Object], default: null },
});
</script>

<template>
  <component :is="to ? 'RouterLink' : 'div'" :to="to" class="stat card" :class="`tone-${tone}`">
    <div class="stat-icon">
      <AppIcon :name="icon" :size="22" />
    </div>
    <div class="stat-content">
      <p class="stat-label">{{ label }}</p>
      <p class="stat-value">{{ value }}</p>
      <p v-if="hint" class="stat-hint">{{ hint }}</p>
    </div>
  </component>
</template>

<style lang="scss" scoped>
.stat {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease);

  &[href]:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow);
  }
}

.stat-icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 14px;
  background: var(--tone-bg);
  color: var(--tone-fg);
}

.stat-label {
  color: var(--muted);
  font-size: 13px;
  font-weight: 500;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 800;
  line-height: 1.2;
}

.stat-hint {
  font-size: 12px;
  color: var(--muted);
}

.tone-primary {
  --tone-bg: var(--primary-50);
  --tone-fg: var(--primary);
}

.tone-info {
  --tone-bg: var(--info-50);
  --tone-fg: var(--info);
}

.tone-success {
  --tone-bg: var(--success-50);
  --tone-fg: var(--success);
}

.tone-warning {
  --tone-bg: var(--warning-50);
  --tone-fg: var(--warning);
}
</style>
