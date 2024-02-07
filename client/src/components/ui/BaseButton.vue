<script setup>
import AppIcon from './AppIcon.vue';
import BaseSpinner from './BaseSpinner.vue';

defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'ghost', 'danger', 'soft'].includes(value),
  },
  size: { type: String, default: 'md' },
  icon: { type: String, default: '' },
  iconOnly: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
  to: { type: [String, Object], default: null },
});
</script>

<template>
  <component
    :is="to ? 'RouterLink' : 'button'"
    :to="to"
    :type="to ? undefined : type"
    class="btn"
    :class="[`btn-${variant}`, `btn-${size}`, { 'btn-block': block, 'btn-icon': iconOnly, 'is-loading': loading }]"
    :disabled="loading || disabled || undefined"
  >
    <BaseSpinner v-if="loading" :size="16" />
    <AppIcon v-else-if="icon" :name="icon" :size="size === 'sm' ? 16 : 18" />
    <span v-if="$slots.default && !iconOnly"><slot /></span>
  </component>
</template>

<style lang="scss" scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border: 1px solid transparent;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  transition: background 0.15s, border-color 0.15s, color 0.15s, box-shadow 0.15s, transform 0.1s;
  user-select: none;

  &:focus-visible {
    @include focus-ring;
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.btn-sm {
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
  border-radius: 8px;
}

.btn-lg {
  height: 48px;
  padding: 0 22px;
  font-size: 15px;
}

.btn-block {
  width: 100%;
}

.btn-icon {
  width: 40px;
  padding: 0;

  &.btn-sm {
    width: 32px;
  }
}

.btn-primary {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 6px 16px -6px rgba(214, 40, 57, 0.55);

  &:hover:not(:disabled) {
    background: var(--primary-600);
  }
}

.btn-secondary {
  background: var(--surface);
  border-color: var(--border-strong);
  color: var(--text-2);
  box-shadow: var(--shadow-xs);

  &:hover:not(:disabled) {
    background: var(--surface-2);
    color: var(--text);
  }
}

.btn-ghost {
  background: transparent;
  color: var(--muted);

  &:hover:not(:disabled) {
    background: var(--surface-2);
    color: var(--text);
  }
}

.btn-soft {
  background: var(--primary-50);
  color: var(--primary);

  &:hover:not(:disabled) {
    background: var(--primary-100);
  }
}

.btn-danger {
  background: var(--danger);
  color: #fff;

  &:hover:not(:disabled) {
    background: #b91c1c;
  }
}
</style>
