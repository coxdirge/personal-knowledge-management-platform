package service

import (
	"github.com/coxdirge/personal-knowledge-management-platform/backend/internal/model"
	"github.com/coxdirge/personal-knowledge-management-platform/backend/internal/repository"
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
	note *model.Note,
) error {

	return s.Repo.Create(note)

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

	return s.Repo.FindByID(id)

}

func (s *NoteService) UpdateNote(
	note *model.Note,
) error {

	return s.Repo.Update(note)

}

func (s *NoteService) DeleteNote(
	id uint,
) error {

	return s.Repo.Delete(id)

}
