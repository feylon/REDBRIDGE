<script setup>
import { onBeforeUnmount, watch } from 'vue';
import AppIcon from './AppIcon.vue';

defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  width: { type: String, default: '520px' },
});

const open = defineModel('open', { type: Boolean, default: false });

function close() {
  open.value = false;
}

function onKeydown(event) {
  if (event.key === 'Escape') close();
}

watch(
  open,
  (value) => {
    document.body.style.overflow = value ? 'hidden' : '';
    if (value) window.addEventListener('keydown', onKeydown);
    else window.removeEventListener('keydown', onKeydown);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  document.body.style.overflow = '';
  window.removeEventListener('keydown', onKeydown);
});

defineExpose({ close });
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-backdrop" @mousedown.self="close">
        <div class="modal" role="dialog" aria-modal="true" :style="{ maxWidth: width }">
          <header class="modal-header">
            <div>
              <h3>{{ title }}</h3>
              <p v-if="subtitle" class="muted">{{ subtitle }}</p>
            </div>
            <button type="button" class="modal-close" aria-label="Yopish" @click="close">
              <AppIcon name="close" />
            </button>
          </header>
          <div class="modal-body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
}

.modal {
  width: 100%;
  max-height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 22px 0;

  h3 {
    font-size: 18px;
  }

  p {
    margin-top: 4px;
    font-size: 13px;
  }
}

.modal-close {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  margin: -4px -6px 0 0;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--muted);

  &:hover {
    background: var(--surface-2);
    color: var(--text);
  }
}

.modal-body {
  padding: 20px 22px;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 22px;
  background: var(--surface-2);
  border-top: 1px solid var(--border);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s var(--ease);

  .modal {
    transition: transform 0.25s var(--ease);
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal {
    transform: translateY(12px) scale(0.98);
  }
}
</style>
