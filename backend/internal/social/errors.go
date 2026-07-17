package social

import "errors"

var (
	ErrCannotFollowSelf = errors.New("cannot follow self")
	ErrInvalidAuthor    = errors.New("invalid author")
	ErrInvalidFollower  = errors.New("invalid follower")
)
