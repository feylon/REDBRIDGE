<script setup>
import { ref, watch } from 'vue';
import { parentsApi } from '@/api';
import { useAsync } from '@/composables/useAsync';
import { useDebounced } from '@/composables/useDebounced';
import { useForm } from '@/composables/useForm';
import { useConfirmStore } from '@/stores/confirm';
import { useToastStore } from '@/stores/toast';
import { shortName } from '@/utils/format';
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
const { data: parents, loading, run: load } = useAsync(() => parentsApi.list({ search: query.value }), {
  immediate: true,
  initial: [],
});
watch(query, () => load());

const modalOpen = ref(false);
const { values, errors, submitting, reset, submit } = useForm({
  lastName: '',
  firstName: '',
  phone: '',
  userName: '',
  password: '',
});

const texts = {
  subtitle: "Ota-ona farzandining baholarini shu login orqali kuzatadi",
};

function openModal() {
  reset();
  modalOpen.value = true;
}

async function save() {
  try {
    await submit((payload) => parentsApi.create(payload));
    toast.success("Ota-ona qo'shildi");
    modalOpen.value = false;
    load();
  } catch (err) {
    toast.error(err.message);
  }
}

async function remove(parent) {
  const ok = await confirm.ask({
    title: "Ota-onani o'chirish",
    message: `${shortName(parent)} hisobi o'chiriladi. Farzandlarining maʼlumotlari saqlanib qoladi.`,
  });
  if (!ok) return;

  try {
    await parentsApi.remove(parent.id);
    parents.value = parents.value.filter((item) => item.id !== parent.id);
    toast.success("Ota-ona o'chirildi");
  } catch (err) {
    toast.error(err.message);
  }
}
</script>

<template>
  <div>
    <PageHeader title="Ota-onalar" :subtitle="`Jami ${parents.length} ta hisob`">
      <BaseButton icon="plus" @click="openModal">Ota-ona qo'shish</BaseButton>
    </PageHeader>

    <div class="toolbar">
      <SearchBox v-model="search" placeholder="Ism yoki login bo'yicha qidirish" />
    </div>

    <div v-if="loading && !parents.length" class="grid cards">
      <div v-for="index in 6" :key="index" class="card skeleton">
        <SkeletonBlock width="48px" height="48px" radius="50%" />
        <SkeletonBlock width="70%" height="14px" />
      </div>
    </div>

    <section v-else-if="!parents.length" class="card">
      <EmptyState icon="parent" title="Ota-onalar topilmadi" text="Ota-ona hisobini yarating va unga farzandlarini biriktiring.">
        <BaseButton v-if="!search" icon="plus" @click="openModal">Ota-ona qo'shish</BaseButton>
      </EmptyState>
    </section>

    <div v-else class="grid cards">
      <article v-for="parent in parents" :key="parent.id" class="card parent">
        <RouterLink :to="{ name: 'parent', params: { id: parent.id } }" class="parent-link">
          <UserAvatar :person="parent" :size="48" />
          <div class="parent-info">
            <strong>{{ shortName(parent) }}</strong>
            <small class="muted">@{{ parent.userName }}</small>
          </div>
          <AppIcon name="chevron-right" class="arrow" />
        </RouterLink>
        <footer>
          <span class="badge" :class="parent.childrenCount ? 'info' : ''">
            <AppIcon name="student" :size="13" />
            {{ parent.childrenCount }} ta farzand
          </span>
          <span v-if="parent.phone" class="phone muted"><AppIcon name="phone" :size="13" />{{ parent.phone }}</span>
          <BaseButton variant="ghost" size="sm" icon="trash" icon-only title="O'chirish" @click="remove(parent)" />
        </footer>
      </article>
    </div>

    <BaseModal v-model:open="modalOpen" title="Yangi ota-ona" :subtitle="texts.subtitle" width="600px">
      <form id="parent-form" class="form-grid" @submit.prevent="save">
        <BaseInput v-model="values.lastName" label="Familiya" :error="errors.lastName" />
        <BaseInput v-model="values.firstName" label="Ism" :error="errors.firstName" />
        <BaseInput v-model="values.phone" class="full" label="Telefon" icon="phone" placeholder="+998 90 123 45 67" :error="errors.phone" />
        <BaseInput v-model="values.userName" label="Login" icon="user" :error="errors.userName" required />
        <BaseInput
          v-model="values.password"
          label="Parol"
          icon="lock"
          type="password"
          hint="Kamida 6 ta belgi"
          :error="errors.password"
          autocomplete="new-password"
          required
        />
      </form>
      <template #footer>
        <BaseButton variant="secondary" @click="modalOpen = false">Bekor qilish</BaseButton>
        <BaseButton type="submit" form="parent-form" :loading="submitting">Qo'shish</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<style lang="scss" scoped>
.cards {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.skeleton {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
}

.parent {
  overflow: hidden;
  transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow);

    .arrow {
      color: var(--primary);
      transform: translateX(3px);
    }
  }

  footer {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px 10px 20px;
    border-top: 1px solid var(--border);
    background: var(--surface-2);

    .btn {
      margin-left: auto;
    }
  }
}

.parent-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
}

.parent-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;

  strong {
    @include truncate;
  }
}

.arrow {
  color: var(--subtle);
  transition: transform 0.2s, color 0.2s;
}

.phone {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}
</style>
