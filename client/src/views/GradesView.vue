<script setup>
import { computed, ref } from 'vue';
import { gradesApi } from '@/api';
import { useAsync } from '@/composables/useAsync';
import { useForm } from '@/composables/useForm';
import { useTeacherOptions } from '@/composables/useTeacherOptions';
import { useConfirmStore } from '@/stores/confirm';
import { useToastStore } from '@/stores/toast';
import { shortName } from '@/utils/format';
import PageHeader from '@/components/ui/PageHeader.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import BaseModal from '@/components/ui/BaseModal.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue';
import UserAvatar from '@/components/ui/UserAvatar.vue';
import AppIcon from '@/components/ui/AppIcon.vue';
import SearchBox from '@/components/SearchBox.vue';

const toast = useToastStore();
const confirm = useConfirmStore();
const { teacherOptions, loadTeachers } = useTeacherOptions();

const { data: grades, loading, run: load } = useAsync(gradesApi.list, { immediate: true, initial: [] });

const search = ref('');
const filtered = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) return grades.value;
  return grades.value.filter((grade) => grade.name.toLowerCase().includes(term));
});

const totals = computed(() =>
  grades.value.reduce((acc, grade) => acc + grade.studentsCount, 0),
);

const modalOpen = ref(false);
const editing = ref(null);
const { values, errors, submitting, reset, submit } = useForm({ name: '', room: '', curator: '' });

const texts = {
  create: 'Yangi sinf',
  edit: 'Sinfni tahrirlash',
  subtitle: "Sinf nomi va sinf rahbarini kiriting",
};

async function openModal(grade = null) {
  editing.value = grade;
  reset(grade ? { name: grade.name, room: grade.room, curator: grade.curator?.id || '' } : undefined);
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
      if (editing.value) {
        await gradesApi.update(editing.value.id, payload);
        toast.success('Sinf yangilandi');
      } else {
        await gradesApi.create(payload);
        toast.success("Sinf qo'shildi");
      }
    });
    modalOpen.value = false;
    load();
  } catch (err) {
    toast.error(err.message);
  }
}

async function remove(grade) {
  const ok = await confirm.ask({
    title: `${grade.name} sinfini o'chirish`,
    message: "Sinfdagi barcha o'quvchilar, fanlar va baholar ham o'chiriladi. Bu amalni ortga qaytarib bo'lmaydi.",
  });
  if (!ok) return;

  try {
    await gradesApi.remove(grade.id);
    grades.value = grades.value.filter((item) => item.id !== grade.id);
    toast.success("Sinf o'chirildi");
  } catch (err) {
    toast.error(err.message);
  }
}
</script>

<template>
  <div>
    <PageHeader title="Sinflar" :subtitle="`${grades.length} ta sinf · ${totals} nafar o'quvchi`">
      <BaseButton icon="plus" @click="openModal()">Sinf qo'shish</BaseButton>
    </PageHeader>

    <div class="toolbar">
      <SearchBox v-model="search" placeholder="Sinf nomi bo'yicha qidirish" />
    </div>

    <div v-if="loading && !grades.length" class="grid cards">
      <div v-for="index in 6" :key="index" class="card skeleton">
        <SkeletonBlock width="70px" height="28px" />
        <SkeletonBlock width="60%" height="14px" />
        <SkeletonBlock height="40px" />
      </div>
    </div>

    <section v-else-if="!filtered.length" class="card">
      <EmptyState icon="school" title="Sinflar topilmadi" text="Yangi sinf yarating va unga o'quvchilar hamda fanlarni qo'shing.">
        <BaseButton icon="plus" @click="openModal()">Sinf qo'shish</BaseButton>
      </EmptyState>
    </section>

    <TransitionGroup v-else name="list" tag="div" class="grid cards">
      <article v-for="grade in filtered" :key="grade.id" class="card grade">
        <RouterLink :to="{ name: 'grade', params: { id: grade.id } }" class="grade-link">
          <div class="grade-top">
            <span class="grade-name">{{ grade.name }}</span>
            <span v-if="grade.room" class="badge"><AppIcon name="door" :size="13" />{{ grade.room }}-xona</span>
          </div>
          <div class="curator">
            <template v-if="grade.curator">
              <UserAvatar :person="grade.curator" :size="32" />
              <div>
                <small class="muted">Sinf rahbari</small>
                <strong>{{ shortName(grade.curator) }}</strong>
              </div>
            </template>
            <p v-else class="muted no-curator">Sinf rahbari biriktirilmagan</p>
          </div>
          <dl class="metrics">
            <div>
              <dt>O'quvchilar</dt>
              <dd>{{ grade.studentsCount }}</dd>
            </div>
            <div>
              <dt>Fanlar</dt>
              <dd>{{ grade.subjectsCount }}</dd>
            </div>
          </dl>
        </RouterLink>
        <footer>
          <BaseButton :to="{ name: 'grade', params: { id: grade.id, tab: 'journal' } }" variant="soft" size="sm" icon="journal">
            Jurnal
          </BaseButton>
          <div class="tools">
            <BaseButton variant="ghost" size="sm" icon="edit" icon-only title="Tahrirlash" @click="openModal(grade)" />
            <BaseButton variant="ghost" size="sm" icon="trash" icon-only title="O'chirish" @click="remove(grade)" />
          </div>
        </footer>
      </article>
    </TransitionGroup>

    <BaseModal v-model:open="modalOpen" :title="editing ? texts.edit : texts.create" :subtitle="texts.subtitle">
      <form id="grade-form" class="form-grid" @submit.prevent="save">
        <BaseInput v-model="values.name" label="Sinf nomi" placeholder="Masalan: 7-A" :error="errors.name" required />
        <BaseInput v-model="values.room" label="Xona" icon="door" placeholder="204" :error="errors.room" />
        <BaseSelect
          v-model="values.curator"
          class="full"
          label="Sinf rahbari"
          placeholder="Tanlanmagan"
          :options="teacherOptions"
          :error="errors.curator"
        />
      </form>
      <template #footer>
        <BaseButton variant="secondary" @click="modalOpen = false">Bekor qilish</BaseButton>
        <BaseButton type="submit" form="grade-form" :loading="submitting">Saqlash</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<style lang="scss" scoped>
.cards {
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}

.skeleton {
  display: grid;
  gap: 14px;
  padding: 20px;
}

.grade {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease), border-color 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow);
    border-color: var(--primary-100);
  }

  footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-top: 1px solid var(--border);
    background: var(--surface-2);
  }
}

.grade-link {
  display: grid;
  gap: 18px;
  padding: 20px;
}

.grade-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.grade-name {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--ink), var(--primary));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.curator {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 36px;

  div {
    display: flex;
    flex-direction: column;
    line-height: 1.3;
  }
}

.no-curator {
  font-style: italic;
}

.metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 0;

  div {
    padding: 10px 12px;
    border-radius: 10px;
    background: var(--surface-2);
  }

  dt {
    font-size: 12px;
    color: var(--muted);
  }

  dd {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
  }
}

.tools {
  display: flex;
  gap: 4px;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.25s var(--ease);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
