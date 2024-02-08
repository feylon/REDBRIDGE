<script setup>
import { useUid } from '@/composables/useUid';
import { withoutClass } from '@/utils/attrs';
import BaseField from './BaseField.vue';

defineOptions({ inheritAttrs: false });

defineProps({
  label: { type: String, default: '' },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '' },
});

const model = defineModel({ type: [String, Number, null], default: '' });
const id = useUid();
</script>

<template>
  <BaseField :class="$attrs.class" :label="label" :error="error" :hint="hint" :for-id="id">
    <div class="control">
      <select :id="id" v-model="model" class="input" v-bind="withoutClass($attrs)">
        <option v-if="placeholder" value="">{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
  </BaseField>
</template>
