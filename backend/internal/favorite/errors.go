package favorite

import "errors"

var (
	ErrArticleNotFound  = errors.New("article not found")
	ErrAlreadyFavorited = errors.New("article already favorited")
	ErrFavoriteNotFound = errors.New("favorite not found")
)
