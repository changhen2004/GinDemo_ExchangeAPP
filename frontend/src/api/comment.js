import apiClient, { unwrapData } from './client';
export function listComments(articleId) {
    return unwrapData(apiClient.get(`/articles/${articleId}/comments`));
}
export function createComment(articleId, payload) {
    return unwrapData(apiClient.post(`/articles/${articleId}/comments`, payload));
}
export function deleteComment(commentId) {
    return unwrapData(apiClient.delete(`/comments/${commentId}`));
}
