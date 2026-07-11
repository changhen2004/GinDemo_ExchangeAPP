package article

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

func (h *Handler) CreateArticle(ctx *gin.Context) {
	var req CreateArticleRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		writeError(ctx, http.StatusBadRequest, 10001, err.Error(), "INVALID_REQUEST")
		return
	}

	resp, err := h.service.Create(ctx, req)
	if err != nil {
		writeError(ctx, http.StatusInternalServerError, 10005, err.Error(), "INTERNAL_ERROR")
		return
	}
	writeSuccess(ctx, http.StatusCreated, resp)
}

func (h *Handler) GetArticles(ctx *gin.Context) {
	resp, err := h.service.List(ctx)
	if err != nil {
		switch {
		case errors.Is(err, ErrArticleNotFound):
			writeError(ctx, http.StatusNotFound, 10003, "No articles found", "ARTICLE_NOT_FOUND")
		default:
			writeError(ctx, http.StatusInternalServerError, 10005, err.Error(), "INTERNAL_ERROR")
		}
		return
	}
	writeSuccess(ctx, http.StatusOK, resp)
}

func (h *Handler) GetArticleByID(ctx *gin.Context) {
	resp, err := h.service.FindByID(ctx.Param("id"))
	if err != nil {
		switch {
		case errors.Is(err, ErrArticleNotFound):
			writeError(ctx, http.StatusNotFound, 10003, "Article not found", "ARTICLE_NOT_FOUND")
		default:
			writeError(ctx, http.StatusInternalServerError, 10005, err.Error(), "INTERNAL_ERROR")
		}
		return
	}
	writeSuccess(ctx, http.StatusOK, resp)
}

func (h *Handler) LikeArticle(ctx *gin.Context) {
	resp, err := h.service.Like(ctx, ctx.Param("id"))
	if err != nil {
		switch {
		case errors.Is(err, ErrRedisUnavailable):
			writeError(ctx, http.StatusInternalServerError, 10006, err.Error(), "REDIS_UNAVAILABLE")
		default:
			writeError(ctx, http.StatusInternalServerError, 10005, err.Error(), "INTERNAL_ERROR")
		}
		return
	}
	writeSuccess(ctx, http.StatusOK, resp)
}

func (h *Handler) GetArticleLikes(ctx *gin.Context) {
	resp, err := h.service.GetLikes(ctx, ctx.Param("id"))
	if err != nil {
		writeError(ctx, http.StatusInternalServerError, 10006, err.Error(), "REDIS_UNAVAILABLE")
		return
	}
	writeSuccess(ctx, http.StatusOK, resp)
}
