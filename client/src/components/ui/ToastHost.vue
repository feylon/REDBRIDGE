<script setup>
import { storeToRefs } from 'pinia';
import { useToastStore } from '@/stores/toast';
import AppIcon from './AppIcon.vue';

const store = useToastStore();
const { items } = storeToRefs(store);

const icons = { success: 'check-circle', error: 'alert', info: 'info' };
</script>

<template>
  <Teleport to="body">
    <div class="toasts" aria-live="polite">
      <TransitionGroup name="toast">
        <div v-for="toast in items" :key="toast.id" class="toast" :class="toast.type">
          <AppIcon :name="icons[toast.type]" :size="18" />
          <p>{{ toast.message }}</p>
          <button type="button" aria-label="Yopish" @click="store.dismiss(toast.id)">
            <AppIcon name="close" :size="14" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.toasts {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: min(380px, calc(100vw - 40px));
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 14px 14px 16px;
  background: var(--ink);
  color: #fff;
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);

  p {
    flex: 1;
    font-weight: 500;
  }

  button {
    display: grid;
    place-items: center;
    padding: 4px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: rgba(255, 255, 255, 0.6);

    &:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.1);
    }
  }

  &.success > .icon {
    color: #4ade80;
  }

  &.error > .icon {
    color: #f87171;
  }

  &.info > .icon {
    color: #60a5fa;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s var(--ease);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(24px);
}
</style>
