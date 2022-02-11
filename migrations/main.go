package main

import (
	"flag"
	"fmt"
	"github.com/go-pg/migrations/v8"
	"github.com/smakaroni/maaad-react/internal/conf"
	"github.com/smakaroni/maaad-react/internal/database"
	"github.com/smakaroni/maaad-react/internal/store"
	"os"
)

const usageText = `This program runs command on the db. Supported commands:
	- init - creates version info table in the db
	- up - runs all available migrations
	- up [target] - runs all migration to the target
	- down - reverts last migration
	- reset - reverts all migrations
	- version - prints current db version
	- set_version [version] - sets db version without running migration
Usage:
	go run *.go <command> [args]
`

func main() {
	flag.Usage = usage
	flag.Parse()

	store.SetDBConnection(database.NewDBOptions(conf.NewConfig()))
	db := store.GetDBConnection()

	oldVersion, newVersion, err := migrations.Run(db, flag.Args()...)
	if err != nil {
		exitf(err.Error())
	}
	if newVersion != oldVersion {
		fmt.Printf("migrated from version %d to %d \n", oldVersion, newVersion)
	} else {
		fmt.Printf("version is %d\n", oldVersion)
	}
}

func usage() {
	fmt.Print(usageText)
	flag.PrintDefaults()
	os.Exit(2)
}

func errorf(s string, args ...interface{}) {
	fmt.Fprintf(os.Stderr, s+"\n", args...)
}

func exitf(s string, args ...interface{}) {
	errorf(s, args...)
	os.Exit(1)
}