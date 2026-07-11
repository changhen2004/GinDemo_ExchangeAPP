package middlewares

import (
	"exchangeapp/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type responseEnvelope struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

type errorData struct {
	ErrorCode string `json:"errorCode"`
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

func AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		token := ctx.GetHeader("Authorization")
		if token == "" {
			writeError(ctx, http.StatusUnauthorized, 10002, "Authorization header is missing", "UNAUTHORIZED")
			ctx.Abort()
			return
		}

		username, err := utils.ParseJWT(token)
		if err != nil {
			writeError(ctx, http.StatusUnauthorized, 10002, err.Error(), "UNAUTHORIZED")
			ctx.Abort()
			return
		}
		ctx.Set("username", username)
		ctx.Next()
	}
}
