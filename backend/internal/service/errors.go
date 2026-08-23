package service

import "errors"

var ErrNoteNotFound = errors.New("note not found")

var ErrNoUpdateFields = errors.New("no fields to update")
