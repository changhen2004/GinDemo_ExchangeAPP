package app

import (
	"fmt"
	"net"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

type rateLimitScope string

const (
	rateLimitScopeIP   rateLimitScope = "ip"
	rateLimitScopeUser rateLimitScope = "user"
)

type rateLimitRule struct {
	Name   string
	Limit  int64
	Window time.Duration
	Scope  rateLimitScope
}

var (
	registerRateLimitRule = rateLimitRule{
		Name:   "auth_register",
		Limit:  5,
		Window: time.Minute,
		Scope:  rateLimitScopeIP,
	}
	loginRateLimitRule = rateLimitRule{
		Name:   "auth_login",
		Limit:  10,
		Window: time.Minute,
		Scope:  rateLimitScopeIP,
	}
	publishRateLimitRule = rateLimitRule{
		Name:   "content_publish",
		Limit:  10,
		Window: time.Minute,
		Scope:  rateLimitScopeUser,
	}
	commentRateLimitRule = rateLimitRule{
		Name:   "content_comment",
		Limit:  20,
		Window: time.Minute,
		Scope:  rateLimitScopeUser,
	}
	checkInRateLimitRule = rateLimitRule{
		Name:   "points_checkin",
		Limit:  2,
		Window: time.Minute,
		Scope:  rateLimitScopeUser,
	}
)

func RateLimitMiddleware(redisDB *redis.Client, rule rateLimitRule) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		if redisDB == nil || rule.Limit < 1 || rule.Window <= 0 {
			ctx.Next()
			return
		}

		identifier := rateLimitIdentifier(ctx, rule.Scope)
		key := fmt.Sprintf("rate_limit:%s:%s", rule.Name, identifier)

		count, err := redisDB.Incr(ctx, key).Result()
		if err != nil {
			ctx.Next()
			return
		}
		if count == 1 {
			_ = redisDB.Expire(ctx, key, rule.Window).Err()
		}
		if count <= rule.Limit {
			ctx.Next()
			return
		}

		if ttl, ttlErr := redisDB.TTL(ctx, key).Result(); ttlErr == nil && ttl > 0 {
			ctx.Header("Retry-After", strconv.Itoa(int(ttl.Seconds())))
		}
		writeError(ctx, http.StatusTooManyRequests, 10014, "Too many requests", "RATE_LIMITED")
		ctx.Abort()
	}
}

func rateLimitIdentifier(ctx *gin.Context, scope rateLimitScope) string {
	if scope == rateLimitScopeUser {
		if userID := ctx.GetUint("userID"); userID > 0 {
			return fmt.Sprintf("user:%d", userID)
		}
	}
	ip := ctx.ClientIP()
	if ip != "" {
		return "ip:" + ip
	}
	host, _, err := net.SplitHostPort(ctx.Request.RemoteAddr)
	if err == nil && host != "" {
		return "ip:" + host
	}
	return "ip:unknown"
}
