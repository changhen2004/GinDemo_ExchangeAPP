import apiClient, { requestTokenRefresh, unwrapData } from './client';
export function login(payload) {
    return unwrapData(apiClient.post('/auth/login', payload));
}
export function register(payload) {
    return unwrapData(apiClient.post('/auth/register', payload));
}
export function refresh(refreshToken) {
    return requestTokenRefresh(refreshToken);
}
export function logout() {
    return unwrapData(apiClient.post('/auth/logout'));
}
