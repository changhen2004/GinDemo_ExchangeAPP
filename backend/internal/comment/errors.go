package comment

import "errors"

var (
	ErrArticleNotFound = errors.New("article not found")
	ErrCommentNotFound = errors.New("comment not found")
	ErrForbidden       = errors.New("no permission to delete comment")
)
