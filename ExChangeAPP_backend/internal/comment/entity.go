package comment

import "gorm.io/gorm"

type Comment struct {
	gorm.Model
	ArticleID uint   `gorm:"not null;index"`
	UserID    uint   `gorm:"not null;index"`
	Content   string `gorm:"type:text;not null"`
}
