package article

import "errors"

var (
	ErrArticleNotFound  = errors.New("article not found")
	ErrRedisUnavailable = errors.New("redis is not initialized")
)
