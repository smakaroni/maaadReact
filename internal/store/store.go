package store

import (
	"fmt"
	"github.com/go-pg/pg/v10"
	log2 "github.com/rs/zerolog/log"
	"github.com/smakaroni/maaad-react/internal/conf"
	"github.com/smakaroni/maaad-react/internal/database"
	"log"
)

var db *pg.DB

func SetDBConnection(dbOpts *pg.Options) {
	if dbOpts == nil {
		log.Panicln("DB option cannot be nil")
	} else {
		log2.Info().Str("ej hej", dbOpts.Addr).Msg("hej hej hej")
		fmt.Println(dbOpts.Addr)
		db = pg.Connect(dbOpts)
	}
}

func GetDBConnection() *pg.DB { return db }

func ResetTestDB() {
	SetDBConnection(database.NewDBOptions(conf.NewTestConfig()))

	tables := []string{"users", "recipes"}
	for _, table := range tables {
		_, err := db.Exec(fmt.Sprintf("DELETE FROM %s;", table))
		if err != nil {
			log2.Panic().Err(err).Str("table", table).Msg("Error cleaning database")
		}
		_, err = db.Exec(fmt.Sprintf("ALTER SEQUENCE %s_id_seq RESTART;", table))
	}
}
