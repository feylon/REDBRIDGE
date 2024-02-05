import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { authApi } from '@/api';
import { TOKEN_KEY } from '@/api/http';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY));
  const user = ref(null);

  const isAuthenticated = computed(() => Boolean(token.value));
  const displayName = computed(() => {
    if (!user.value) return '';
    return [user.value.firstName, user.value.lastName].filter(Boolean).join(' ') || user.value.userName;
  });

  async function login(credentials) {
    const data = await authApi.login(credentials);
    token.value = data.token;
    user.value = data.user;
    localStorage.setItem(TOKEN_KEY, data.token);
  }

  async function fetchUser() {
    if (!token.value || user.value) return;
    try {
      user.value = await authApi.me();
    } catch {
      logout();
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem(TOKEN_KEY);
  }

  return { token, user, isAuthenticated, displayName, login, fetchUser, logout };
});
