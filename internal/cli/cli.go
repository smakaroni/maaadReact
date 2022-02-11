package cli

import (
	"flag"
	"fmt"
	"github.com/smakaroni/maaad-react/internal/logging"
	"os"
)

func usage() {
	fmt.Print(`This program runs Recipe backend server
	Usage:
	recipe [arguments]

	Supported arguments:

	`)
	flag.PrintDefaults()
	os.Exit(1)
}

func Parse() {
	flag.Usage = usage
	env := flag.String("env", "dev", `Sets rn environment. "dev" and "prod"`)
	flag.Parse()
	logging.ConfigureLogger(*env)
	if *env == "prod" {
		logging.SetGinLogToFile()
	}
	fmt.Println(*env)
}
