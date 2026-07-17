package social

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

type responseEnvelope struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

type errorData struct {
	ErrorCode string `json:"errorCode"`
}

func writeSuccess(ctx *gin.Context, status int, data interface{}) {
	ctx.JSON(status, responseEnvelope{Code: 0, Message: "success", Data: data})
}

func writeError(ctx *gin.Context, status int, code int, message, errorCode string) {
	ctx.JSON(status, responseEnvelope{
		Code:    code,
		Message: message,
		Data:    errorData{ErrorCode: errorCode},
	})
}

func (h *Handler) FollowAuthor(ctx *gin.Context) {
	authorID, ok := parseAuthorIDParam(ctx)
	if !ok {
		return
	}
	viewerID := userIDFromContext(ctx)
	if err := h.service.Follow(ctx.Request.Context(), viewerID, authorID); err != nil {
		writeSocialError(ctx, err)
		return
	}
	status, err := h.service.GetAuthorSocialStatus(ctx.Request.Context(), viewerID, authorID)
	if err != nil {
		writeSocialError(ctx, err)
		return
	}
	writeSuccess(ctx, http.StatusOK, FollowActionResponse{Message: "followed", Status: status})
}

func (h *Handler) UnfollowAuthor(ctx *gin.Context) {
	authorID, ok := parseAuthorIDParam(ctx)
	if !ok {
		return
	}
	viewerID := userIDFromContext(ctx)
	if err := h.service.Unfollow(ctx.Request.Context(), viewerID, authorID); err != nil {
		writeSocialError(ctx, err)
		return
	}
	status, err := h.service.GetAuthorSocialStatus(ctx.Request.Context(), viewerID, authorID)
	if err != nil {
		writeSocialError(ctx, err)
		return
	}
	writeSuccess(ctx, http.StatusOK, FollowActionResponse{Message: "unfollowed", Status: status})
}

func (h *Handler) GetAuthorSocialStatus(ctx *gin.Context) {
	authorID, ok := parseAuthorIDParam(ctx)
	if !ok {
		return
	}
	status, err := h.service.GetAuthorSocialStatus(ctx.Request.Context(), currentUserIDFromRequest(ctx), authorID)
	if err != nil {
		writeSocialError(ctx, err)
		return
	}
	writeSuccess(ctx, http.StatusOK, status)
}

func parseAuthorIDParam(ctx *gin.Context) (uint, bool) {
	parsed, err := strconv.ParseUint(ctx.Param("id"), 10, 64)
	if err != nil || parsed == 0 {
		writeError(ctx, http.StatusBadRequest, 10001, "Invalid author id", "INVALID_REQUEST")
		return 0, false
	}
	return uint(parsed), true
}

func writeSocialError(ctx *gin.Context, err error) {
	switch {
	case errors.Is(err, ErrCannotFollowSelf):
		writeError(ctx, http.StatusBadRequest, 10030, err.Error(), "CANNOT_FOLLOW_SELF")
	case errors.Is(err, ErrInvalidAuthor), errors.Is(err, gorm.ErrRecordNotFound):
		writeError(ctx, http.StatusNotFound, 10031, "Author not found", "AUTHOR_NOT_FOUND")
	case errors.Is(err, ErrInvalidFollower):
		writeError(ctx, http.StatusUnauthorized, 10002, "Unauthorized", "UNAUTHORIZED")
	default:
		writeError(ctx, http.StatusInternalServerError, 10005, err.Error(), "INTERNAL_ERROR")
	}
}

func userIDFromContext(ctx *gin.Context) uint {
	value, exists := ctx.Get("userID")
	if !exists {
		return 0
	}
	userID, ok := value.(uint)
	if !ok {
		return 0
	}
	return userID
}

func currentUserIDFromRequest(ctx *gin.Context) uint {
	return userIDFromContext(ctx)
}
