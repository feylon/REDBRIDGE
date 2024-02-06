import { ref, watch } from 'vue';

export function useDebounced(source, delay = 300) {
  const debounced = ref(source.value);
  let timer;

  watch(source, (value) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      debounced.value = value;
    }, delay);
  });

  return debounced;
}
