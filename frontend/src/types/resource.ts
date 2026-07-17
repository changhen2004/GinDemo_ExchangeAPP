export interface ResourceSummary {
  id: number;
  authorId: number;
  title: string;
  preview: string;
  content: string;
  coverUrl?: string;
  contentImages?: string[];
  tags?: string[];
  status?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  favoriteCount?: number;
  isFree?: boolean;
  requiredPoints?: number;
}

export interface ResourceDetail extends ResourceSummary {
  author?: {
    id: number;
    username: string;
  };
  stats?: {
    viewCount: number;
    likeCount: number;
    commentCount: number;
    favoriteCount: number;
  };
  isUnlocked?: boolean;
}

export interface ResourceLike {
  likes: number;
}

export interface FollowingFeedCursor {
  beforeCreatedAt: string;
  beforeId: number;
}

export interface FollowingFeedResponse {
  items: ResourceSummary[];
  nextCursor?: FollowingFeedCursor;
  hasMore: boolean;
}

export interface AuthorSocialStatus {
  authorId: number;
  isFollowing: boolean;
  followerCount: number;
  followingCount: number;
}

export interface FollowActionResponse {
  message: string;
  status: AuthorSocialStatus;
}
