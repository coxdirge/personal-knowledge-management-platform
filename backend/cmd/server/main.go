package main

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/coxdirge/personal-knowledge-management-platform/backend/internal/database"
	"github.com/coxdirge/personal-knowledge-management-platform/backend/internal/model"
)

func main() {
	err := database.Connect()

	if err != nil {
		panic(err)
	}

	err = database.DB.AutoMigrate(
		&model.Note{},
	)

	if err != nil {
		panic(err)
	}

	r := gin.Default()

	// CORS 配置
	// 允许前端 React 开发服务器访问后端 API
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:5173",
			"http://localhost:5174",
		},
		AllowMethods: []string{
			"GET",
			"POST",
			"PUT",
			"DELETE",
		},
		AllowHeaders: []string{
			"Origin",
			"Content-Type",
			"Authorization",
		},
	}))

	// 测试 API
	r.GET("/api/hello", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "hello from backend",
		})
	})

	// 启动服务器
	r.Run(":8080")
}
