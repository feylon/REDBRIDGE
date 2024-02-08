<script setup>
defineProps({
  label: { type: String, default: '' },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  forId: { type: String, default: '' },
});
</script>

<template>
  <div class="field" :class="{ 'has-error': error }">
    <label v-if="label" :for="forId" class="field-label">{{ label }}</label>
    <slot />
    <p v-if="error" class="field-error">{{ error }}</p>
    <p v-else-if="hint" class="field-hint">{{ hint }}</p>
  </div>
</template>

<style lang="scss">
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-2);
}

.field-error {
  font-size: 12px;
  color: var(--danger);
}

.field-hint {
  font-size: 12px;
  color: var(--muted);
}

.control {
  position: relative;
  display: flex;
  align-items: center;

  > .icon {
    position: absolute;
    left: 13px;
    color: var(--subtle);
    pointer-events: none;
  }

  .input {
    width: 100%;
    height: 42px;
    padding: 0 14px;
    background: var(--surface);
    border: 1px solid var(--border-strong);
    border-radius: 10px;
    transition: border-color 0.15s, box-shadow 0.15s;
    appearance: none;

    &::placeholder {
      color: var(--subtle);
    }

    &:hover {
      border-color: #c3cad6;
    }

    &:focus {
      border-color: var(--primary);
      @include focus-ring;
    }
  }

  textarea.input {
    height: auto;
    min-height: 88px;
    padding: 10px 14px;
    resize: vertical;
  }

  select.input {
    padding-right: 36px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    cursor: pointer;
  }

  &.with-icon .input {
    padding-left: 40px;
  }

  .addon {
    position: absolute;
    right: 6px;
  }
}

.has-error .input {
  border-color: var(--danger);
}
</style>
