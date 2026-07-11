import apiClient, { unwrapData } from './client';
export function favoriteArticle(articleId) {
    return unwrapData(apiClient.post(`/articles/${articleId}/favorite`));
}
export function unfavoriteArticle(articleId) {
    return unwrapData(apiClient.delete(`/articles/${articleId}/favorite`));
}
export function listMyFavorites() {
    return unwrapData(apiClient.get('/me/favorites'));
}
