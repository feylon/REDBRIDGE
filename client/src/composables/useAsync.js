import { ref } from 'vue';
import { useToastStore } from '@/stores/toast';

export function useAsync(fn, { immediate = false, initial = null } = {}) {
  const data = ref(initial);
  const loading = ref(false);
  const error = ref(null);
  const toast = useToastStore();

  async function run(...args) {
    loading.value = true;
    error.value = null;
    try {
      data.value = await fn(...args);
      return data.value;
    } catch (err) {
      error.value = err;
      toast.error(err.message);
      return null;
    } finally {
      loading.value = false;
    }
  }

  if (immediate) run();

  return { data, loading, error, run };
}
