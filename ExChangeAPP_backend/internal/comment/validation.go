package comment

import (
	"errors"
	"strings"
	"unicode/utf8"
)

const commentContentMaxLength = 1000

func ValidateCreateCommentRequest(req CreateCommentRequest) error {
	contentLength := utf8.RuneCountInString(strings.TrimSpace(req.Content))
	if contentLength == 0 {
		return errors.New("content must not be empty")
	}
	if contentLength > commentContentMaxLength {
		return errors.New("content exceeds maximum length of 1000 characters")
	}
	return nil
}
