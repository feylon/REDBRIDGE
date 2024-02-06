import { reactive, ref } from 'vue';

export function useForm(initial) {
  const values = reactive({ ...initial });
  const errors = ref({});
  const submitting = ref(false);

  function reset(next = initial) {
    Object.keys(values).forEach((key) => delete values[key]);
    Object.assign(values, { ...initial, ...next });
    errors.value = {};
  }

  async function submit(handler) {
    submitting.value = true;
    errors.value = {};
    try {
      return await handler({ ...values });
    } catch (err) {
      errors.value = Object.fromEntries((err.details || []).map((item) => [item.field, item.message]));
      throw err;
    } finally {
      submitting.value = false;
    }
  }

  return { values, errors, submitting, reset, submit };
}
