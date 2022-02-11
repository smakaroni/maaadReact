package server

import (
	"context"
	"github.com/rs/zerolog/log"
	"github.com/smakaroni/maaad-react/internal/conf"
	"github.com/smakaroni/maaad-react/internal/database"
	"github.com/smakaroni/maaad-react/internal/store"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

const InternalServerError = "Something went wrong!"
func Start(cfg conf.Config) {
	jwtSetup(cfg)
	store.SetDBConnection(database.NewDBOptions(cfg))
	router := setRouter()

	server := &http.Server{
		Addr: cfg.Host+":"+cfg.Port,
		Handler: router,
	}

	go func() {
		if err := server.ListenAndServe(); err != nil {
			log.Error().Err(err).Msg("Server listen and serve error")
		}
	}()

	quit := make(chan os.Signal)

	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Info().Msg("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatal().Err(err).Msg("Server forced to shutdown")
	}

	log.Info().Msg("Server exiting")
}