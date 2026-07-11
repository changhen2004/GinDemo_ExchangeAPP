package article

import (
	"context"
	"strconv"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type Repo struct {
	db      *gorm.DB
	redisDB *redis.Client
}

func NewRepo(db *gorm.DB, redisDB *redis.Client) *Repo {
	return &Repo{db: db, redisDB: redisDB}
}

func (r *Repo) Create(article *Article) error {
	return r.db.Create(article).Error
}

func (r *Repo) List() ([]Article, error) {
	var articles []Article
	if err := r.db.Find(&articles).Error; err != nil {
		return nil, err
	}
	return articles, nil
}

func (r *Repo) FindByID(id string) (*Article, error) {
	var article Article
	if err := r.db.Where("id = ?", id).First(&article).Error; err != nil {
		return nil, err
	}
	return &article, nil
}

func (r *Repo) DeleteArticlesCache(ctx context.Context, key string) {
	if r.redisDB == nil {
		return
	}
	_ = r.redisDB.Del(ctx, key).Err()
}

func (r *Repo) GetArticlesCache(ctx context.Context, key string) (string, error) {
	if r.redisDB == nil {
		return "", redis.Nil
	}
	return r.redisDB.Get(ctx, key).Result()
}

func (r *Repo) SetArticlesCache(ctx context.Context, key, value string) {
	if r.redisDB == nil {
		return
	}
	_ = r.redisDB.Set(ctx, key, value, 0).Err()
}

func (r *Repo) IncrementLike(ctx context.Context, articleID string) (int, error) {
	if r.redisDB == nil {
		return 0, redis.Nil
	}
	likeKey := "article:" + articleID + ":like"
	if err := r.redisDB.Incr(ctx, likeKey).Err(); err != nil {
		return 0, err
	}
	value, err := r.redisDB.Get(ctx, likeKey).Result()
	if err != nil {
		return 0, err
	}
	return strconv.Atoi(value)
}

func (r *Repo) GetLikeCount(ctx context.Context, articleID string) (int, error) {
	if r.redisDB == nil {
		return 0, redis.Nil
	}
	likeKey := "article:" + articleID + ":like"
	value, err := r.redisDB.Get(ctx, likeKey).Result()
	if err != nil {
		return 0, err
	}
	return strconv.Atoi(value)
}
