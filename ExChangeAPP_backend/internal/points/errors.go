package points

import "errors"

var (
	ErrUserNotFound             = errors.New("user not found")
	ErrArticleNotFound          = errors.New("article not found")
	ErrAlreadyCheckedInToday    = errors.New("already checked in today")
	ErrInsufficientPoints       = errors.New("insufficient points")
	ErrAlreadyUnlocked          = errors.New("article already unlocked")
	ErrPrivilegeNotFound        = errors.New("privilege not found")
	ErrPrivilegeAlreadyRedeemed = errors.New("privilege already redeemed")
)
