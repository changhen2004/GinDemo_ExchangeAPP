import apiClient, { unwrapData } from './client';
import type {
  AuthorSocialStatus,
  FollowingFeedResponse,
  FollowActionResponse,
  ResourceDetail,
  ResourceLike,
  ResourceSummary,
} from '../types/resource';

export interface ListArticlesParams {
  page?: number;
  pageSize?: number;
  sort?: 'latest' | 'hot';
  keyword?: string;
  tag?: string;
}

export interface ListFollowingArticlesParams {
  pageSize?: number;
  beforeCreatedAt?: string;
  beforeId?: number;
}

export interface CreateArticlePayload {
  title: string;
  content: string;
  preview: string;
  coverUrl?: string;
  contentImages?: string[];
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
  isFree?: boolean;
  requiredPoints?: number;
}

export function listArticles(params: ListArticlesParams = {}) {
  return unwrapData<ResourceSummary[]>(
    apiClient.get('/articles', {
      params,
    }),
  );
}

export function listFollowingArticles(params: ListFollowingArticlesParams = {}) {
  return unwrapData<FollowingFeedResponse>(
    apiClient.get('/me/following/articles', {
      params,
    }),
  );
}

export function getArticleDetail(id: string | number) {
  return unwrapData<ResourceDetail>(apiClient.get(`/articles/${id}`));
}

export function createArticle(payload: CreateArticlePayload) {
  return unwrapData<ResourceSummary>(apiClient.post('/articles', payload));
}

export function getArticleLikes(id: string | number) {
  return unwrapData<ResourceLike>(apiClient.get(`/articles/${id}/like`));
}

export function likeArticle(id: string | number) {
  return unwrapData<ResourceLike>(apiClient.post(`/articles/${id}/like`));
}

export function getAuthorSocialStatus(authorId: string | number) {
  return unwrapData<AuthorSocialStatus>(apiClient.get(`/authors/${authorId}/social-status`));
}

export function followAuthor(authorId: string | number) {
  return unwrapData<FollowActionResponse>(apiClient.post(`/authors/${authorId}/follow`));
}

export function unfollowAuthor(authorId: string | number) {
  return unwrapData<FollowActionResponse>(apiClient.delete(`/authors/${authorId}/follow`));
}
