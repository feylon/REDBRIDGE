import { computed, ref } from 'vue';
import { teachersApi } from '@/api';
import { shortName } from '@/utils/format';

export function useTeacherOptions() {
  const teachers = ref([]);

  async function loadTeachers() {
    if (teachers.value.length) return;
    teachers.value = await teachersApi.list();
  }

  const teacherOptions = computed(() =>
    teachers.value.map((teacher) => ({ value: teacher.id, label: shortName(teacher) })),
  );

  return { teachers, teacherOptions, loadTeachers };
}
