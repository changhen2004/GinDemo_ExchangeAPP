package favorite

import "time"

type FavoriteActionResponse struct {
	Message       string `json:"message"`
	FavoriteCount uint   `json:"favoriteCount"`
}

type FavoriteArticleAuthorResponse struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
}

type FavoriteArticleResponse struct {
	ArticleID      uint                          `json:"articleId"`
	Title          string                        `json:"title"`
	Preview        string                        `json:"preview"`
	Tags           []string                      `json:"tags"`
	FavoriteCount  uint                          `json:"favoriteCount"`
	IsFree         bool                          `json:"isFree"`
	RequiredPoints uint                          `json:"requiredPoints"`
	Author         FavoriteArticleAuthorResponse `json:"author"`
	FavoritedAt    time.Time                     `json:"favoritedAt"`
}
