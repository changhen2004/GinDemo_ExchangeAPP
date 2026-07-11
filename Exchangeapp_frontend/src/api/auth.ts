import apiClient, { requestTokenRefresh, unwrapData } from './client';
import type { SessionTokens } from '../store/session';

export type AuthTokens = SessionTokens;

export interface Credentials {
  username: string;
  password: string;
}

export function login(payload: Credentials) {
  return unwrapData<AuthTokens>(apiClient.post('/auth/login', payload));
}

export function register(payload: Credentials) {
  return unwrapData<AuthTokens>(apiClient.post('/auth/register', payload));
}

export function refresh(refreshToken: string) {
  return requestTokenRefresh(refreshToken);
}

export function logout() {
  return unwrapData<Record<string, never>>(apiClient.post('/auth/logout'));
}
