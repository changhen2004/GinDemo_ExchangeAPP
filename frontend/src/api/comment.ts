import apiClient, { unwrapData } from './client';

export interface CommentAuthor {
  id: number;
  username: string;
}

export interface Comment {
  id: number;
  articleId: number;
  userId: number;
  content: string;
  author: CommentAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentPayload {
  content: string;
}

export function listComments(articleId: string | number) {
  return unwrapData<Comment[]>(apiClient.get(`/articles/${articleId}/comments`));
}

export function createComment(
  articleId: string | number,
  payload: CreateCommentPayload,
) {
  return unwrapData<Comment>(apiClient.post(`/articles/${articleId}/comments`, payload));
}

export function deleteComment(commentId: string | number) {
  return unwrapData<{ message: string }>(apiClient.delete(`/comments/${commentId}`));
}
