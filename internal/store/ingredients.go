package store

import (
	"github.com/go-pg/pg/v10/orm"
	"github.com/rs/zerolog/log"
	"time"
)

type Ingredients struct {
	Id         int
	Name       string
	Amount     int
	Unit       string
	CreatedAt  time.Time
	ModifiedAt time.Time
	RecipeId   int `json:"-"`
}

func FetchRecipeIngredients(recipe *Recipe) error {
	err := db.Model(recipe).WherePK().Relation("Ingredients", func(q *orm.Query) (*orm.Query, error) {
		return q.Order("id ASC"), nil
	}).Select()
	if err != nil {
		log.Error().Err(err).Msg("Error getting ingredients")
	}
	return err
}
