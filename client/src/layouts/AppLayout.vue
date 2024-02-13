<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AppIcon from '@/components/ui/AppIcon.vue';
import UserAvatar from '@/components/ui/UserAvatar.vue';
import logo from '@/assets/logo.svg';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const sidebarOpen = ref(false);

const navigation = [
  { name: 'dashboard', label: 'Boshqaruv paneli', icon: 'dashboard' },
  { name: 'grades', label: 'Sinflar', icon: 'school' },
  { name: 'teachers', label: "O'qituvchilar", icon: 'teacher' },
  { name: 'students', label: "O'quvchilar", icon: 'student' },
  { name: 'parents', label: 'Ota-onalar', icon: 'parent' },
];

const activeSection = computed(() => route.meta.parent || route.name);

watch(
  () => route.fullPath,
  () => {
    sidebarOpen.value = false;
  },
);

function logout() {
  auth.logout();
  router.replace({ name: 'login' });
}
</script>

<template>
  <div class="shell" :class="{ 'sidebar-open': sidebarOpen }">
    <aside class="sidebar">
      <RouterLink :to="{ name: 'dashboard' }" class="brand">
        <span class="brand-logo"><img :src="logo" alt="" /></span>
        <span>
          <strong>RedBridge</strong>
          <small>Maktab boshqaruvi</small>
        </span>
      </RouterLink>

      <nav class="nav">
        <p class="nav-title">Asosiy</p>
        <RouterLink
          v-for="item in navigation"
          :key="item.name"
          :to="{ name: item.name }"
          class="nav-link"
          :class="{ active: activeSection === item.name }"
        >
          <AppIcon :name="item.icon" />
          <span>{{ item.label }}</span>
        </RouterLink>

        <p class="nav-title">Tizim</p>
        <RouterLink :to="{ name: 'settings' }" class="nav-link" :class="{ active: activeSection === 'settings' }">
          <AppIcon name="settings" />
          <span>Sozlamalar</span>
        </RouterLink>
      </nav>

      <div class="profile">
        <UserAvatar :person="auth.user" :size="38" />
        <div class="profile-info">
          <strong>{{ auth.displayName }}</strong>
          <small>Administrator</small>
        </div>
        <button type="button" class="logout" title="Chiqish" @click="logout">
          <AppIcon name="logout" />
        </button>
      </div>
    </aside>

    <div class="overlay" @click="sidebarOpen = false"></div>

    <div class="main">
      <header class="topbar">
        <button type="button" class="menu-toggle" aria-label="Menyu" @click="sidebarOpen = true">
          <AppIcon name="menu" />
        </button>
        <div class="crumbs">
          <span class="muted">RedBridge</span>
          <AppIcon name="chevron-right" :size="14" />
          <span>{{ route.meta.title }}</span>
        </div>
        <div class="topbar-user">
          <span class="muted">Salom,</span>
          <strong>{{ auth.user?.firstName || auth.user?.userName }}</strong>
        </div>
      </header>

      <main class="content">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" :key="`${String(route.name)}:${route.params.id || ''}`" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.shell {
  min-height: 100vh;
}

.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  width: $sidebar-width;
  padding: 20px 16px;
  background:
    radial-gradient(120% 60% at 0% 0%, rgba(214, 40, 57, 0.22), transparent 60%),
    var(--ink);
  color: #cbd5e1;
  transition: transform 0.3s var(--ease);

  @include down($bp-md) {
    transform: translateX(-100%);
    box-shadow: var(--shadow-lg);

    .sidebar-open & {
      transform: none;
    }
  }
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 8px 24px;
  color: #fff;

  strong {
    display: block;
    font-family: var(--font-display);
    font-size: 18px;
    letter-spacing: -0.02em;
  }

  small {
    color: #94a3b8;
    font-size: 12px;
  }
}

.brand-logo {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(215, 181, 109, 0.12);
  border: 1px solid rgba(215, 181, 109, 0.3);

  img {
    width: 30px;
    height: 30px;
  }
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  overflow-y: auto;
}

.nav-title {
  margin: 16px 12px 8px;
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  border-radius: 10px;
  font-weight: 500;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
  }

  &.active {
    background: linear-gradient(90deg, rgba(214, 40, 57, 0.95), rgba(214, 40, 57, 0.75));
    color: #fff;
    box-shadow: 0 8px 20px -10px rgba(214, 40, 57, 0.9);
  }
}

.profile {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
  padding: 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.profile-info {
  flex: 1;
  min-width: 0;

  strong {
    display: block;
    color: #fff;
    @include truncate;
  }

  small {
    color: #94a3b8;
  }
}

.logout {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #94a3b8;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }
}

.overlay {
  display: none;

  @include down($bp-md) {
    .sidebar-open & {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 40;
      background: rgba(15, 23, 42, 0.45);
    }
  }
}

.main {
  margin-left: $sidebar-width;

  @include down($bp-md) {
    margin-left: 0;
  }
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 16px;
  height: $topbar-height;
  padding: 0 32px;
  background: rgba(244, 246, 251, 0.82);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);

  @include down($bp-sm) {
    padding: 0 16px;
  }
}

.menu-toggle {
  display: none;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-strong);
  border-radius: 10px;
  background: var(--surface);

  @include down($bp-md) {
    display: grid;
  }
}

.crumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;

  .icon {
    color: var(--subtle);
  }

  @include down($bp-sm) {
    .muted,
    .icon {
      display: none;
    }
  }
}

.topbar-user {
  display: flex;
  gap: 6px;
  margin-left: auto;

  @include down($bp-sm) {
    display: none;
  }
}

.content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px;

  @include down($bp-sm) {
    padding: 20px 16px;
  }
}
</style>
