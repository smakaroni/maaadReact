package conf

import (
	"github.com/rs/zerolog/log"
)

const (
	hostKey = "RECIPE_HOST"
	portKey = "RECIPE_PORT"
	dbHostKey = "RECIPE_DB_HOST"
	dbPortKey = "RECIPE_DB_PORT"
	dbNameKey = "RECIPE_DB_NAME"
	dbUserKey = "RECIPE_DB_USER"
	dbPasswordKey = "RECIPE_DB_PASSWORD"
	jwtSecretKey = "RECIPE_JWT_SECRET"
)

type Config struct {
	Host	string
	Port 	string
	DbHost	string
	DbPort	string
	DbName	string
	DbUser	string
	DbPassword string
	JwtSecret	string
}

func NewConfig() Config {
	//host, ok := os.LookupEnv(hostKey)
	//if !ok || host == "" {
	//	logAndPanic(hostKey)
	//}
	//
	//port, ok := os.LookupEnv(portKey)
	//if !ok || port == "" {
	//	if _, err := strconv.Atoi(port); err != nil {
	//		logAndPanic(portKey)
	//	}
	//}
	//
	//dbHost, ok := os.LookupEnv(dbHostKey)
	//if !ok || dbHost == "" {
	//	logAndPanic(dbHostKey)
	//}
	//
	//dbPort, ok := os.LookupEnv(dbPortKey)
	//if !ok || dbPort == "" {
	//	if _, err := strconv.Atoi(dbPort); err != nil {
	//		logAndPanic(dbPortKey)
	//	}
	//}
	//
	//dbName, ok := os.LookupEnv(dbNameKey)
	//if !ok || dbName == "" {
	//	logAndPanic(dbNameKey)
	//}
	//
	//dbUser, ok := os.LookupEnv(dbUserKey)
	//if !ok || dbUser == "" {
	//	logAndPanic(dbUserKey)
	//}
	//
	//dbPassword, ok := os.LookupEnv(dbPasswordKey)
	//if !ok || dbPassword == "" {
	//	logAndPanic(dbPasswordKey)
	//}
	//
	//jwtSecret, ok := os.LookupEnv(jwtSecretKey)
	//if !ok || jwtSecret == "" {
	//	logAndPanic(jwtSecretKey)
	//}


	return Config{
		Host:       "0.0.0.0",
		Port:       "8080",
		DbHost:     "localhost",
		DbPort:     "5432",
		DbName:     "recipes",
		DbUser:     "jokke",
		DbPassword: "testtest",
		JwtSecret: "jwtSecret123",
	}
}

func logAndPanic(envVar string) {
	log.Panic().Str("envVar", envVar).Msg("Env variable not set or not a valid value")
}

func NewTestConfig() Config {
	testConfig := NewConfig()
	testConfig.DbName = testConfig.DbName + "_test"
	return testConfig
}