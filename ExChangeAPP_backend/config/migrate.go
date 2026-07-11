package config

import (
	"exchangeapp/internal/article"
	"exchangeapp/internal/auth"
	"exchangeapp/internal/comment"
	"exchangeapp/internal/exchange"
	"exchangeapp/internal/favorite"
	"exchangeapp/internal/points"

	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&auth.User{},
		&article.Article{},
		&article.ArticleUnlock{},
		&comment.Comment{},
		&exchange.ExchangeRate{},
		&favorite.Favorite{},
		&points.PointLedger{},
		&points.UserCheckIn{},
		&points.UserPrivilege{},
	)
}
