package points

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

func (h *Handler) GetMyPoints(ctx *gin.Context) {
	resp, err := h.service.GetSummary(ctx.GetUint("userID"))
	if err != nil {
		writeError(ctx, http.StatusInternalServerError, 10005, err.Error(), "INTERNAL_ERROR")
		return
	}
	writeSuccess(ctx, http.StatusOK, resp)
}

func (h *Handler) GetMyPointsRecords(ctx *gin.Context) {
	resp, err := h.service.ListRecords(ctx.GetUint("userID"))
	if err != nil {
		writeError(ctx, http.StatusInternalServerError, 10005, err.Error(), "INTERNAL_ERROR")
		return
	}
	writeSuccess(ctx, http.StatusOK, resp)
}

func (h *Handler) CheckIn(ctx *gin.Context) {
	resp, err := h.service.CheckIn(ctx.GetUint("userID"))
	if err != nil {
		switch {
		case errors.Is(err, ErrAlreadyCheckedInToday):
			writeError(ctx, http.StatusConflict, 10009, err.Error(), "ALREADY_CHECKED_IN")
		default:
			writeError(ctx, http.StatusInternalServerError, 10005, err.Error(), "INTERNAL_ERROR")
		}
		return
	}
	writeSuccess(ctx, http.StatusOK, resp)
}

func (h *Handler) UnlockArticle(ctx *gin.Context) {
	resp, err := h.service.UnlockArticle(ctx.GetUint("userID"), ctx.Param("id"))
	if err != nil {
		switch {
		case errors.Is(err, ErrArticleNotFound):
			writeError(ctx, http.StatusNotFound, 10003, "Article not found", "ARTICLE_NOT_FOUND")
		case errors.Is(err, ErrInsufficientPoints):
			writeError(ctx, http.StatusBadRequest, 10010, err.Error(), "INSUFFICIENT_POINTS")
		case errors.Is(err, ErrAlreadyUnlocked):
			writeError(ctx, http.StatusConflict, 10011, err.Error(), "ALREADY_UNLOCKED")
		default:
			writeError(ctx, http.StatusInternalServerError, 10005, err.Error(), "INTERNAL_ERROR")
		}
		return
	}
	writeSuccess(ctx, http.StatusOK, resp)
}

func (h *Handler) RedeemPrivilege(ctx *gin.Context) {
	var req RedeemPrivilegeRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		writeError(ctx, http.StatusBadRequest, 10001, err.Error(), "INVALID_REQUEST")
		return
	}

	resp, err := h.service.RedeemPrivilege(ctx.GetUint("userID"), req)
	if err != nil {
		switch {
		case errors.Is(err, ErrPrivilegeNotFound):
			writeError(ctx, http.StatusNotFound, 10003, err.Error(), "PRIVILEGE_NOT_FOUND")
		case errors.Is(err, ErrPrivilegeAlreadyRedeemed):
			writeError(ctx, http.StatusConflict, 10012, err.Error(), "PRIVILEGE_ALREADY_REDEEMED")
		case errors.Is(err, ErrInsufficientPoints):
			writeError(ctx, http.StatusBadRequest, 10010, err.Error(), "INSUFFICIENT_POINTS")
		default:
			writeError(ctx, http.StatusInternalServerError, 10005, err.Error(), "INTERNAL_ERROR")
		}
		return
	}
	writeSuccess(ctx, http.StatusOK, resp)
}
