package service

import (
	"errors"
	"strings"
	"unicode/utf8"

	"github.com/coxdirge/personal-knowledge-management-platform/backend/internal/dto"
	"github.com/coxdirge/personal-knowledge-management-platform/backend/internal/model"
	"github.com/coxdirge/personal-knowledge-management-platform/backend/internal/repository"
	"gorm.io/gorm"
)

const (
	maxNoteTitleLength   = 120
	maxNoteContentLength = 10_000
)

func normalizeAndValidateTitle(
	title string,
) (string, error) {

	title = strings.TrimSpace(title)

	if title == "" {
		return "", ErrNoteTitleRequired
	}

	if utf8.RuneCountInString(title) > maxNoteTitleLength {
		return "", ErrNoteTitleTooLong
	}

	return title, nil
}

func normalizeAndValidateContent(
	content string,
) (string, error) {

	content = strings.TrimSpace(content)

	if utf8.RuneCountInString(content) > maxNoteContentLength {
		return "", ErrNoteContentTooLong
	}

	return content, nil
}

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

	title, err := normalizeAndValidateTitle(req.Title)

	if err != nil {
		return nil, err
	}

	content, err := normalizeAndValidateContent(req.Content)

	if err != nil {
		return nil, err
	}

	note := &model.Note{
		Title:   title,
		Content: content,
	}

	err = s.Repo.Create(note)

	if err != nil {
		return nil, err
	}

	return note, nil

}

func (s *NoteService) GetNotes(
	query string,
) (
	[]model.Note,
	error,
) {

	query = strings.TrimSpace(query)

	if query == "" {
		return s.Repo.FindAll()
	}

	return s.Repo.Search(query)

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

		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrNoteNotFound
		}

		return nil, err
	}

	if req.Content == nil && req.Title == nil {
		return nil, ErrNoUpdateFields
	}

	if req.Title != nil {
		title, err := normalizeAndValidateTitle(*req.Title)

		if err != nil {
			return nil, err
		}

		note.Title = title
	}

	if req.Content != nil {
		content, err := normalizeAndValidateContent(*req.Content)

		if err != nil {
			return nil, err
		}

		note.Content = content
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
