package comment

import "time"

type CreateCommentRequest struct {
	Content string `json:"content" binding:"required,max=1000"`
}

type CommentAuthorResponse struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
}

type CommentResponse struct {
	ID        uint                  `json:"id"`
	ArticleID uint                  `json:"articleId"`
	UserID    uint                  `json:"userId"`
	Content   string                `json:"content"`
	Author    CommentAuthorResponse `json:"author"`
	CreatedAt time.Time             `json:"createdAt"`
	UpdatedAt time.Time             `json:"updatedAt"`
}

type DeleteCommentResponse struct {
	Message string `json:"message"`
}
