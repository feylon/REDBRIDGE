<script setup>
import { ref } from 'vue';
import { authApi } from '@/api';
import { useForm } from '@/composables/useForm';
import { useAuthStore } from '@/stores/auth';
import { useToastStore } from '@/stores/toast';
import { formatDate } from '@/utils/format';
import PageHeader from '@/components/ui/PageHeader.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import UserAvatar from '@/components/ui/UserAvatar.vue';

const auth = useAuthStore();
const toast = useToastStore();
const confirmPassword = ref('');
const mismatch = ref('');

const { values, errors, submitting, reset, submit } = useForm({ currentPassword: '', newPassword: '' });

async function save() {
  mismatch.value = '';
  if (values.newPassword !== confirmPassword.value) {
    mismatch.value = 'Parollar mos kelmadi';
    return;
  }

  try {
    await submit((payload) => authApi.changePassword(payload));
    toast.success("Parol muvaffaqiyatli o'zgartirildi");
    reset();
    confirmPassword.value = '';
  } catch (err) {
    toast.error(err.message);
  }
}
</script>

<template>
  <div>
    <PageHeader title="Sozlamalar" subtitle="Hisob maʼlumotlari va xavfsizlik" />

    <div class="layout">
      <section class="card account">
        <UserAvatar :person="auth.user" :size="64" />
        <div>
          <h3>{{ auth.displayName }}</h3>
          <p class="muted">@{{ auth.user?.userName }}</p>
        </div>
        <dl>
          <div>
            <dt>Rol</dt>
            <dd><span class="badge info">Administrator</span></dd>
          </div>
          <div>
            <dt>Yaratilgan</dt>
            <dd>{{ formatDate(auth.user?.createdAt) }}</dd>
          </div>
        </dl>
      </section>

      <section class="card">
        <header class="card-header">
          <div>
            <h3>Parolni o'zgartirish</h3>
            <p class="muted">Xavfsizlik uchun kuchli paroldan foydalaning</p>
          </div>
        </header>
        <form class="card-body form" @submit.prevent="save">
          <BaseInput
            v-model="values.currentPassword"
            type="password"
            label="Joriy parol"
            icon="lock"
            autocomplete="current-password"
            :error="errors.currentPassword"
            required
          />
          <BaseInput
            v-model="values.newPassword"
            type="password"
            label="Yangi parol"
            icon="lock"
            hint="Kamida 6 ta belgi"
            autocomplete="new-password"
            :error="errors.newPassword"
            required
          />
          <BaseInput
            v-model="confirmPassword"
            type="password"
            label="Yangi parolni tasdiqlang"
            icon="lock"
            autocomplete="new-password"
            :error="mismatch"
            required
          />
          <div class="actions">
            <BaseButton type="submit" :loading="submitting">Saqlash</BaseButton>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 18px;
  align-items: start;

  @include down($bp-md) {
    grid-template-columns: 1fr;
  }
}

.account {
  display: grid;
  gap: 16px;
  padding: 24px;

  h3 {
    font-size: 18px;
  }

  dl {
    margin: 0;

    div {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-top: 1px solid var(--border);
    }

    dt {
      color: var(--muted);
    }

    dd {
      margin: 0;
      font-weight: 600;
    }
  }
}

.form {
  display: grid;
  gap: 16px;
  max-width: 460px;
}

.actions {
  display: flex;
  justify-content: flex-end;
}
</style>
