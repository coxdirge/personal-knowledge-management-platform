package service

import (
	"errors"
	"strings"
	"testing"

	"github.com/coxdirge/personal-knowledge-management-platform/backend/internal/dto"
	"github.com/coxdirge/personal-knowledge-management-platform/backend/internal/model"
	"github.com/coxdirge/personal-knowledge-management-platform/backend/internal/repository"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func newTestNoteService(t *testing.T) *NoteService {
	t.Helper()

	db, err := gorm.Open(
		sqlite.Open(":memory:"),
		&gorm.Config{},
	)

	if err != nil {
		t.Fatalf("open test database: %v", err)
	}

	if err := db.AutoMigrate(&model.Note{}); err != nil {
		t.Fatalf("migrate test database: %v", err)
	}

	repo := repository.NewNoteRepository(db)

	return NewNoteService(repo)
}

func TestCreateNoteTrimsFields(t *testing.T) {
	service := newTestNoteService(t)

	note, err := service.CreateNote(dto.CreateNoteRequest{
		Title:   "  hello  ",
		Content: "  world  ",
	})

	if err != nil {
		t.Fatalf("CreateNote returned error: %v", err)
	}

	if note.Title != "hello" {
		t.Fatalf("expected trimmed title, got %q", note.Title)
	}

	if note.Content != "world" {
		t.Fatalf("expected trimmed content, got %q", note.Content)
	}
}

func TestCreateNoteRejectsEmptyTitle(t *testing.T) {
	service := newTestNoteService(t)

	_, err := service.CreateNote(dto.CreateNoteRequest{
		Title: "   ",
	})

	if !errors.Is(err, ErrNoteTitleRequired) {
		t.Fatalf(
			"expected ErrNoteTitleRequired, got %v",
			err,
		)
	}
}

func TestUpdateNoteRejectsNoFields(t *testing.T) {
	service := newTestNoteService(t)

	note, err := service.CreateNote(dto.CreateNoteRequest{
		Title:   "hello",
		Content: "world",
	})
	if err != nil {
		t.Fatalf("CreateNote returned error: %v", err)
	}

	_, err = service.UpdateNote(note.ID, dto.UpdateNoteRequest{})

	if !errors.Is(err, ErrNoUpdateFields) {
		t.Fatalf("expected ErrNoUpdateFields, got %v", err)
	}
}

func TestUpdateNoteRejectsExplicitEmptyTitle(t *testing.T) {
	service := newTestNoteService(t)

	note, err := service.CreateNote(dto.CreateNoteRequest{
		Title:   "hello",
		Content: "world",
	})
	if err != nil {
		t.Fatalf("CreateNote returned error: %v", err)
	}

	empty := "   "

	_, err = service.UpdateNote(note.ID, dto.UpdateNoteRequest{
		Title: &empty,
	})

	if !errors.Is(err, ErrNoteTitleRequired) {
		t.Fatalf("expected ErrNoteTitleRequired, got %v", err)
	}
}

func TestUpdateNotePartialUpdate(t *testing.T) {
	service := newTestNoteService(t)

	note, err := service.CreateNote(dto.CreateNoteRequest{
		Title:   "before",
		Content: "keep me",
	})
	if err != nil {
		t.Fatalf("CreateNote returned error: %v", err)
	}

	title := "after"

	updated, err := service.UpdateNote(note.ID, dto.UpdateNoteRequest{
		Title: &title,
	})
	if err != nil {
		t.Fatalf("UpdateNote returned error: %v", err)
	}

	if updated.Title != "after" {
		t.Fatalf("expected title %q, got %q", "after", updated.Title)
	}

	if updated.Content != "keep me" {
		t.Fatalf("expected content to remain unchanged, got %q", updated.Content)
	}
}

func TestGetNoteByIDReturnsNotFound(t *testing.T) {
	service := newTestNoteService(t)

	_, err := service.GetNoteByID(999)

	if !errors.Is(err, ErrNoteNotFound) {
		t.Fatalf("expected ErrNoteNotFound, got %v", err)
	}
}

func TestUpdateNoteReturnsNotFound(t *testing.T) {
	service := newTestNoteService(t)

	title := "missing"

	_, err := service.UpdateNote(999, dto.UpdateNoteRequest{
		Title: &title,
	})

	if !errors.Is(err, ErrNoteNotFound) {
		t.Fatalf("expected ErrNoteNotFound, got %v", err)
	}
}

func TestDeleteNoteReturnsNotFound(t *testing.T) {
	service := newTestNoteService(t)

	err := service.DeleteNote(999)

	if !errors.Is(err, ErrNoteNotFound) {
		t.Fatalf("expected ErrNoteNotFound, got %v", err)
	}
}

func TestCreateNoteRejectsTooLongTitle(t *testing.T) {
	service := newTestNoteService(t)

	title := strings.Repeat("a", 121)

	_, err := service.CreateNote(dto.CreateNoteRequest{
		Title: title,
	})

	if !errors.Is(err, ErrNoteTitleTooLong) {
		t.Fatalf("expected ErrNoteTitleTooLong, got %v", err)
	}
}

func TestCreateNoteRejectsTooLongContent(t *testing.T) {
	service := newTestNoteService(t)

	content := strings.Repeat("a", 10001)

	_, err := service.CreateNote(dto.CreateNoteRequest{
		Title:   "hello",
		Content: content,
	})

	if !errors.Is(err, ErrNoteContentTooLong) {
		t.Fatalf("expected ErrNoteContentTooLong, got %v", err)
	}
}
