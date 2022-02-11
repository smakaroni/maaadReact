package server

import (
	"github.com/gin-gonic/gin"
	"github.com/smakaroni/maaad-react/internal/store"
	"net/http"
)

func setRouter() *gin.Engine {
	router := gin.Default()

	router.RedirectTrailingSlash = true

	api := router.Group("/api")
	api.Use(customErrors)
	{
		api.POST("/signup", gin.Bind(store.User{}), signUp)
		api.POST("/signin", gin.Bind(store.User{}), signIn)
	}

	authorized := api.Group("/")
	authorized.Use(authorization)
	{
		authorized.POST("/recipes", createRecipe)
		authorized.GET("/recipes", indexRecipes)
		authorized.PUT("/recipes", updateRecipe)
		authorized.DELETE("/recipes/:id", deleteRecipe)
	}
	router.NoRoute(func(context *gin.Context) {
		context.JSON(http.StatusNotFound, gin.H{})
	})

	return router
}