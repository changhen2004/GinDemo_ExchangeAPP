package article

import (
	"context"
	"encoding/json"
	"errors"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

const CacheKey = "articles"

type Service struct {
	repo *Repo
}

func NewService(repo *Repo) *Service {
	return &Service{repo: repo}
}

func (s *Service) Create(ctx context.Context, req CreateArticleRequest) (ArticleResponse, error) {
	article := &Article{
		Title:   req.Title,
		Content: req.Content,
		Preview: req.Preview,
		Status:  req.Status,
	}
	if article.Status == "" {
		article.Status = "draft"
	}

	if err := s.repo.Create(article); err != nil {
		return ArticleResponse{}, err
	}
	s.repo.DeleteArticlesCache(ctx, CacheKey)

	return toArticleResponse(*article), nil
}

func (s *Service) List(ctx context.Context) ([]ArticleResponse, error) {
	cached, err := s.repo.GetArticlesCache(ctx, CacheKey)
	if err == nil {
		var responses []ArticleResponse
		if unmarshalErr := json.Unmarshal([]byte(cached), &responses); unmarshalErr == nil {
			return responses, nil
		}
	}

	articles, err := s.repo.List()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrArticleNotFound
		}
		return nil, err
	}

	responses := toArticleResponses(articles)
	if payload, marshalErr := json.Marshal(responses); marshalErr == nil {
		s.repo.SetArticlesCache(ctx, CacheKey, string(payload))
	}
	return responses, nil
}

func (s *Service) FindByID(id string) (ArticleResponse, error) {
	article, err := s.repo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ArticleResponse{}, ErrArticleNotFound
		}
		return ArticleResponse{}, err
	}

	return toArticleResponse(*article), nil
}

func (s *Service) Like(ctx context.Context, articleID string) (LikeActionResponse, error) {
	likes, err := s.repo.IncrementLike(ctx, articleID)
	if err != nil {
		if errors.Is(err, redis.Nil) {
			return LikeActionResponse{}, ErrRedisUnavailable
		}
		return LikeActionResponse{}, err
	}

	return LikeActionResponse{
		Message: "Article liked successfully",
		Likes:   likes,
	}, nil
}

func (s *Service) GetLikes(ctx context.Context, articleID string) (LikeResponse, error) {
	likes, err := s.repo.GetLikeCount(ctx, articleID)
	if err != nil {
		if errors.Is(err, redis.Nil) {
			return LikeResponse{Likes: 0}, nil
		}
		return LikeResponse{}, err
	}
	return LikeResponse{Likes: likes}, nil
}
