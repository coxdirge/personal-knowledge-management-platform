// Package handler handles HTTP requests and dispatches business logic to service layer.
package handler

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/coxdirge/personal-knowledge-management-platform/backend/internal/dto"
	"github.com/coxdirge/personal-knowledge-management-platform/backend/internal/response"
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

func isNoteValidationError(err error) bool {
	return errors.Is(err, service.ErrNoUpdateFields) ||
		errors.Is(err, service.ErrNoteTitleRequired) ||
		errors.Is(err, service.ErrNoteTitleTooLong) ||
		errors.Is(err, service.ErrNoteContentTooLong)
}

func (h *NoteHandler) CreateNote(c *gin.Context) {

	var req dto.CreateNoteRequest

	if err := c.ShouldBindJSON(&req); err != nil {

		response.Error(
			c,
			http.StatusBadRequest,
			err.Error(),
		)

		return
	}

	note, err := h.Service.CreateNote(req)

	if err != nil {

		if isNoteValidationError(err) {

			response.Error(
				c,
				http.StatusBadRequest,
				err.Error(),
			)

			return
		}

		response.Error(
			c,
			http.StatusInternalServerError,
			"internal server error",
		)

		return
	}

	response.Success(
		c,
		http.StatusCreated,
		dto.ToNoteResponse(note),
	)

}

func (h *NoteHandler) GetNotes(c *gin.Context) {

	query := c.Query("q")

	notes, err := h.Service.GetNotes(query)

	if err != nil {

		response.Error(
			c,
			http.StatusInternalServerError,
			"internal server error",
		)

		return
	}

	responses := make([]dto.NoteResponse, len(notes))

	for i := range notes {
		responses[i] = dto.ToNoteResponse(&notes[i])
	}

	response.Success(
		c,
		http.StatusOK,
		responses,
	)

}

func (h *NoteHandler) GetNoteByID(c *gin.Context) {

	idParam := c.Param("id")

	id, err := strconv.ParseUint(
		idParam,
		10,
		64,
	)

	if err != nil {

		response.Error(
			c,
			http.StatusBadRequest,
			"invalid note id",
		)

		return
	}

	note, err := h.Service.GetNoteByID(
		uint(id),
	)

	if err != nil {

		if errors.Is(err, service.ErrNoteNotFound) {

			response.Error(
				c,
				http.StatusNotFound,
				err.Error(),
			)

			return
		}

		response.Error(
			c,
			http.StatusInternalServerError,
			"internal server error",
		)

		return
	}

	response.Success(
		c,
		http.StatusOK,
		dto.ToNoteResponse(note),
	)

}

func (h *NoteHandler) UpdateNote(c *gin.Context) {

	idParam := c.Param("id")

	id, err := strconv.ParseUint(
		idParam,
		10,
		64,
	)

	if err != nil {

		response.Error(
			c,
			http.StatusBadRequest,
			err.Error(),
		)

		return
	}

	var req dto.UpdateNoteRequest

	if err := c.ShouldBindJSON(&req); err != nil {

		response.Error(
			c,
			http.StatusBadRequest,
			err.Error(),
		)

		return
	}

	note, err := h.Service.UpdateNote(uint(id), req)

	if err != nil {

		if errors.Is(err, service.ErrNoteNotFound) {

			response.Error(
				c,
				http.StatusNotFound,
				err.Error(),
			)

			return
		}

		if isNoteValidationError(err) {

			response.Error(
				c,
				http.StatusBadRequest,
				err.Error(),
			)

			return
		}

		response.Error(
			c,
			http.StatusInternalServerError,
			"internal server error",
		)

		return
	}

	response.Success(
		c,
		http.StatusOK,
		dto.ToNoteResponse(note),
	)

}

func (h *NoteHandler) DeleteNote(c *gin.Context) {

	idParam := c.Param("id")

	id, err := strconv.ParseUint(
		idParam,
		10,
		64,
	)

	if err != nil {

		response.Error(
			c,
			http.StatusBadRequest,
			"invalid note id",
		)

		return
	}

	err = h.Service.DeleteNote(
		uint(id),
	)

	if err != nil {

		if errors.Is(
			err,
			service.ErrNoteNotFound,
		) {
			response.Error(
				c,
				http.StatusNotFound,
				err.Error(),
			)

			return
		}

		response.Error(
			c,
			http.StatusInternalServerError,
			"internal server error",
		)

		return
	}

	response.NoContent(c)

}
