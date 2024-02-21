<script setup>
import { computed, watch } from 'vue';
import { studentsApi } from '@/api';
import { useForm } from '@/composables/useForm';
import { useToastStore } from '@/stores/toast';
import { fullName, toInputDate } from '@/utils/format';
import BaseModal from '@/components/ui/BaseModal.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseInput from '@/components/ui/BaseInput.vue';

const props = defineProps({
  gradeId: { type: String, required: true },
  student: { type: Object, default: null },
});

const emit = defineEmits(['saved']);
const open = defineModel('open', { type: Boolean, default: false });
const toast = useToastStore();

const { values, errors, submitting, reset, submit } = useForm({
  lastName: '',
  firstName: '',
  fatherName: '',
  birthDate: '',
  activeDate: '',
});

const texts = {
  create: "Yangi o'quvchi",
  edit: "O'quvchini tahrirlash",
  createSubtitle: "O'quvchi ushbu sinfga qo'shiladi",
  activeHint: "Shu sanagacha o'quvchi faol hisoblanadi",
};

const title = computed(() => (props.student ? texts.edit : texts.create));
const subtitle = computed(() => (props.student ? fullName(props.student) : texts.createSubtitle));

watch(open, (value) => {
  if (!value) return;
  const student = props.student;
  reset(
    student
      ? {
          lastName: student.lastName,
          firstName: student.firstName,
          fatherName: student.fatherName,
          birthDate: toInputDate(student.birthDate),
          activeDate: toInputDate(student.activeDate),
        }
      : undefined,
  );
});

async function save() {
  try {
    await submit(async (payload) => {
      if (props.student) {
        await studentsApi.update(props.student.id, payload);
        toast.success("O'quvchi maʼlumotlari yangilandi");
      } else {
        await studentsApi.create({ ...payload, grade: props.gradeId });
        toast.success("O'quvchi qo'shildi");
      }
    });
    open.value = false;
    emit('saved');
  } catch (err) {
    toast.error(err.message);
  }
}
</script>

<template>
  <BaseModal v-model:open="open" :title="title" :subtitle="subtitle" width="600px">
    <form id="student-form" class="form-grid" @submit.prevent="save">
      <BaseInput v-model="values.lastName" label="Familiya" :error="errors.lastName" required />
      <BaseInput v-model="values.firstName" label="Ism" :error="errors.firstName" required />
      <BaseInput v-model="values.fatherName" class="full" label="Otasining ismi" :error="errors.fatherName" />
      <BaseInput v-model="values.birthDate" type="date" label="Tug'ilgan sana" icon="calendar" :error="errors.birthDate" />
      <BaseInput
        v-model="values.activeDate"
        type="date"
        label="Faollik muddati"
        icon="clock"
        :hint="texts.activeHint"
        :error="errors.activeDate"
      />
    </form>
    <template #footer>
      <BaseButton variant="secondary" @click="open = false">Bekor qilish</BaseButton>
      <BaseButton type="submit" form="student-form" :loading="submitting">Saqlash</BaseButton>
    </template>
  </BaseModal>
</template>
