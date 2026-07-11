package favorite

import "gorm.io/gorm"

type Favorite struct {
	gorm.Model
	ArticleID uint `gorm:"not null;index:idx_favorites_article_user,unique"`
	UserID    uint `gorm:"not null;index:idx_favorites_article_user,unique"`
}
