package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	router := gin.Default()

	api := router.Group("/api")
	{
		api.GET("/hello", func(context *gin.Context) {
			context.JSON(http.StatusOK, gin.H{"msg": "hello"})
		})
	}

	router.NoRoute(func(context *gin.Context) {
		context.JSON(http.StatusNotFound, gin.H{})
	})

	router.Run(":8080")
}