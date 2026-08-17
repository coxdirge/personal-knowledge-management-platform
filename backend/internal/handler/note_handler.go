package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/coxdirge/personal-knowledge-management-platform/backend/internal/model"
	"github.com/coxdirge/personal-knowledge-management-platform/backend/internal/service"
)

type NoteHandler struct {
	Service *service.NoteService
}

func NewNoteHandler(
	service *service.NoteService,
) *NoteHandler {

	return &NoteHandler{
		Service: service,
	}

}

func (h *NoteHandler) CreateNote(c *gin.Context) {

	var note model.Note

	if err := c.ShouldBindJSON(&note); err != nil {

		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error": err.Error(),
			},
		)

		return
	}

	err := h.Service.CreateNote(&note)

	if err != nil {

		c.JSON(
			http.StatusInternalServerError,
			gin.H{
				"error": err.Error(),
			},
		)

		return
	}

	c.JSON(
		http.StatusCreated,
		note,
	)

}
