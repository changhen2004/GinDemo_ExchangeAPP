import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  delete: vi.fn(),
  unwrapData: vi.fn((request: unknown) => request),
}));

vi.mock('./client', () => ({
  default: {
    get: mocks.get,
    post: mocks.post,
    delete: mocks.delete,
  },
  unwrapData: mocks.unwrapData,
}));

describe('article social API', () => {
  it('requests the following feed with cursor params', async () => {
    const { listFollowingArticles } = await import('./article');

    listFollowingArticles({
      pageSize: 12,
      beforeCreatedAt: '2026-07-17T12:00:00Z',
      beforeId: 42,
    });

    expect(mocks.get).toHaveBeenCalledWith('/me/following/articles', {
      params: {
        pageSize: 12,
        beforeCreatedAt: '2026-07-17T12:00:00Z',
        beforeId: 42,
      },
    });
  });

  it('requests follow and unfollow author endpoints', async () => {
    const { followAuthor, unfollowAuthor } = await import('./article');

    followAuthor(7);
    unfollowAuthor(7);

    expect(mocks.post).toHaveBeenCalledWith('/authors/7/follow');
    expect(mocks.delete).toHaveBeenCalledWith('/authors/7/follow');
  });

  it('requests author social status', async () => {
    const { getAuthorSocialStatus } = await import('./article');

    getAuthorSocialStatus(9);

    expect(mocks.get).toHaveBeenCalledWith('/authors/9/social-status');
  });
});
