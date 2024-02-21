<script setup>
import { computed, onMounted, ref } from 'vue';
import { gradesApi, studentsApi } from '@/api';
import { useConfirmStore } from '@/stores/confirm';
import { useToastStore } from '@/stores/toast';
import { formatDate, fullName } from '@/utils/format';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseSpinner from '@/components/ui/BaseSpinner.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import UserAvatar from '@/components/ui/UserAvatar.vue';
import SearchBox from '@/components/SearchBox.vue';
import StudentFormModal from './StudentFormModal.vue';

const props = defineProps({
  gradeId: { type: String, required: true },
});

const emit = defineEmits(['changed']);
const toast = useToastStore();
const confirm = useConfirmStore();

const students = ref([]);
const loading = ref(true);
const search = ref('');
const modalOpen = ref(false);
const editing = ref(null);

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) return students.value;
  return students.value.filter((student) => fullName(student).toLowerCase().includes(term));
});

async function load() {
  try {
    students.value = await gradesApi.students(props.gradeId);
  } catch (err) {
    toast.error(err.message);
  } finally {
    loading.value = false;
  }
}

function openModal(student = null) {
  editing.value = student;
  modalOpen.value = true;
}

function onSaved() {
  load();
  emit('changed');
}

async function remove(student) {
  const ok = await confirm.ask({
    title: "O'quvchini o'chirish",
    message: `${fullName(student)} va uning barcha baholari o'chiriladi.`,
  });
  if (!ok) return;

  try {
    await studentsApi.remove(student.id);
    students.value = students.value.filter((item) => item.id !== student.id);
    emit('changed');
    toast.success("O'quvchi o'chirildi");
  } catch (err) {
    toast.error(err.message);
  }
}

onMounted(load);
</script>

<template>
  <section class="card">
    <header class="card-header">
      <SearchBox v-model="search" placeholder="O'quvchini qidirish" />
      <BaseButton icon="plus" @click="openModal()">O'quvchi qo'shish</BaseButton>
    </header>

    <div v-if="loading" class="center"><BaseSpinner :size="28" /></div>

    <EmptyState v-else-if="!filtered.length" icon="student" title="O'quvchilar topilmadi" text="Sinfga birinchi o'quvchini qo'shing.">
      <BaseButton v-if="!search" icon="plus" @click="openModal()">O'quvchi qo'shish</BaseButton>
    </EmptyState>

    <div v-else class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>O'quvchi</th>
            <th>Tug'ilgan sana</th>
            <th>Faollik muddati</th>
            <th>Holat</th>
            <th class="actions"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, index) in filtered" :key="student.id">
            <td class="muted">{{ index + 1 }}</td>
            <td>
              <div class="person">
                <UserAvatar :person="student" :size="34" />
                <div>
                  <strong>{{ student.lastName }} {{ student.firstName }}</strong>
                  <small class="muted">{{ student.fatherName }}</small>
                </div>
              </div>
            </td>
            <td>{{ formatDate(student.birthDate) }}</td>
            <td>{{ formatDate(student.activeDate) }}</td>
            <td>
              <span class="badge" :class="student.isActive ? 'success' : 'danger'">
                {{ student.isActive ? 'Faol' : 'Muddati tugagan' }}
              </span>
            </td>
            <td class="actions">
              <BaseButton variant="ghost" size="sm" icon="edit" icon-only title="Tahrirlash" @click="openModal(student)" />
              <BaseButton variant="ghost" size="sm" icon="trash" icon-only title="O'chirish" @click="remove(student)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <StudentFormModal v-model:open="modalOpen" :grade-id="gradeId" :student="editing" @saved="onSaved" />
  </section>
</template>

<style lang="scss" scoped>
.center {
  display: grid;
  place-items: center;
  padding: 64px;
  color: var(--primary);
}

.person {
  display: flex;
  align-items: center;
  gap: 12px;

  div {
    display: flex;
    flex-direction: column;
  }
}
</style>
