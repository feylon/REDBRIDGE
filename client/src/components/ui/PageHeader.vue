<script setup>
import AppIcon from './AppIcon.vue';

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  back: { type: [String, Object], default: null },
});
</script>

<template>
  <div class="page-header">
    <div class="page-heading">
      <RouterLink v-if="back" :to="back" class="back" aria-label="Orqaga">
        <AppIcon name="arrow-left" />
      </RouterLink>
      <div>
        <h1>{{ title }}</h1>
        <p v-if="subtitle" class="muted">{{ subtitle }}</p>
      </div>
    </div>
    <div v-if="$slots.default" class="page-actions">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;

  h1 {
    font-size: 26px;
    font-weight: 800;

    @include down($bp-sm) {
      font-size: 22px;
    }
  }

  p {
    margin-top: 4px;
  }
}

.page-heading {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.back {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border: 1px solid var(--border-strong);
  border-radius: 12px;
  background: var(--surface);
  color: var(--text-2);
  transition: background 0.15s;

  &:hover {
    background: var(--surface-2);
  }
}

.page-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
