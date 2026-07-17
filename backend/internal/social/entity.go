package social

import "time"

type Follow struct {
	ID         uint      `gorm:"primaryKey"`
	FollowerID uint      `gorm:"not null;index:idx_follows_follower;uniqueIndex:idx_follows_follower_author"`
	AuthorID   uint      `gorm:"not null;index:idx_follows_author;uniqueIndex:idx_follows_follower_author"`
	CreatedAt  time.Time `gorm:"not null"`
	UpdatedAt  time.Time `gorm:"not null"`
}
