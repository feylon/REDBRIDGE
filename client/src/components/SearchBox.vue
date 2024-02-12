<script setup>
import AppIcon from '@/components/ui/AppIcon.vue';

defineProps({
  placeholder: { type: String, default: 'Qidirish...' },
});

const model = defineModel({ type: String, default: '' });
</script>

<template>
  <label class="search">
    <AppIcon name="search" :size="17" />
    <input v-model="model" type="search" :placeholder="placeholder" />
    <button v-if="model" type="button" aria-label="Tozalash" @click="model = ''">
      <AppIcon name="close" :size="14" />
    </button>
  </label>
</template>

<style lang="scss" scoped>
.search {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 220px;
  max-width: 420px;
  height: 42px;
  padding: 0 12px 0 14px;
  border: 1px solid var(--border-strong);
  border-radius: 10px;
  background: var(--surface);
  color: var(--subtle);
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus-within {
    border-color: var(--primary);
    @include focus-ring;
  }

  input {
    flex: 1;
    min-width: 0;
    height: 100%;
    border: 0;
    outline: none;
    background: transparent;
    color: var(--text);

    &::-webkit-search-cancel-button {
      display: none;
    }
  }

  button {
    display: grid;
    place-items: center;
    padding: 4px;
    border: 0;
    border-radius: 6px;
    background: var(--surface-2);
    color: var(--muted);
  }
}
</style>
