<script setup>
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import AppIcon from '@/components/ui/AppIcon.vue';
import logo from '@/assets/logo.svg';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const form = reactive({ userName: '', password: '' });
const loading = ref(false);
const error = ref('');

const features = [
  { icon: 'journal', text: 'Elektron jurnal va baholar tahlili' },
  { icon: 'school', text: "Sinflar, fanlar va o'qituvchilar boshqaruvi" },
  { icon: 'parent', text: "Ota-onalar uchun farzand nazorati" },
];

async function submit() {
  error.value = '';
  if (!form.userName || !form.password) {
    error.value = 'Login va parolni kiriting';
    return;
  }

  loading.value = true;
  try {
    await auth.login(form);
    router.replace(route.query.redirect || { name: 'dashboard' });
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login">
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-brand">
          <img :src="logo" alt="RedBridge" />
          <span>RedBridge</span>
        </div>
        <h1>Maktabingizni bir joydan <em>boshqaring</em></h1>
        <p>O'quvchilar, o'qituvchilar va baholar — barchasi zamonaviy va qulay boshqaruv panelida.</p>
        <ul>
          <li v-for="item in features" :key="item.text">
            <span><AppIcon :name="item.icon" :size="18" /></span>
            {{ item.text }}
          </li>
        </ul>
      </div>
      <p class="hero-footer">© {{ new Date().getFullYear() }} RedBridge</p>
    </section>

    <section class="panel">
      <form class="form" novalidate @submit.prevent="submit">
        <img :src="logo" alt="" class="form-logo" />
        <h2>Xush kelibsiz!</h2>
        <p class="muted">Davom etish uchun hisobingizga kiring</p>

        <Transition name="fade">
          <div v-if="error" class="alert">
            <AppIcon name="alert" :size="18" />
            {{ error }}
          </div>
        </Transition>

        <BaseInput
          v-model="form.userName"
          label="Login"
          icon="user"
          placeholder="admin"
          autocomplete="username"
          autofocus
        />
        <BaseInput
          v-model="form.password"
          label="Parol"
          icon="lock"
          type="password"
          placeholder="••••••••"
          autocomplete="current-password"
        />

        <BaseButton type="submit" size="lg" block :loading="loading">Kirish</BaseButton>
      </form>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.login {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  min-height: 100vh;

  @include down($bp-md) {
    grid-template-columns: 1fr;
  }
}

.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px 56px;
  overflow: hidden;
  color: #e2e8f0;
  background:
    radial-gradient(60% 50% at 10% 10%, rgba(214, 40, 57, 0.45), transparent 70%),
    radial-gradient(50% 50% at 90% 90%, rgba(215, 181, 109, 0.25), transparent 70%),
    var(--ink);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: radial-gradient(70% 70% at 50% 40%, #000, transparent);
    pointer-events: none;
  }

  @include down($bp-md) {
    display: none;
  }
}

.hero-inner {
  position: relative;
  z-index: 1;
  max-width: 520px;
  margin: auto 0;

  h1 {
    margin-top: 40px;
    color: #fff;
    font-size: 44px;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.03em;

    em {
      font-style: normal;
      background: linear-gradient(90deg, #ff6b7a, var(--gold));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
  }

  > p {
    margin-top: 18px;
    font-size: 16px;
    color: #94a3b8;
  }

  ul {
    display: grid;
    gap: 14px;
    margin: 36px 0 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 500;

    span {
      display: grid;
      place-items: center;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: var(--gold);
    }
  }
}

.hero-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 800;
  color: #fff;

  img {
    width: 48px;
    height: 48px;
  }
}

.hero-footer {
  position: relative;
  z-index: 1;
  color: #64748b;
  font-size: 13px;
}

.panel {
  display: grid;
  place-items: center;
  padding: 32px 20px;
  background: var(--surface);
}

.form {
  display: grid;
  gap: 18px;
  width: 100%;
  max-width: 380px;

  h2 {
    font-size: 28px;
    font-weight: 800;
  }

  > p {
    margin-top: -12px;
  }
}

.form-logo {
  width: 56px;
  height: 56px;
  padding: 10px;
  border-radius: 16px;
  background: var(--ink);
}

.alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  background: var(--danger-50);
  color: var(--danger);
  font-weight: 500;
}
</style>
