package config

import (
	"exchangeapp/global"
	"log"
	
	"github.com/redis/go-redis/v9"
	"github.com/gin-gonic/gin"
)
var RedisClient *redis.Client

func InitRedis(ctx *gin.Context) {
	RedisClient := redis.NewClient(&redis.Options{
		Addr:     AppConfig.Redis.Addr,
		Password: AppConfig.Redis.Password,
		DB:       AppConfig.Redis.DB,
	})

	
	_, err := RedisClient.Ping(ctx).Result()
	if err != nil {
		log.Fatalf("Redis connection failed: %v", err)
	}

	global.RedisDB = RedisClient
}
