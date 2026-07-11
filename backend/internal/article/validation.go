package article

import (
	"errors"
	"strings"
	"unicode/utf8"

	internalMedia "resource_community_go/internal/media"
)

const (
	articleContentMaxLength  = 20000
	articleRequiredPointsMax = 10000
)

func ValidateCreateArticleRequest(req CreateArticleRequest) error {
	if utf8.RuneCountInString(strings.TrimSpace(req.Title)) == 0 {
		return errors.New("title must not be empty")
	}
	if utf8.RuneCountInString(strings.TrimSpace(req.Preview)) == 0 {
		return errors.New("preview must not be empty")
	}

	contentLength := utf8.RuneCountInString(strings.TrimSpace(req.Content))
	if contentLength == 0 {
		return errors.New("content must not be empty")
	}
	if contentLength > articleContentMaxLength {
		return errors.New("content exceeds maximum length of 20000 characters")
	}

	if req.RequiredPoints > articleRequiredPointsMax {
		return errors.New("requiredPoints must be between 0 and 10000")
	}

	if req.IsFree != nil {
		if *req.IsFree && req.RequiredPoints > 0 {
			return errors.New("free article must not set requiredPoints")
		}
		if !*req.IsFree && req.RequiredPoints == 0 {
			return errors.New("paid article must set requiredPoints greater than 0")
		}
	}

	if len(normalizeContentImages(req.ContentImages)) > internalMedia.ContentImageMaxCount {
		return ErrTooManyContentImages
	}
	return nil
}
