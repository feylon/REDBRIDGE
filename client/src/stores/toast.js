import { defineStore } from 'pinia';
import { ref } from 'vue';

let nextId = 1;

export const useToastStore = defineStore('toast', () => {
  const items = ref([]);

  function dismiss(id) {
    items.value = items.value.filter((item) => item.id !== id);
  }

  function push(type, message, timeout = 3500) {
    const id = nextId++;
    items.value.push({ id, type, message });
    setTimeout(() => dismiss(id), timeout);
  }

  return {
    items,
    dismiss,
    success: (message) => push('success', message),
    error: (message) => push('error', message, 5000),
    info: (message) => push('info', message),
  };
});
