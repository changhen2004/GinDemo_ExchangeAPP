import apiClient, { unwrapData } from './client';
export function checkIn() {
    return unwrapData(apiClient.post('/me/check-in'));
}
