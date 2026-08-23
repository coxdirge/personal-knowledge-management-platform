package service

import (
	"errors"

	"github.com/coxdirge/personal-knowledge-management-platform/backend/internal/dto"
	"github.com/coxdirge/personal-knowledge-management-platform/backend/internal/model"
	"github.com/coxdirge/personal-knowledge-management-platform/backend/internal/repository"
	"gorm.io/gorm"
)

type NoteService struct {
	Repo *repository.NoteRepository
}

func NewNoteService(
	repo *repository.NoteRepository,
) *NoteService {

	return &NoteService{
		Repo: repo,
	}

}

func (s *NoteService) CreateNote(
	req dto.CreateNoteRequest,
) (*model.Note, error) {

	note := &model.Note{
		Title:   req.Title,
		Content: req.Content,
	}

	err := s.Repo.Create(note)

	if err != nil {
		return nil, err
	}

	return note, nil

}

func (s *NoteService) GetNotes() (
	[]model.Note,
	error,
) {

	return s.Repo.FindAll()

}

func (s *NoteService) GetNoteByID(
	id uint,
) (*model.Note, error) {

	note, err := s.Repo.FindByID(id)

	if err != nil {

		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrNoteNotFound
		}

		return nil, err
	}

	return note, nil

}

func (s *NoteService) UpdateNote(
	id uint,
	req dto.UpdateNoteRequest,
) (*model.Note, error) {

	note, err := s.Repo.FindByID(id)

	if err != nil {
		return nil, err
	}

	if req.Content == nil && req.Title == nil {
		return nil, ErrNoUpdateFields
	}

	if req.Title != nil {
		note.Title = *req.Title
	}

	if req.Content != nil {
		note.Content = *req.Content
	}

	err = s.Repo.Update(note)

	if err != nil {
		return nil, err
	}

	return note, nil

}

func (s *NoteService) DeleteNote(
	id uint,
) error {

	err := s.Repo.Delete(id)

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return ErrNoteNotFound
	}

	return err

}
