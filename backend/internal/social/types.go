package social

type AuthorSocialStatusResponse struct {
	AuthorID       uint  `json:"authorId"`
	IsFollowing    bool  `json:"isFollowing"`
	FollowerCount  int64 `json:"followerCount"`
	FollowingCount int64 `json:"followingCount"`
}

type FollowActionResponse struct {
	Message string                     `json:"message"`
	Status  AuthorSocialStatusResponse `json:"status"`
}
