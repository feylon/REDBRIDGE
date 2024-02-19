<script setup>
import { computed, ref, watch } from 'vue';
import { teachersApi } from '@/api';
import { useAsync } from '@/composables/useAsync';
import { useDebounced } from '@/composables/useDebounced';
import { useForm } from '@/composables/useForm';
import { useConfirmStore } from '@/stores/confirm';
import { useToastStore } from '@/stores/toast';
import { fullName } from '@/utils/format';
import PageHeader from '@/components/ui/PageHeader.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseModal from '@/components/ui/BaseModal.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue';
import UserAvatar from '@/components/ui/UserAvatar.vue';
import AppIcon from '@/components/ui/AppIcon.vue';
import SearchBox from '@/components/SearchBox.vue';

const toast = useToastStore();
const confirm = useConfirmStore();

const search = ref('');
const query = useDebounced(search);
const { data: teachers, loading, run: load } = useAsync(() => teachersApi.list({ search: query.value }), {
  immediate: true,
  initial: [],
});
watch(query, () => load());

const modalOpen = ref(false);
const editing = ref(null);
const { values, errors, submitting, reset, submit } = useForm({
  firstName: '',
  lastName: '',
  fatherName: '',
  phone: '',
  userName: '',
  password: '',
});
const isEdit = computed(() => Boolean(editing.value));

const emptyTitle = computed(() => (search.value ? 'Hech narsa topilmadi' : "Hali o'qituvchilar yo'q"));
const emptyText = computed(() =>
  search.value ? "Qidiruv so'zini o'zgartirib ko'ring" : "Birinchi o'qituvchini qo'shing va unga fanlarni biriktiring.",
);

function openCreate() {
  editing.value = null;
  reset();
  modalOpen.value = true;
}

function openEdit(teacher) {
  editing.value = teacher;
  reset({ ...teacher, password: '' });
  modalOpen.value = true;
}

const modalText = {
  createTitle: "Yangi o'qituvchi",
  editTitle: "O'qituvchini tahrirlash",
  createSubtitle: "O'qituvchi tizimga shu login va parol bilan kiradi",
  passwordKeep: "O'zgartirmaslik uchun bo'sh qoldiring",
  passwordRule: 'Kamida 6 ta belgi',
};

async function save() {
  try {
    await submit(async (values) => {
      if (isEdit.value) {
        const { firstName, lastName, fatherName, phone, password } = values;
        await teachersApi.update(editing.value.id, {
          firstName,
          lastName,
          fatherName,
          phone,
          ...(password && { password }),
        });
        toast.success("O'qituvchi maʼlumotlari yangilandi");
      } else {
        await teachersApi.create(values);
        toast.success("Yangi o'qituvchi qo'shildi");
      }
    });
    modalOpen.value = false;
    load();
  } catch (err) {
    toast.error(err.message);
  }
}

async function remove(teacher) {
  const ok = await confirm.ask({
    title: "O'qituvchini o'chirish",
    message: `${fullName(teacher)} tizimdan o'chiriladi. Unga biriktirilgan fanlar o'qituvchisiz qoladi.`,
  });
  if (!ok) return;

  try {
    await teachersApi.remove(teacher.id);
    teachers.value = teachers.value.filter((item) => item.id !== teacher.id);
    toast.success("O'qituvchi o'chirildi");
  } catch (err) {
    toast.error(err.message);
  }
}
</script>

<template>
  <div>
    <PageHeader title="O'qituvchilar" :subtitle="`Jami ${teachers.length} nafar o'qituvchi`">
      <BaseButton icon="plus" @click="openCreate">O'qituvchi qo'shish</BaseButton>
    </PageHeader>

    <div class="toolbar">
      <SearchBox v-model="search" placeholder="Ism, familiya yoki login bo'yicha qidirish" />
    </div>

    <section class="card">
      <div v-if="loading && !teachers.length" class="card-body skeletons">
        <SkeletonBlock v-for="index in 5" :key="index" height="44px" />
      </div>

      <EmptyState
        v-else-if="!teachers.length"
        icon="teacher"
        :title="emptyTitle"
        :text="emptyText"
      >
        <BaseButton v-if="!search" icon="plus" @click="openCreate">O'qituvchi qo'shish</BaseButton>
      </EmptyState>

      <div v-else class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>O'qituvchi</th>
              <th>Login</th>
              <th>Telefon</th>
              <th>Fanlar</th>
              <th>Sinf rahbari</th>
              <th class="actions"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="teacher in teachers" :key="teacher.id">
              <td>
                <div class="person">
                  <UserAvatar :person="teacher" />
                  <div>
                    <strong>{{ teacher.lastName }} {{ teacher.firstName }}</strong>
                    <small class="muted">{{ teacher.fatherName }}</small>
                  </div>
                </div>
              </td>
              <td><code>@{{ teacher.userName }}</code></td>
              <td>
                <span v-if="teacher.phone" class="phone"><AppIcon name="phone" :size="14" />{{ teacher.phone }}</span>
                <span v-else class="muted">—</span>
              </td>
              <td><span class="badge info">{{ teacher.subjectsCount }} ta fan</span></td>
              <td>
                <span v-if="teacher.curatorOf" class="badge success">{{ teacher.curatorOf }}</span>
                <span v-else class="muted">—</span>
              </td>
              <td class="actions">
                <BaseButton variant="ghost" size="sm" icon="edit" icon-only title="Tahrirlash" @click="openEdit(teacher)" />
                <BaseButton variant="ghost" size="sm" icon="trash" icon-only title="O'chirish" @click="remove(teacher)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <BaseModal
      v-model:open="modalOpen"
      :title="isEdit ? modalText.editTitle : modalText.createTitle"
      :subtitle="isEdit ? fullName(editing) : modalText.createSubtitle"
      width="600px"
    >
      <form id="teacher-form" class="form-grid" @submit.prevent="save">
        <BaseInput v-model="values.lastName" label="Familiya" :error="errors.lastName" required />
        <BaseInput v-model="values.firstName" label="Ism" :error="errors.firstName" required />
        <BaseInput v-model="values.fatherName" label="Otasining ismi" :error="errors.fatherName" />
        <BaseInput v-model="values.phone" label="Telefon" icon="phone" placeholder="+998 90 123 45 67" :error="errors.phone" />
        <BaseInput
          v-model="values.userName"
          label="Login"
          icon="user"
          :disabled="isEdit"
          :error="errors.userName"
          required
        />
        <BaseInput
          v-model="values.password"
          label="Parol"
          icon="lock"
          type="password"
          :hint="isEdit ? modalText.passwordKeep : modalText.passwordRule"
          :error="errors.password"
          autocomplete="new-password"
        />
      </form>
      <template #footer>
        <BaseButton variant="secondary" @click="modalOpen = false">Bekor qilish</BaseButton>
        <BaseButton type="submit" form="teacher-form" :loading="submitting">
          {{ isEdit ? 'Saqlash' : "Qo'shish" }}
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<style lang="scss" scoped>
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

code {
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--surface-2);
  font-size: 13px;
  color: var(--text-2);
}

.phone {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
</style>
