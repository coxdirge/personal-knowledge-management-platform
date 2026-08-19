package main

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/coxdirge/personal-knowledge-management-platform/backend/internal/database"
	"github.com/coxdirge/personal-knowledge-management-platform/backend/internal/handler"
	"github.com/coxdirge/personal-knowledge-management-platform/backend/internal/model"
	"github.com/coxdirge/personal-knowledge-management-platform/backend/internal/repository"
	"github.com/coxdirge/personal-knowledge-management-platform/backend/internal/service"
)

func main() {

	// =========================
	// 1. Database 初始化
	// =========================

	err := database.Connect()

	if err != nil {
		panic(err)
	}

	// 开发阶段使用
	// 自动根据 model 创建表

	err = database.DB.AutoMigrate(
		&model.Note{},
	)

	if err != nil {
		panic(err)
	}

	// =========================
	// 2. Dependency Injection
	// =========================

	noteRepository := repository.NewNoteRepository(
		database.DB,
	)

	noteService := service.NewNoteService(
		noteRepository,
	)

	noteHandler := handler.NewNoteHandler(
		noteService,
	)

	// =========================
	// 3. Gin 初始化
	// =========================

	r := gin.Default()

	// =========================
	// 4. Middleware
	// =========================

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

	// =========================
	// 5. Routes
	// =========================

	api := r.Group("/api")

	{

		api.POST(
			"/notes",
			noteHandler.CreateNote,
		)

		api.GET(
			"/notes",
			noteHandler.GetNotes,
		)

		api.GET(
			"/notes/:id",
			noteHandler.GetNoteByID,
		)

		api.PUT(
			"/notes/:id",
			noteHandler.UpdateNote,
		)

		api.DELETE(
			"/notes/:id",
			noteHandler.DeleteNote,
		)

	}

	// 测试接口
	r.GET("/api/hello", func(c *gin.Context) {

		c.JSON(
			http.StatusOK,
			gin.H{
				"message": "hello from backend",
			},
		)

	})

	// =========================
	// 6. Start Server
	// =========================

	r.Run(":8080")
}
