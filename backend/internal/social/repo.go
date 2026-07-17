package social

import (
	"context"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"resource_community_go/internal/cachekey"
)

type Repo struct {
	db      *gorm.DB
	redisDB *redis.Client
}

func NewRepo(db *gorm.DB, redisDB *redis.Client) *Repo {
	return &Repo{db: db, redisDB: redisDB}
}

func (r *Repo) CreateFollow(ctx context.Context, follow Follow) error {
	return r.db.WithContext(ctx).
		Clauses(clause.OnConflict{DoNothing: true}).
		Create(&follow).
		Error
}

func (r *Repo) DeleteFollow(ctx context.Context, followerID, authorID uint) error {
	return r.db.WithContext(ctx).
		Where("follower_id = ? AND author_id = ?", followerID, authorID).
		Delete(&Follow{}).
		Error
}

func (r *Repo) IsFollowing(ctx context.Context, followerID, authorID uint) (bool, error) {
	if followerID == 0 || authorID == 0 {
		return false, nil
	}

	var count int64
	if err := r.db.WithContext(ctx).
		Model(&Follow{}).
		Where("follower_id = ? AND author_id = ?", followerID, authorID).
		Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *Repo) CountFollowers(ctx context.Context, authorID uint) (int64, error) {
	var count int64
	if authorID == 0 {
		return 0, nil
	}
	if err := r.db.WithContext(ctx).
		Model(&Follow{}).
		Where("author_id = ?", authorID).
		Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (r *Repo) CountFollowing(ctx context.Context, followerID uint) (int64, error) {
	var count int64
	if followerID == 0 {
		return 0, nil
	}
	if err := r.db.WithContext(ctx).
		Model(&Follow{}).
		Where("follower_id = ?", followerID).
		Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (r *Repo) InvalidateFollowingFeed(ctx context.Context, followerID uint) {
	if followerID == 0 {
		return
	}
	cachekey.DeleteByPrefix(ctx, r.redisDB, cachekey.ArticleFollowingPrefixForUser(followerID))
}
