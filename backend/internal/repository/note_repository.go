package repository

import (
	"github.com/coxdirge/personal-knowledge-management-platform/backend/internal/model"
	"gorm.io/gorm"
)

type NoteRepository struct {
	DB *gorm.DB
}

func NewNoteRepository(db *gorm.DB) *NoteRepository {
	return &NoteRepository{
		DB: db,
	}
}

func (r *NoteRepository) Create(note *model.Note) error {

	return r.DB.Create(note).Error

}

func (r *NoteRepository) FindAll() ([]model.Note, error) {

	var notes []model.Note

	err := r.DB.
		Order("updated_at DESC").
		Find(&notes).
		Error

	return notes, err
}

func (r *NoteRepository) FindByID(id uint) (*model.Note, error) {

	var note model.Note

	// SELECT *
	// FROM notes
	// WHERE id = 1
	// LIMIT 1;
	err := r.DB.First(&note, id).Error

	if err != nil {
		return nil, err
	}

	return &note, nil
}

func (r *NoteRepository) Update(note *model.Note) error {

	return r.DB.Save(note).Error

}

func (r *NoteRepository) Delete(id uint) error {

	// DELETE FROM notes
	// WHERE id=3;
	result := r.DB.Delete(
		&model.Note{},
		id,
	)

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil

}
