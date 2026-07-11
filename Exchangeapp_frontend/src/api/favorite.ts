import apiClient, { unwrapData } from './client';

export interface FavoriteArticle {
  id: number;
  title: string;
  preview: string;
  coverUrl: string;
  requiredPoints: number;
  isFree: boolean;
  author: {
    id: number;
    username: string;
  };
  favoritedAt: string;
}

export interface FavoriteActionResponse {
  message: string;
  favoriteCount: number;
}

export function favoriteArticle(articleId: string | number) {
  return unwrapData<FavoriteActionResponse>(apiClient.post(`/articles/${articleId}/favorite`));
}

export function unfavoriteArticle(articleId: string | number) {
  return unwrapData<FavoriteActionResponse>(
    apiClient.delete(`/articles/${articleId}/favorite`),
  );
}

export function listMyFavorites() {
  return unwrapData<FavoriteArticle[]>(apiClient.get('/me/favorites'));
}
