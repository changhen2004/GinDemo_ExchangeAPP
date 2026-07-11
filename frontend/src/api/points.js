import apiClient, { unwrapData } from './client';
export function getMyPoints() {
    return unwrapData(apiClient.get('/me/points'));
}
export function getMyPointsRecords() {
    return unwrapData(apiClient.get('/me/points/records'));
}
export function unlockArticle(articleId) {
    return unwrapData(apiClient.post(`/articles/${articleId}/unlock`));
}
export function redeemPrivilege(payload) {
    return unwrapData(apiClient.post('/me/points/redeem', payload));
}
