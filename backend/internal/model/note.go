package model

import "time"

type Note struct {
	ID uint

	Title string

	Content string

	CreatedAt time.Time

	UpdatedAt time.Time
}
