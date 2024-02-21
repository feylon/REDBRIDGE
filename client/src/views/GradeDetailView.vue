<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { gradesApi } from '@/api';
import { useToastStore } from '@/stores/toast';
import { shortName } from '@/utils/format';
import PageHeader from '@/components/ui/PageHeader.vue';
import AppIcon from '@/components/ui/AppIcon.vue';
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue';
import JournalTab from '@/components/grade/JournalTab.vue';
import StudentsTab from '@/components/grade/StudentsTab.vue';
import SubjectsTab from '@/components/grade/SubjectsTab.vue';

const route = useRoute();
const router = useRouter();
const toast = useToastStore();

const grade = ref(null);
const gradeId = computed(() => route.params.id);
const activeTab = computed(() => route.params.tab || 'journal');

const tabs = computed(() => [
  { key: 'journal', label: 'Jurnal', icon: 'journal' },
  { key: 'students', label: "O'quvchilar", icon: 'student', count: grade.value?.studentsCount },
  { key: 'subjects', label: 'Fanlar', icon: 'book', count: grade.value?.subjectsCount },
]);

const components = { journal: JournalTab, students: StudentsTab, subjects: SubjectsTab };

const subtitle = computed(() => {
  if (!grade.value) return '';
  const curator = grade.value.curator ? `Sinf rahbari: ${shortName(grade.value.curator)}` : 'Sinf rahbari biriktirilmagan';
  return grade.value.room ? `${curator} · ${grade.value.room}-xona` : curator;
});

async function loadGrade() {
  try {
    grade.value = await gradesApi.get(gradeId.value);
  } catch (err) {
    toast.error(err.message);
    if (err.status === 404 || err.status === 400) router.replace({ name: 'grades' });
  }
}

onMounted(loadGrade);
</script>

<template>
  <div>
    <PageHeader v-if="grade" :title="`${grade.name} sinfi`" :subtitle="subtitle" :back="{ name: 'grades' }" />
    <div v-else class="header-skeleton">
      <SkeletonBlock width="40px" height="40px" radius="12px" />
      <div>
        <SkeletonBlock width="160px" height="24px" />
        <SkeletonBlock width="240px" height="14px" style="margin-top: 8px" />
      </div>
    </div>

    <nav class="tabs" role="tablist">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.key"
        :to="{ name: 'grade', params: { id: gradeId, tab: tab.key } }"
        class="tab"
        :class="{ active: activeTab === tab.key }"
        role="tab"
        replace
      >
        <AppIcon :name="tab.icon" :size="17" />
        {{ tab.label }}
        <span v-if="tab.count != null" class="count">{{ tab.count }}</span>
      </RouterLink>
    </nav>

    <component :is="components[activeTab]" :grade-id="gradeId" @changed="loadGrade" />
  </div>
</template>

<style lang="scss" scoped>
.header-skeleton {
  display: flex;
  gap: 14px;
  margin-bottom: 24px;
}

.tabs {
  display: inline-flex;
  gap: 4px;
  margin-bottom: 20px;
  padding: 4px;
  border-radius: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-xs);
  max-width: 100%;
  overflow-x: auto;
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 9px;
  color: var(--muted);
  font-weight: 600;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;

  &:hover {
    color: var(--text);
  }

  &.active {
    background: var(--ink);
    color: #fff;

    .count {
      background: rgba(255, 255, 255, 0.16);
      color: #fff;
    }
  }
}

.count {
  padding: 0 7px;
  border-radius: 999px;
  background: var(--surface-2);
  font-size: 12px;
}
</style>
