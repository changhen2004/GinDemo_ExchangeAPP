package favorite

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
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
	ctx.JSON(status, responseEnvelope{
		Code:    0,
		Message: "success",
		Data:    data,
	})
}

func writeError(ctx *gin.Context, status int, code int, message, errorCode string) {
	ctx.JSON(status, responseEnvelope{
		Code:    code,
		Message: message,
		Data: errorData{
			ErrorCode: errorCode,
		},
	})
}

func (h *Handler) CreateFavorite(ctx *gin.Context) {
	resp, err := h.service.Create(ctx.Param("id"), ctx.GetUint("userID"))
	if err != nil {
		switch {
		case errors.Is(err, ErrArticleNotFound):
			writeError(ctx, http.StatusNotFound, 10003, "Article not found", "ARTICLE_NOT_FOUND")
		case errors.Is(err, ErrAlreadyFavorited):
			writeError(ctx, http.StatusConflict, 10008, err.Error(), "ALREADY_FAVORITED")
		default:
			writeError(ctx, http.StatusInternalServerError, 10005, err.Error(), "INTERNAL_ERROR")
		}
		return
	}

	writeSuccess(ctx, http.StatusCreated, resp)
}

func (h *Handler) DeleteFavorite(ctx *gin.Context) {
	resp, err := h.service.Delete(ctx.Param("id"), ctx.GetUint("userID"))
	if err != nil {
		switch {
		case errors.Is(err, ErrFavoriteNotFound):
			writeError(ctx, http.StatusNotFound, 10003, "Favorite not found", "FAVORITE_NOT_FOUND")
		default:
			writeError(ctx, http.StatusInternalServerError, 10005, err.Error(), "INTERNAL_ERROR")
		}
		return
	}

	writeSuccess(ctx, http.StatusOK, resp)
}

func (h *Handler) ListMyFavorites(ctx *gin.Context) {
	resp, err := h.service.ListByUserID(ctx.GetUint("userID"))
	if err != nil {
		writeError(ctx, http.StatusInternalServerError, 10005, err.Error(), "INTERNAL_ERROR")
		return
	}

	writeSuccess(ctx, http.StatusOK, resp)
}
