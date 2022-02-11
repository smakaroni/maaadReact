package server

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/cristalhq/jwt/v3"
	"github.com/rs/zerolog/log"
	"github.com/smakaroni/maaad-react/internal/conf"
	"github.com/smakaroni/maaad-react/internal/store"
	"strconv"
	"time"
)

var (
	jwtSigner jwt.Signer
	jwtVerifier jwt.Verifier
)

func jwtSetup(conf conf.Config) {
	var err error
	key := []byte(conf.JwtSecret)

	jwtSigner, err = jwt.NewSignerHS(jwt.HS256, key)
	if err != nil {
		log.Panic().Err(err).Msg("error creating jwt signer")
	}

	jwtVerifier, err = jwt.NewVerifierHS(jwt.HS256, key)
	if err != nil {
		log.Panic().Err(err).Msg("error creating jwt verifier")
	}
}

func generateJWT(user *store.User) string {
	claims := &jwt.RegisteredClaims{
		ID: fmt.Sprint(user.Id),
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour*24*7)),
	}

	builder := jwt.NewBuilder(jwtSigner)
	token, err := builder.Build(claims)
	if err != nil {
		log.Panic().Err(err).Msg("error building jwt")
	}
	return token.String()
}

func verifyJWT(tokenStr string) (int, error){
	token, err := jwt.Parse([]byte(tokenStr))
	if err != nil {
		log.Error().Err(err).Str("token", tokenStr).Msg("error parsing token")
		return 0, err
	}

	if err := jwtVerifier.Verify(token.Payload(), token.Signature()); err != nil {
		log.Error().Err(err).Msg("error verifying token")
		return 0, err
	}

	var claims jwt.StandardClaims
	if err := json.Unmarshal(token.RawClaims(), &claims); err != nil {
		log.Error().Err(err).Msg("error unmarshalling jwt claims")
		return 0, err
	}

	if notExp := claims.IsValidAt(time.Now()); !notExp {
		return 0, errors.New("Token expired")
	}

	id, err := strconv.Atoi(claims.ID)
	if err != nil {
		log.Error().Err(err).Str("claimsId", claims.ID).Msg("error converting id")
		return 0, err
	}
	return id, err
}