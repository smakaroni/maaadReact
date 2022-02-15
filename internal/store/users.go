package store

import (
	"context"
	"github.com/go-pg/pg/v10"
	"github.com/rs/zerolog/log"
	"golang.org/x/crypto/bcrypt"
	"math/rand"
	"time"
)

type User struct {
	Id             int
	Username       string
	Password       string `pg:"-" binding:"required,min=7,max=32"`
	HashedPassword []byte `json:"-"`
	Salt           []byte `json:"-"`
	CreatedAt      time.Time
	ModifiedAt     time.Time
	Recipes        []*Recipe `json:"-" pg:"fk:user_id,rel:has-many,on_delete:CASCADE"`
}

var Users []*User

func AddUser(user *User) error {
	salt, err := GenerateSalt()
	if err != nil {
		return err
	}
	toHash := append([]byte(user.Password), salt...)
	hashedPassword, err := bcrypt.GenerateFromPassword(toHash, bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user.Salt = salt
	user.HashedPassword = hashedPassword

	_, err = db.Model(user).Returning("*").Insert()
	if err != nil {
		return err
	}
	return nil
}

func Authenticate(username, password string) (*User, error) {
	user := new(User)
	if err := db.Model(user).Where(
		"username = ?", username).Select(); err != nil {
		return nil, err
	}
	salted := append([]byte(password), user.Salt...)
	if err := bcrypt.CompareHashAndPassword(user.HashedPassword, salted); err != nil {
		return nil, err
	}
	return user, nil
}

func GenerateSalt() ([]byte, error) {
	salt := make([]byte, 16)
	if _, err := rand.Read(salt); err != nil {
		log.Panic().Err(err).Msg("Unable to generate salt")
		return nil, err
	}
	return salt, nil
}

func FetchUser(id int) (*User, error) {
	user := new(User)
	user.Id = id
	err := db.Model(user).Returning("*").WherePK().Select()
	if err != nil {
		log.Error().Err(err).Msg("error getting user")
		return nil, err
	}
	return user, nil
}

var _ pg.AfterSelectHook = (*User)(nil)

func (user *User) AfterSelect(ctx context.Context) error {
	if user.Recipes == nil {
		user.Recipes = []*Recipe{}
	}
	return nil
}
