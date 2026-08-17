package database

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() error {

	dsn := "host=localhost user=ricardo dbname=pkm sslmode=disable"

	db, err := gorm.Open(
		postgres.Open(dsn),
		&gorm.Config{},
	)

	if err != nil {
		return err
	}

	DB = db

	return nil
}
