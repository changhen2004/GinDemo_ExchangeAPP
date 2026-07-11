import apiClient, { unwrapData } from './client';
export function listArticles(params = {}) {
    return unwrapData(apiClient.get('/articles', {
        params,
    }));
}
export function getArticleDetail(id) {
    return unwrapData(apiClient.get(`/articles/${id}`));
}
export function createArticle(payload) {
    return unwrapData(apiClient.post('/articles', payload));
}
export function getArticleLikes(id) {
    return unwrapData(apiClient.get(`/articles/${id}/like`));
}
export function likeArticle(id) {
    return unwrapData(apiClient.post(`/articles/${id}/like`));
}
