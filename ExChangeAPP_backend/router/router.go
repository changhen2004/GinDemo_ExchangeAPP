package router

import (
	"exchangeapp/global"
	internalArticle "exchangeapp/internal/article"
	internalAuth "exchangeapp/internal/auth"
	internalExchange "exchangeapp/internal/exchange"
	"exchangeapp/middlewares"
	"time"

	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"
)

func SetUpRouter() *gin.Engine {
	r := gin.Default()

	authHandler := internalAuth.NewHandler(
		internalAuth.NewService(
			internalAuth.NewRepo(global.DB),
		),
	)
	articleHandler := internalArticle.NewHandler(
		internalArticle.NewService(
			internalArticle.NewRepo(global.DB, global.RedisDB),
		),
	)
	exchangeHandler := internalExchange.NewHandler(
		internalExchange.NewService(
			internalExchange.NewRepo(global.DB),
		),
	)

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"PUT", "PATCH", "GET", "POST"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	auth := r.Group("/api/auth")
	{
		auth.POST("/login", authHandler.Login)
		auth.POST("/register", authHandler.Register)
	}

	publicAPI := r.Group("/api")
	{
		publicAPI.GET("/exchangeRates", exchangeHandler.GetExchangeRate)
		publicAPI.GET("/articles", articleHandler.GetArticles)
		publicAPI.GET("/articles/:id", articleHandler.GetArticleByID)
		publicAPI.GET("/articles/:id/like", articleHandler.GetArticleLikes)
	}

	protectedAPI := r.Group("/api")
	protectedAPI.Use(middlewares.AuthMiddleware())
	{
		protectedAPI.POST("/exchangeRates", exchangeHandler.CreateExchangeRate)
		protectedAPI.POST("/articles", articleHandler.CreateArticle)
		protectedAPI.POST("/articles/:id/like", articleHandler.LikeArticle)
	}
	return r
}
