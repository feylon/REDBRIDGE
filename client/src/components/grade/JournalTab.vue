<script setup>
import { computed, onMounted, ref } from 'vue';
import { gradesApi } from '@/api';
import { useToastStore } from '@/stores/toast';
import BaseSpinner from '@/components/ui/BaseSpinner.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import ScorePill from '@/components/ui/ScorePill.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import SearchBox from '@/components/SearchBox.vue';
import ScoreModal from './ScoreModal.vue';

const props = defineProps({
  gradeId: { type: String, required: true },
});

const toast = useToastStore();
const journal = ref(null);
const loading = ref(true);
const search = ref('');

const modalOpen = ref(false);
const selected = ref({ student: null, subject: null });

const scoreMap = computed(() => {
  const map = new Map();
  (journal.value?.scores || []).forEach((item) => map.set(`${item.studentId}:${item.subjectId}`, item));
  return map;
});

const students = computed(() => {
  const term = search.value.trim().toLowerCase();
  const list = journal.value?.students || [];
  if (!term) return list;
  return list.filter((student) => `${student.lastName} ${student.firstName}`.toLowerCase().includes(term));
});

const subjects = computed(() => journal.value?.subjects || []);

function cell(studentId, subjectId) {
  return scoreMap.value.get(`${studentId}:${subjectId}`);
}

function averageOf(items) {
  const valid = items.filter(Boolean);
  if (!valid.length) return null;
  const total = valid.reduce((sum, item) => sum + item.total, 0);
  const count = valid.reduce((sum, item) => sum + item.count, 0);
  return total / count;
}

function studentAverage(student) {
  return averageOf(subjects.value.map((subject) => cell(student.id, subject.id)));
}

function subjectAverage(subject) {
  return averageOf((journal.value?.students || []).map((student) => cell(student.id, subject.id)));
}

async function load() {
  try {
    journal.value = await gradesApi.journal(props.gradeId);
  } catch (err) {
    toast.error(err.message);
  } finally {
    loading.value = false;
  }
}

function openCell(student, subject) {
  selected.value = { student, subject };
  modalOpen.value = true;
}

onMounted(load);
</script>

<template>
  <section class="card">
    <header class="card-header">
      <SearchBox v-model="search" placeholder="O'quvchini qidirish" />
      <div class="legend">
        <span><i class="fill-excellent"></i>5</span>
        <span><i class="fill-good"></i>4</span>
        <span><i class="fill-average"></i>3</span>
        <span><i class="fill-poor"></i>2</span>
      </div>
    </header>

    <div v-if="loading" class="center"><BaseSpinner :size="28" /></div>

    <EmptyState
      v-else-if="!subjects.length || !journal?.students.length"
      icon="journal"
      title="Jurnal hali tayyor emas"
      text="Jurnalni yuritish uchun sinfga kamida bitta fan va o'quvchi qo'shing."
    >
      <div class="empty-actions">
        <BaseButton :to="{ name: 'grade', params: { id: gradeId, tab: 'subjects' } }" variant="secondary" icon="book">
          Fan qo'shish
        </BaseButton>
        <BaseButton :to="{ name: 'grade', params: { id: gradeId, tab: 'students' } }" icon="student">
          O'quvchi qo'shish
        </BaseButton>
      </div>
    </EmptyState>

    <div v-else class="table-wrap journal">
      <table class="table">
        <thead>
          <tr>
            <th class="sticky">#</th>
            <th class="sticky name">O'quvchi</th>
            <th v-for="subject in subjects" :key="subject.id" class="subject">{{ subject.name }}</th>
            <th class="subject">O'rtacha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, index) in students" :key="student.id">
            <td class="sticky muted">{{ index + 1 }}</td>
            <td class="sticky name">
              <strong>{{ student.lastName }} {{ student.firstName }}</strong>
            </td>
            <td v-for="subject in subjects" :key="subject.id" class="cell">
              <button type="button" class="cell-btn" @click="openCell(student, subject)">
                <ScorePill :value="cell(student.id, subject.id)?.average ?? null" />
                <small v-if="cell(student.id, subject.id)" class="muted">{{ cell(student.id, subject.id).count }} ta</small>
              </button>
            </td>
            <td class="cell"><ScorePill :value="studentAverage(student)" /></td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td class="sticky"></td>
            <td class="sticky name"><strong>Fan bo'yicha o'rtacha</strong></td>
            <td v-for="subject in subjects" :key="subject.id" class="cell">
              <ScorePill :value="subjectAverage(subject)" />
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <ScoreModal v-model:open="modalOpen" :student="selected.student" :subject="selected.subject" @changed="load" />
  </section>
</template>

<style lang="scss" scoped>
.center {
  display: grid;
  place-items: center;
  padding: 64px;
  color: var(--primary);
}

.legend {
  display: flex;
  gap: 14px;
  color: var(--muted);
  font-size: 13px;
  font-weight: 600;

  span {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  i {
    width: 10px;
    height: 10px;
    border-radius: 3px;
  }

  @include down($bp-sm) {
    display: none;
  }
}

.fill-excellent {
  background: var(--success);
}

.fill-good {
  background: var(--info);
}

.fill-average {
  background: #f59e0b;
}

.fill-poor {
  background: var(--danger);
}

.empty-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.journal {
  max-height: calc(100vh - 300px);

  .table {
    th.subject {
      text-align: center;
      min-width: 110px;
    }

    td {
      padding: 8px 12px;
    }
  }

  .sticky {
    position: sticky;
    left: 0;
    z-index: 1;
    background: var(--surface);
  }

  th.sticky {
    z-index: 3;
    background: var(--surface-2);
  }

  .name {
    left: 48px;
    min-width: 200px;
    box-shadow: 1px 0 0 var(--border);
  }

  .sticky:first-child {
    width: 48px;
    min-width: 48px;
  }

  tbody tr:hover .sticky {
    background: var(--surface-2);
  }

  tfoot td {
    position: sticky;
    bottom: 0;
    padding: 12px;
    background: var(--surface-2);
    border-top: 1px solid var(--border);
  }

  tfoot .sticky {
    z-index: 2;
    background: var(--surface-2);
  }
}

.cell {
  text-align: center;

  :deep(.score) {
    margin: 0 auto;
  }
}

.cell-btn {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 10px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  transition: border-color 0.15s, background 0.15s;

  small {
    font-size: 11px;
  }

  &:hover {
    border-color: var(--primary-100);
    background: var(--primary-50);
  }
}
</style>
