import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import * as authApi from '../api/auth';
import { getMyPoints, type PointsSummary } from '../api/points';
import { registerAuthLifecycleHandlers } from '../api/client';
import {
  clearStoredTokens,
  getAccessToken,
  getRefreshToken,
  parseSessionUser,
  setStoredTokens,
  type SessionTokens,
  type SessionUser,
} from './session';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(getAccessToken());
  const refreshToken = ref<string | null>(getRefreshToken());
  const currentUser = ref<SessionUser | null>(parseSessionUser(accessToken.value));
  const pointsSummary = ref<PointsSummary | null>(null);
  const restoring = ref(false);

  const isAuthenticated = computed(() => !!accessToken.value);
  const pointsBalance = computed(() => pointsSummary.value?.balance ?? 0);

  const syncTokens = (tokens: SessionTokens | null) => {
    accessToken.value = tokens?.access_token ?? null;
    refreshToken.value = tokens?.refresh_token ?? null;
    currentUser.value = parseSessionUser(accessToken.value);
  };

  const setTokens = (tokens: authApi.AuthTokens) => {
    setStoredTokens(tokens);
    syncTokens(tokens);
  };

  const clearSession = () => {
    clearStoredTokens();
    syncTokens(null);
    pointsSummary.value = null;
  };

  const restoreSummary = async () => {
    if (!accessToken.value) {
      pointsSummary.value = null;
      return null;
    }

    const summary = await getMyPoints();
    pointsSummary.value = summary;
    return summary;
  };

  const restoreSession = async () => {
    restoring.value = true;
    try {
      const storedRefreshToken = getRefreshToken();
      const storedAccessToken = getAccessToken();

      if (!storedRefreshToken) {
        clearSession();
        return;
      }

      syncTokens({
        access_token: storedAccessToken ?? '',
        refresh_token: storedRefreshToken,
      });

      if (!storedAccessToken) {
        const refreshedTokens = await authApi.refresh(storedRefreshToken);
        setTokens(refreshedTokens);
      }

      await restoreSummary();
    } catch (error) {
      clearSession();
      throw error;
    } finally {
      restoring.value = false;
    }
  };

  registerAuthLifecycleHandlers({
    onTokensUpdated: (tokens) => {
      syncTokens(tokens);
    },
    onAuthFailure: () => {
      clearSession();
    },
  });

  const login = async (username: string, password: string) => {
    try {
      const tokens = await authApi.login({ username, password });
      setTokens(tokens);
      await restoreSummary();
    } catch (error) {
      clearSession();
      throw new Error(`Login failed! ${error}`);
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const tokens = await authApi.register({ username, password });
      setTokens(tokens);
      await restoreSummary();
    } catch (error) {
      clearSession();
      throw new Error(`Register failed! ${error}`);
    }
  };

  const refreshSummary = async () => {
    try {
      return await restoreSummary();
    } catch (error) {
      pointsSummary.value = null;
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (isAuthenticated.value) {
        await authApi.logout();
      }
    } finally {
      clearSession();
    }
  };

  return {
    accessToken,
    refreshToken,
    pointsSummary,
    currentUser,
    pointsBalance,
    restoring,
    isAuthenticated,
    login,
    register,
    restoreSession,
    refreshSummary,
    logout,
  };
});
