package points

import "time"

type PointsSummaryResponse struct {
	Balance    uint                    `json:"balance"`
	Privileges []UserPrivilegeResponse `json:"privileges"`
}

type UserPrivilegeResponse struct {
	PrivilegeKey string    `json:"privilegeKey"`
	Cost         uint      `json:"cost"`
	RedeemedAt   time.Time `json:"redeemedAt"`
}

type PointsRecordResponse struct {
	ID            uint      `json:"id"`
	Change        int       `json:"change"`
	BalanceAfter  uint      `json:"balanceAfter"`
	Direction     string    `json:"direction"`
	Source        string    `json:"source"`
	ReferenceType string    `json:"referenceType"`
	ReferenceID   uint      `json:"referenceId"`
	Description   string    `json:"description"`
	CreatedAt     time.Time `json:"createdAt"`
}

type CheckInResponse struct {
	Message       string `json:"message"`
	AwardedPoints uint   `json:"awardedPoints"`
	Balance       uint   `json:"balance"`
}

type UnlockArticleResponse struct {
	Message        string `json:"message"`
	ArticleID      uint   `json:"articleId"`
	DeductedPoints uint   `json:"deductedPoints"`
	Balance        uint   `json:"balance"`
}

type RedeemPrivilegeRequest struct {
	PrivilegeKey string `json:"privilegeKey" binding:"required"`
}

type RedeemPrivilegeResponse struct {
	Message      string `json:"message"`
	PrivilegeKey string `json:"privilegeKey"`
	Cost         uint   `json:"cost"`
	Balance      uint   `json:"balance"`
}
