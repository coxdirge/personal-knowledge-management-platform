package model

import "time"

type Note struct {
	ID uint `gorm:"primaryKey"`

	Title string

	Content string

	CreatedAt time.Time

	UpdatedAt time.Time
}
