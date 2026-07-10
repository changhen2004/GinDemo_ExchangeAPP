package config

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

type Config struct {
	App struct {
		Name string
		Port string
	}
	Redis struct {
		Addr     string
		Password string
		DB       int
	}
	Database struct {
		DSN string
	}
}

var AppConfig *Config

func InitConfig() {
	var ctx *gin.Context
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./config")

	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("Error reading config file, %v", err)
	}

	AppConfig = &Config{}
	if err := viper.Unmarshal(&AppConfig); err != nil {
		log.Fatalf("unable to decode into struct, %v", err)
	}

	InitDB()
	InitRedis(ctx)
}
