import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import * as authApi from '../api/auth';
import { getMyPoints } from '../api/points';
import { registerAuthLifecycleHandlers } from '../api/client';
import { clearStoredTokens, getAccessToken, getRefreshToken, parseSessionUser, setStoredTokens, } from './session';
export const useAuthStore = defineStore('auth', () => {
    const accessToken = ref(getAccessToken());
    const refreshToken = ref(getRefreshToken());
    const currentUser = ref(parseSessionUser(accessToken.value));
    const pointsSummary = ref(null);
    const restoring = ref(false);
    const isAuthenticated = computed(() => !!accessToken.value);
    const pointsBalance = computed(() => pointsSummary.value?.balance ?? 0);
    const syncTokens = (tokens) => {
        accessToken.value = tokens?.access_token ?? null;
        refreshToken.value = tokens?.refresh_token ?? null;
        currentUser.value = parseSessionUser(accessToken.value);
    };
    const setTokens = (tokens) => {
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
        }
        catch (error) {
            clearSession();
            throw error;
        }
        finally {
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
    const login = async (username, password) => {
        try {
            const tokens = await authApi.login({ username, password });
            setTokens(tokens);
            await restoreSummary();
        }
        catch (error) {
            clearSession();
            throw new Error(`Login failed! ${error}`);
        }
    };
    const register = async (username, password) => {
        try {
            const tokens = await authApi.register({ username, password });
            setTokens(tokens);
            await restoreSummary();
        }
        catch (error) {
            clearSession();
            throw new Error(`Register failed! ${error}`);
        }
    };
    const refreshSummary = async () => {
        try {
            return await restoreSummary();
        }
        catch (error) {
            pointsSummary.value = null;
            throw error;
        }
    };
    const logout = async () => {
        try {
            if (isAuthenticated.value) {
                await authApi.logout();
            }
        }
        finally {
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
