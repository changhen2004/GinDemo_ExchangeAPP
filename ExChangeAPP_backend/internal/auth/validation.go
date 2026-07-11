package auth

import (
	"errors"
	"strings"
	"unicode"
	"unicode/utf8"
)

const (
	usernameMinLength = 3
	usernameMaxLength = 20
	passwordMinLength = 8
	passwordMaxLength = 72
)

func ValidateCredentials(username, password string) error {
	if err := ValidateUsername(username); err != nil {
		return err
	}
	return ValidatePassword(password)
}

func ValidateUsername(username string) error {
	trimmed := strings.TrimSpace(username)
	length := utf8.RuneCountInString(trimmed)
	if length < usernameMinLength || length > usernameMaxLength {
		return errors.New("username must be 3-20 characters")
	}
	if trimmed != username {
		return errors.New("username must not contain leading or trailing spaces")
	}
	return nil
}

func ValidatePassword(password string) error {
	length := utf8.RuneCountInString(password)
	if length < passwordMinLength || length > passwordMaxLength {
		return errors.New("password must be 8-72 characters")
	}

	hasLetter := false
	hasDigit := false
	for _, r := range password {
		if unicode.IsSpace(r) {
			return errors.New("password must not contain spaces")
		}
		if unicode.IsLetter(r) {
			hasLetter = true
		}
		if unicode.IsDigit(r) {
			hasDigit = true
		}
	}

	if !hasLetter || !hasDigit {
		return errors.New("password must include both letters and numbers")
	}
	return nil
}
