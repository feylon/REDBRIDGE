<script setup>
import { computed, ref, watch } from 'vue';
import { gradesApi, studentsApi } from '@/api';
import { useAsync } from '@/composables/useAsync';
import { useDebounced } from '@/composables/useDebounced';
import { formatDate } from '@/utils/format';
import PageHeader from '@/components/ui/PageHeader.vue';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue';
import UserAvatar from '@/components/ui/UserAvatar.vue';
import AppIcon from '@/components/ui/AppIcon.vue';
import SearchBox from '@/components/SearchBox.vue';

const search = ref('');
const grade = ref('');
const query = useDebounced(search);

const { data: grades } = useAsync(gradesApi.list, { immediate: true, initial: [] });
const { data: students, loading, run: load } = useAsync(
  () => studentsApi.list({ search: query.value || undefined, grade: grade.value || undefined }),
  { immediate: true, initial: [] },
);

watch([query, grade], () => load());

const gradeOptions = computed(() => grades.value.map((item) => ({ value: item.id, label: item.name })));
const activeCount = computed(() => students.value.filter((student) => student.isActive).length);
</script>

<template>
  <div>
    <PageHeader title="O'quvchilar" :subtitle="`${students.length} nafar topildi · ${activeCount} tasi faol`" />

    <div class="toolbar">
      <SearchBox v-model="search" placeholder="Ism yoki familiya bo'yicha qidirish" />
      <BaseSelect v-model="grade" class="grade-filter" placeholder="Barcha sinflar" :options="gradeOptions" aria-label="Sinf" />
    </div>

    <section class="card">
      <div v-if="loading && !students.length" class="card-body skeletons">
        <SkeletonBlock v-for="index in 6" :key="index" height="44px" />
      </div>

      <EmptyState
        v-else-if="!students.length"
        icon="student"
        title="O'quvchilar topilmadi"
        text="O'quvchilar sinf sahifasi orqali qo'shiladi."
      />

      <div v-else class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>O'quvchi</th>
              <th>Sinf</th>
              <th>Tug'ilgan sana</th>
              <th>Faollik muddati</th>
              <th>Holat</th>
              <th class="actions"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id">
              <td>
                <div class="person">
                  <UserAvatar :person="student" :size="34" />
                  <div>
                    <strong>{{ student.lastName }} {{ student.firstName }}</strong>
                    <small class="muted">{{ student.fatherName }}</small>
                  </div>
                </div>
              </td>
              <td><span class="badge">{{ student.grade?.name || '—' }}</span></td>
              <td>{{ formatDate(student.birthDate) }}</td>
              <td>{{ formatDate(student.activeDate) }}</td>
              <td>
                <span class="badge" :class="student.isActive ? 'success' : 'danger'">
                  {{ student.isActive ? 'Faol' : 'Muddati tugagan' }}
                </span>
              </td>
              <td class="actions">
                <RouterLink
                  v-if="student.grade"
                  :to="{ name: 'grade', params: { id: student.grade.id, tab: 'students' } }"
                  class="open"
                >
                  Sinfga o'tish <AppIcon name="chevron-right" :size="16" />
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.grade-filter {
  width: 200px;
}

.skeletons {
  display: grid;
  gap: 12px;
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

.open {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--primary);
  font-weight: 600;
  font-size: 13px;
}
</style>
