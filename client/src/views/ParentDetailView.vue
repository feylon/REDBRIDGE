<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { gradesApi, parentsApi } from '@/api';
import { useConfirmStore } from '@/stores/confirm';
import { useToastStore } from '@/stores/toast';
import { formatDate, fullName, shortName } from '@/utils/format';
import PageHeader from '@/components/ui/PageHeader.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import BaseModal from '@/components/ui/BaseModal.vue';
import BaseSpinner from '@/components/ui/BaseSpinner.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import ScorePill from '@/components/ui/ScorePill.vue';
import UserAvatar from '@/components/ui/UserAvatar.vue';
import AppIcon from '@/components/ui/AppIcon.vue';

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const confirm = useConfirmStore();

const parent = ref(null);
const loading = ref(true);

const modalOpen = ref(false);
const grades = ref([]);
const gradeStudents = ref([]);
const selectedGrade = ref('');
const selectedStudent = ref('');
const adding = ref(false);
const studentsLoading = ref(false);

const texts = {
  subtitle: "Avval sinfni, so'ng o'quvchini tanlang",
  pickStudent: "O'quvchini tanlang",
  loading: 'Yuklanmoqda...',
};

const gradeOptions = computed(() => grades.value.map((grade) => ({ value: grade.id, label: grade.name })));
const studentOptions = computed(() => {
  const linked = new Set((parent.value?.children || []).map((child) => child.id));
  return gradeStudents.value
    .filter((student) => !linked.has(student.id))
    .map((student) => ({ value: student.id, label: fullName(student) }));
});

async function load() {
  try {
    parent.value = await parentsApi.get(route.params.id);
  } catch (err) {
    toast.error(err.message);
    router.replace({ name: 'parents' });
  } finally {
    loading.value = false;
  }
}

async function openModal() {
  selectedGrade.value = '';
  selectedStudent.value = '';
  gradeStudents.value = [];
  modalOpen.value = true;
  if (!grades.value.length) {
    try {
      grades.value = await gradesApi.list();
    } catch (err) {
      toast.error(err.message);
    }
  }
}

watch(selectedGrade, async (gradeId) => {
  selectedStudent.value = '';
  gradeStudents.value = [];
  if (!gradeId) return;
  studentsLoading.value = true;
  try {
    gradeStudents.value = await gradesApi.students(gradeId);
  } catch (err) {
    toast.error(err.message);
  } finally {
    studentsLoading.value = false;
  }
});

async function addChild() {
  if (!selectedStudent.value) return;
  adding.value = true;
  try {
    parent.value = await parentsApi.addChild(parent.value.id, selectedStudent.value);
    toast.success('Farzand biriktirildi');
    modalOpen.value = false;
  } catch (err) {
    toast.error(err.message);
  } finally {
    adding.value = false;
  }
}

async function removeChild(child) {
  const ok = await confirm.ask({
    title: 'Farzandni ajratish',
    message: `${fullName(child)} ushbu ota-ona hisobidan ajratiladi.`,
    confirmText: 'Ajratish',
  });
  if (!ok) return;

  try {
    parent.value = await parentsApi.removeChild(parent.value.id, child.id);
    toast.success('Farzand ajratildi');
  } catch (err) {
    toast.error(err.message);
  }
}

onMounted(load);
</script>

<template>
  <div>
    <div v-if="loading" class="center"><BaseSpinner :size="32" /></div>

    <template v-else-if="parent">
      <PageHeader :title="shortName(parent)" subtitle="Ota-ona profili" :back="{ name: 'parents' }">
        <BaseButton icon="plus" @click="openModal">Farzand biriktirish</BaseButton>
      </PageHeader>

      <div class="layout">
        <aside class="card profile">
          <UserAvatar :person="parent" :size="72" />
          <h3>{{ shortName(parent) }}</h3>
          <p class="muted">@{{ parent.userName }}</p>
          <dl>
            <div>
              <dt><AppIcon name="phone" :size="15" /> Telefon</dt>
              <dd>{{ parent.phone || '—' }}</dd>
            </div>
            <div>
              <dt><AppIcon name="student" :size="15" /> Farzandlar</dt>
              <dd>{{ parent.children.length }} ta</dd>
            </div>
            <div>
              <dt><AppIcon name="calendar" :size="15" /> Ro'yxatdan o'tgan</dt>
              <dd>{{ formatDate(parent.createdAt) }}</dd>
            </div>
          </dl>
        </aside>

        <section class="card">
          <header class="card-header">
            <h3>Farzandlari</h3>
          </header>

          <EmptyState v-if="!parent.children.length" icon="student" title="Farzand biriktirilmagan" text="Ota-ona kuzatishi uchun farzandini biriktiring.">
            <BaseButton icon="plus" @click="openModal">Farzand biriktirish</BaseButton>
          </EmptyState>

          <div v-else class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>O'quvchi</th>
                  <th>Sinf</th>
                  <th>Baholar soni</th>
                  <th>O'rtacha</th>
                  <th>Holat</th>
                  <th class="actions"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="child in parent.children" :key="child.id">
                  <td>
                    <div class="person">
                      <UserAvatar :person="child" :size="34" />
                      <div>
                        <strong>{{ child.lastName }} {{ child.firstName }}</strong>
                        <small class="muted">{{ child.fatherName }}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <RouterLink v-if="child.grade" :to="{ name: 'grade', params: { id: child.grade.id } }" class="badge info">
                      {{ child.grade.name }}
                    </RouterLink>
                  </td>
                  <td>{{ child.scoresCount }}</td>
                  <td><ScorePill :value="child.average" /></td>
                  <td>
                    <span class="badge" :class="child.isActive ? 'success' : 'danger'">
                      {{ child.isActive ? 'Faol' : 'Muddati tugagan' }}
                    </span>
                  </td>
                  <td class="actions">
                    <BaseButton variant="ghost" size="sm" icon="close" icon-only title="Ajratish" @click="removeChild(child)" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </template>

    <BaseModal v-model:open="modalOpen" title="Farzand biriktirish" :subtitle="texts.subtitle">
      <form id="child-form" class="form-grid" @submit.prevent="addChild">
        <BaseSelect v-model="selectedGrade" class="full" label="Sinf" placeholder="Sinfni tanlang" :options="gradeOptions" />
        <BaseSelect
          v-model="selectedStudent"
          class="full"
          label="O'quvchi"
          :placeholder="studentsLoading ? texts.loading : texts.pickStudent"
          :options="studentOptions"
          :disabled="!selectedGrade || studentsLoading"
        />
      </form>
      <template #footer>
        <BaseButton variant="secondary" @click="modalOpen = false">Bekor qilish</BaseButton>
        <BaseButton type="submit" form="child-form" :loading="adding" :disabled="!selectedStudent">Biriktirish</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<style lang="scss" scoped>
.center {
  display: grid;
  place-items: center;
  min-height: 50vh;
  color: var(--primary);
}

.layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 18px;
  align-items: start;

  @include down($bp-lg) {
    grid-template-columns: 1fr;
  }
}

.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 22px;
  text-align: center;
  background:
    linear-gradient(180deg, var(--primary-50) 0, var(--surface) 110px);

  h3 {
    margin-top: 14px;
    font-size: 18px;
  }

  dl {
    width: 100%;
    margin: 22px 0 0;
    display: grid;
    gap: 2px;
    text-align: left;

    div {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 0;
      border-top: 1px solid var(--border);
    }

    dt {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--muted);
    }

    dd {
      margin: 0;
      font-weight: 600;
    }
  }
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
