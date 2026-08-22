package dto

import (
	"time"

	"github.com/coxdirge/personal-knowledge-management-platform/backend/internal/model"
)

type CreateNoteRequest struct {
	Title   string `json:"title" binding:"required"`
	Content string `json:"content"`
}

type UpdateNoteRequest struct {
	Title   *string `json:"title"`
	Content *string `json:"content"`
}

type NoteResponse struct {
	ID uint `json:"id"`

	Title string `json:"title"`

	Content string `json:"content"`

	CreatedAt time.Time `json:"created_at"`

	UpdatedAt time.Time `json:"updated_at"`
}

func ToNoteResponse(note *model.Note) NoteResponse {
	return NoteResponse{
		ID:        note.ID,
		Title:     note.Title,
		Content:   note.Content,
		CreatedAt: note.CreatedAt,
		UpdatedAt: note.UpdatedAt,
	}
}
