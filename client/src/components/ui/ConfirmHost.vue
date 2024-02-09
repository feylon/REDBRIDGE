<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useConfirmStore } from '@/stores/confirm';
import AppIcon from './AppIcon.vue';
import BaseButton from './BaseButton.vue';

const store = useConfirmStore();
const { state } = storeToRefs(store);

const open = computed({
  get: () => Boolean(state.value),
  set: (value) => {
    if (!value) store.close(false);
  },
});

function confirm() {
  store.close(true);
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="confirm-backdrop" @mousedown.self="open = false">
        <div class="confirm" role="alertdialog" aria-modal="true">
          <div class="confirm-icon" :class="state.tone">
            <AppIcon :name="state.tone === 'danger' ? 'trash' : 'info'" :size="22" />
          </div>
          <h3>{{ state.title }}</h3>
          <p v-if="state.message" class="muted">{{ state.message }}</p>
          <div class="confirm-actions">
            <BaseButton variant="secondary" block @click="open = false">{{ state.cancelText }}</BaseButton>
            <BaseButton :variant="state.tone === 'danger' ? 'danger' : 'primary'" block @click="confirm">
              {{ state.confirmText }}
            </BaseButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.confirm-backdrop {
  position: fixed;
  inset: 0;
  z-index: 120;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
}

.confirm {
  width: 100%;
  max-width: 400px;
  padding: 28px 24px 24px;
  text-align: center;
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);

  h3 {
    font-size: 18px;
  }

  p {
    margin-top: 8px;
  }
}

.confirm-icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: var(--info-50);
  color: var(--info);

  &.danger {
    background: var(--danger-50);
    color: var(--danger);
  }
}

.confirm-actions {
  display: flex;
  gap: 10px;
  margin-top: 24px;
}
</style>
