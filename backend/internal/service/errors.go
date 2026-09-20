// Package service contains business logic for the application.
package service

import "errors"

var ErrNoteNotFound = errors.New("note not found")

var ErrNoUpdateFields = errors.New("no fields to update")

var ErrNoteTitleRequired = errors.New("note title is required")

var ErrNoteTitleTooLong = errors.New("title is too long")

var ErrNoteContentTooLong = errors.New("content is too long")
