<script setup>
import { computed, onMounted, ref } from 'vue';
import { gradesApi, subjectsApi } from '@/api';
import { useForm } from '@/composables/useForm';
import { useTeacherOptions } from '@/composables/useTeacherOptions';
import { useConfirmStore } from '@/stores/confirm';
import { useToastStore } from '@/stores/toast';
import { shortName } from '@/utils/format';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import BaseModal from '@/components/ui/BaseModal.vue';
import BaseSpinner from '@/components/ui/BaseSpinner.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import UserAvatar from '@/components/ui/UserAvatar.vue';
import AppIcon from '@/components/ui/AppIcon.vue';

const props = defineProps({
  gradeId: { type: String, required: true },
});

const emit = defineEmits(['changed']);
const toast = useToastStore();
const confirm = useConfirmStore();
const { teacherOptions, loadTeachers } = useTeacherOptions();

const subjects = ref([]);
const loading = ref(true);
const modalOpen = ref(false);
const editing = ref(null);
const { values, errors, submitting, reset, submit } = useForm({ name: '', teacher: '', hoursPerWeek: 2 });

const texts = {
  create: "Yangi fan",
  edit: 'Fanni tahrirlash',
  subtitle: "Fan nomi, o'qituvchisi va haftalik soatlarini kiriting",
};

const totalHours = computed(() => subjects.value.reduce((sum, subject) => sum + (subject.hoursPerWeek || 0), 0));

async function load() {
  try {
    subjects.value = await gradesApi.subjects(props.gradeId);
  } catch (err) {
    toast.error(err.message);
  } finally {
    loading.value = false;
  }
}

async function openModal(subject = null) {
  editing.value = subject;
  reset(
    subject
      ? { name: subject.name, teacher: subject.teacher?.id || '', hoursPerWeek: subject.hoursPerWeek }
      : undefined,
  );
  modalOpen.value = true;
  try {
    await loadTeachers();
  } catch (err) {
    toast.error(err.message);
  }
}

async function save() {
  try {
    await submit(async (payload) => {
      const body = { ...payload, hoursPerWeek: Number(payload.hoursPerWeek) || 0 };
      if (editing.value) {
        await subjectsApi.update(editing.value.id, body);
        toast.success('Fan yangilandi');
      } else {
        await subjectsApi.create({ ...body, grade: props.gradeId });
        toast.success("Fan qo'shildi");
      }
    });
    modalOpen.value = false;
    load();
    emit('changed');
  } catch (err) {
    toast.error(err.message);
  }
}

async function remove(subject) {
  const ok = await confirm.ask({
    title: `"${subject.name}" fanini o'chirish`,
    message: "Ushbu fan bo'yicha qo'yilgan barcha baholar ham o'chiriladi.",
  });
  if (!ok) return;

  try {
    await subjectsApi.remove(subject.id);
    subjects.value = subjects.value.filter((item) => item.id !== subject.id);
    emit('changed');
    toast.success("Fan o'chirildi");
  } catch (err) {
    toast.error(err.message);
  }
}

onMounted(load);
</script>

<template>
  <section class="card">
    <header class="card-header">
      <div>
        <h3>Fanlar ro'yxati</h3>
        <p class="muted">Haftalik yuklama: {{ totalHours }} soat</p>
      </div>
      <BaseButton icon="plus" @click="openModal()">Fan qo'shish</BaseButton>
    </header>

    <div v-if="loading" class="center"><BaseSpinner :size="28" /></div>

    <EmptyState v-else-if="!subjects.length" icon="book" title="Fanlar qo'shilmagan" text="Sinf uchun o'qitiladigan fanlarni qo'shing.">
      <BaseButton icon="plus" @click="openModal()">Fan qo'shish</BaseButton>
    </EmptyState>

    <ul v-else class="subjects">
      <li v-for="subject in subjects" :key="subject.id" class="subject">
        <div class="subject-icon"><AppIcon name="book" /></div>
        <div class="subject-info">
          <div class="subject-title">
            <strong>{{ subject.name }}</strong>
            <span class="badge">{{ subject.hoursPerWeek }} soat/hafta</span>
          </div>
          <span class="teacher">
            <template v-if="subject.teacher">
              <UserAvatar :person="subject.teacher" :size="22" />
              {{ shortName(subject.teacher) }}
            </template>
            <span v-else class="muted">O'qituvchi biriktirilmagan</span>
          </span>
        </div>
        <div class="tools">
          <BaseButton variant="ghost" size="sm" icon="edit" icon-only title="Tahrirlash" @click="openModal(subject)" />
          <BaseButton variant="ghost" size="sm" icon="trash" icon-only title="O'chirish" @click="remove(subject)" />
        </div>
      </li>
    </ul>

    <BaseModal v-model:open="modalOpen" :title="editing ? texts.edit : texts.create" :subtitle="texts.subtitle">
      <form id="subject-form" class="form-grid" @submit.prevent="save">
        <BaseInput v-model="values.name" class="full" label="Fan nomi" placeholder="Masalan: Matematika" :error="errors.name" required />
        <BaseSelect
          v-model="values.teacher"
          label="O'qituvchi"
          placeholder="Tanlanmagan"
          :options="teacherOptions"
          :error="errors.teacher"
        />
        <BaseInput
          v-model.number="values.hoursPerWeek"
          type="number"
          min="0"
          max="40"
          label="Haftalik soat"
          icon="clock"
          :error="errors.hoursPerWeek"
        />
      </form>
      <template #footer>
        <BaseButton variant="secondary" @click="modalOpen = false">Bekor qilish</BaseButton>
        <BaseButton type="submit" form="subject-form" :loading="submitting">Saqlash</BaseButton>
      </template>
    </BaseModal>
  </section>
</template>

<style lang="scss" scoped>
.center {
  display: grid;
  place-items: center;
  padding: 64px;
  color: var(--primary);
}

.subjects {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 12px;
  margin: 0;
  padding: 20px;
  list-style: none;

  @include down($bp-sm) {
    grid-template-columns: 1fr;
  }
}

.subject {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: border-color 0.15s, box-shadow 0.15s;

  &:hover {
    border-color: var(--primary-100);
    box-shadow: var(--shadow-sm);
  }
}

.subject-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: 12px;
  background: var(--primary-50);
  color: var(--primary);
}

.subject-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    @include truncate;
  }
}

.subject-title {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.teacher {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-2);
}

.tools {
  display: flex;
}
</style>
