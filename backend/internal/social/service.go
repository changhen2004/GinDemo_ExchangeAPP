package social

import (
	"context"
	"errors"

	"gorm.io/gorm"
	"resource_community_go/internal/auth"
)

type Service struct {
	repo     *Repo
	authRepo *auth.Repo
}

func NewService(repo *Repo, authRepo *auth.Repo) *Service {
	return &Service{repo: repo, authRepo: authRepo}
}

func (s *Service) Follow(ctx context.Context, followerID, authorID uint) error {
	if err := s.validateFollowActors(followerID, authorID); err != nil {
		return err
	}
	if err := s.repo.CreateFollow(ctx, Follow{FollowerID: followerID, AuthorID: authorID}); err != nil {
		return err
	}
	s.repo.InvalidateFollowingFeed(ctx, followerID)
	return nil
}

func (s *Service) Unfollow(ctx context.Context, followerID, authorID uint) error {
	if err := s.validateFollowActors(followerID, authorID); err != nil {
		return err
	}
	if err := s.repo.DeleteFollow(ctx, followerID, authorID); err != nil {
		return err
	}
	s.repo.InvalidateFollowingFeed(ctx, followerID)
	return nil
}

func (s *Service) GetAuthorSocialStatus(ctx context.Context, viewerID, authorID uint) (AuthorSocialStatusResponse, error) {
	if authorID == 0 {
		return AuthorSocialStatusResponse{}, ErrInvalidAuthor
	}
	if _, err := s.authRepo.FindByID(authorID); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return AuthorSocialStatusResponse{}, ErrInvalidAuthor
		}
		return AuthorSocialStatusResponse{}, err
	}

	isFollowing, err := s.repo.IsFollowing(ctx, viewerID, authorID)
	if err != nil {
		return AuthorSocialStatusResponse{}, err
	}
	followerCount, err := s.repo.CountFollowers(ctx, authorID)
	if err != nil {
		return AuthorSocialStatusResponse{}, err
	}
	followingCount, err := s.repo.CountFollowing(ctx, authorID)
	if err != nil {
		return AuthorSocialStatusResponse{}, err
	}

	return AuthorSocialStatusResponse{
		AuthorID:       authorID,
		IsFollowing:    isFollowing,
		FollowerCount:  followerCount,
		FollowingCount: followingCount,
	}, nil
}

func (s *Service) validateFollowActors(followerID, authorID uint) error {
	if followerID == 0 {
		return ErrInvalidFollower
	}
	if authorID == 0 {
		return ErrInvalidAuthor
	}
	if followerID == authorID {
		return ErrCannotFollowSelf
	}
	if _, err := s.authRepo.FindByID(followerID); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrInvalidFollower
		}
		return err
	}
	if _, err := s.authRepo.FindByID(authorID); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrInvalidAuthor
		}
		return err
	}
	return nil
}
