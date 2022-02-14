package store

import (
	"github.com/go-pg/pg/v10/orm"
	"github.com/rs/zerolog/log"
	"time"
)

type Recipe struct {
	Id 		int
	Title	string
	Content string
	ImgUrl 	string
	CreatedAt time.Time
	ModifiedAt	time.Time
	UserId 	int `json:"-"`
	Ingredients []*Ingredients `json:"-, pg:fk:recipe_id, rel:has-many, on_delete:CASCADE"`
}

func AddRecipe(user *User, recipe *Recipe) error  {
	recipe.UserId = user.Id
	_, err := db.Model(recipe).Returning("*").Insert()
	if err != nil {
		log.Error().Err(err).Msg("Error inserting new recipe")
	}
	return err
}

func FetchUserRecipes(user *User) error {
	err := db.Model(user).Relation("Recipes", func(q *orm.Query) (*orm.Query, error) {
		return q.Order("id ASC"), nil
	}).Select()
	if err != nil {
		log.Error().Err(err).Msg("Error fetching users recipes")
	}
	return err
}

func FetchRecipe(id int) (*Recipe, error) {
	recipe := new(Recipe)
	recipe.Id = id
	err := db.Model(recipe).WherePK().Select()
	if err != nil {
		log.Error().Err(err).Msg("Error fetching recipe")
		return nil, err
	}
	return recipe, nil
}

func UpdateRecipe(recipe *Recipe) error {
	_, err := db.Model(recipe).WherePK().UpdateNotZero()
	if err != nil {
		log.Error().Err(err).Msg("Error updating recipe")
	}
	return err
}

func DeleteRecipe(recipe *Recipe) error {
	_, err := db.Model(recipe).WherePK().Delete()
	if err != nil {
		log.Error().Err(err).Msg("Error deleting recipe")
	}
	return err
}