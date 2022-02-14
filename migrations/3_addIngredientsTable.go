package main

import (
	"fmt"
	"github.com/go-pg/migrations/v8"
)

func init() {
	migrations.MustRegisterTx(func(db migrations.DB) error {
		fmt.Println("creating table ingredients..")
		_, err := db.Exec(`CREATE TABLE ingredients(
			id SERIAL PRIMARY KEY,
			name TEXT NOT NULL,
			amount INT NOT NULL,
			unit TEXT NOT NULL,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			modified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			recipe_id INT REFERENCES recipes ON DELETE CASCADE
		)`)
		return err
	}, func(db migrations.DB) error {
		fmt.Println("dropping table ingredients...")
		_, err := db.Exec(`DROP TABLE ingredients`)
		return err
	})
}