<script setup>
import { computed, ref } from 'vue';
import { useUid } from '@/composables/useUid';
import { withoutClass } from '@/utils/attrs';
import AppIcon from './AppIcon.vue';
import BaseField from './BaseField.vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  label: { type: String, default: '' },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  icon: { type: String, default: '' },
  type: { type: String, default: 'text' },
  multiline: { type: Boolean, default: false },
});

const model = defineModel({ type: [String, Number, null], default: '' });
const id = useUid();
const revealed = ref(false);

const inputType = computed(() => (props.type === 'password' && revealed.value ? 'text' : props.type));
</script>

<template>
  <BaseField :class="$attrs.class" :label="label" :error="error" :hint="hint" :for-id="id">
    <div class="control" :class="{ 'with-icon': icon }">
      <AppIcon v-if="icon" :name="icon" :size="17" />
      <textarea v-if="multiline" :id="id" v-model="model" class="input" v-bind="withoutClass($attrs)"></textarea>
      <input v-else :id="id" v-model="model" class="input" :type="inputType" v-bind="withoutClass($attrs)" />
      <button
        v-if="type === 'password'"
        type="button"
        class="addon reveal"
        :aria-label="revealed ? 'Parolni yashirish' : 'Parolni ko\'rsatish'"
        @click="revealed = !revealed"
      >
        <AppIcon :name="revealed ? 'eye-off' : 'eye'" :size="17" />
      </button>
    </div>
  </BaseField>
</template>

<style lang="scss" scoped>
.reveal {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--subtle);

  &:hover {
    color: var(--text);
    background: var(--surface-2);
  }
}
</style>
