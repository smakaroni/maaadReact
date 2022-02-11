package database

import (
	"github.com/go-pg/pg/v10"
	"github.com/smakaroni/maaad-react/internal/conf"
)

func NewDBOptions(cfg conf.Config) *pg.Options {
	return &pg.Options{
		Addr: cfg.DbHost+":"+cfg.DbPort,
		Database: cfg.DbName,
		User: cfg.DbUser,
		Password: cfg.DbPassword,
	}
}