package favorite

import "strconv"

type Service struct {
	repo *Repo
}

func NewService(repo *Repo) *Service {
	return &Service{repo: repo}
}

func (s *Service) Create(articleID string, userID uint) (FavoriteActionResponse, error) {
	parsedArticleID, err := strconv.ParseUint(articleID, 10, 64)
	if err != nil {
		return FavoriteActionResponse{}, ErrArticleNotFound
	}

	exists, err := s.repo.ArticleExists(uint(parsedArticleID))
	if err != nil {
		return FavoriteActionResponse{}, err
	}
	if !exists {
		return FavoriteActionResponse{}, ErrArticleNotFound
	}

	hasFavorite, err := s.repo.HasFavorite(uint(parsedArticleID), userID)
	if err != nil {
		return FavoriteActionResponse{}, err
	}
	if hasFavorite {
		return FavoriteActionResponse{}, ErrAlreadyFavorited
	}

	count, err := s.repo.Create(uint(parsedArticleID), userID)
	if err != nil {
		return FavoriteActionResponse{}, err
	}

	return FavoriteActionResponse{
		Message:       "article favorited successfully",
		FavoriteCount: count,
	}, nil
}

func (s *Service) Delete(articleID string, userID uint) (FavoriteActionResponse, error) {
	parsedArticleID, err := strconv.ParseUint(articleID, 10, 64)
	if err != nil {
		return FavoriteActionResponse{}, ErrFavoriteNotFound
	}

	hasFavorite, err := s.repo.HasFavorite(uint(parsedArticleID), userID)
	if err != nil {
		return FavoriteActionResponse{}, err
	}
	if !hasFavorite {
		return FavoriteActionResponse{}, ErrFavoriteNotFound
	}

	count, err := s.repo.Delete(uint(parsedArticleID), userID)
	if err != nil {
		return FavoriteActionResponse{}, err
	}

	return FavoriteActionResponse{
		Message:       "article unfavorited successfully",
		FavoriteCount: count,
	}, nil
}

func (s *Service) ListByUserID(userID uint) ([]FavoriteArticleResponse, error) {
	return s.repo.ListByUserID(userID)
}
