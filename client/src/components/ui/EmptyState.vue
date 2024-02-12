<script setup>
import AppIcon from './AppIcon.vue';

defineProps({
  icon: { type: String, default: 'info' },
  title: { type: String, required: true },
  text: { type: String, default: '' },
});
</script>

<template>
  <div class="empty">
    <div class="empty-icon">
      <AppIcon :name="icon" :size="26" />
    </div>
    <h4>{{ title }}</h4>
    <p v-if="text" class="muted">{{ text }}</p>
    <div v-if="$slots.default" class="empty-actions">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 20px;
  text-align: center;

  h4 {
    font-size: 16px;
  }

  p {
    max-width: 360px;
    margin-top: 6px;
  }
}

.empty-icon {
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  margin-bottom: 16px;
  border-radius: 18px;
  background: var(--primary-50);
  color: var(--primary);
}

.empty-actions {
  margin-top: 20px;
}
</style>
