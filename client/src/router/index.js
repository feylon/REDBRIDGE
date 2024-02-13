import { createRouter, createWebHistory } from 'vue-router';
import { onUnauthorized } from '@/api/http';
import { useAuthStore } from '@/stores/auth';
import AppLayout from '@/layouts/AppLayout.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { guest: true, title: 'Kirish' },
  },
  {
    path: '/',
    component: AppLayout,
    meta: { auth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { title: 'Boshqaruv paneli' },
      },
      {
        path: 'teachers',
        name: 'teachers',
        component: () => import('@/views/TeachersView.vue'),
        meta: { title: "O'qituvchilar" },
      },
      {
        path: 'grades',
        name: 'grades',
        component: () => import('@/views/GradesView.vue'),
        meta: { title: 'Sinflar' },
      },
      {
        path: 'grades/:id/:tab(journal|students|subjects)?',
        name: 'grade',
        component: () => import('@/views/GradeDetailView.vue'),
        meta: { title: 'Sinf', parent: 'grades' },
      },
      {
        path: 'students',
        name: 'students',
        component: () => import('@/views/StudentsView.vue'),
        meta: { title: "O'quvchilar" },
      },
      {
        path: 'parents',
        name: 'parents',
        component: () => import('@/views/ParentsView.vue'),
        meta: { title: 'Ota-onalar' },
      },
      {
        path: 'parents/:id',
        name: 'parent',
        component: () => import('@/views/ParentDetailView.vue'),
        meta: { title: 'Ota-ona', parent: 'parents' },
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/SettingsView.vue'),
        meta: { title: 'Sozlamalar' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Sahifa topilmadi' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (to.matched.some((record) => record.meta.auth)) {
    if (!auth.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } };
    }
    await auth.fetchUser();
    if (!auth.isAuthenticated) {
      return { name: 'login' };
    }
  }

  if (to.meta.guest && auth.isAuthenticated) {
    return { name: 'dashboard' };
  }

  return true;
});

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · RedBridge` : 'RedBridge';
});

onUnauthorized(() => {
  useAuthStore().logout();
  if (router.currentRoute.value.name !== 'login') {
    router.replace({ name: 'login' });
  }
});

export default router;
