import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useConfirmStore = defineStore('confirm', () => {
  const state = ref(null);

  function ask(options) {
    return new Promise((resolve) => {
      state.value = {
        title: "Ishonchingiz komilmi?",
        confirmText: "O'chirish",
        cancelText: 'Bekor qilish',
        tone: 'danger',
        ...options,
        resolve,
      };
    });
  }

  function close(result) {
    state.value?.resolve(result);
    state.value = null;
  }

  return { state, ask, close };
});
