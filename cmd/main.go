package main

import (
	"github.com/smakaroni/maaad-react/internal/cli"
	"github.com/smakaroni/maaad-react/internal/conf"
	"github.com/smakaroni/maaad-react/internal/server"
)

func main() {
	cli.Parse()
	server.Start(conf.NewConfig())
}
