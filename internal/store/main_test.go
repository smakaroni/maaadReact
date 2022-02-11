package store

import (
	"github.com/gin-gonic/gin"
)

func testSetup()  {
	gin.SetMode(gin.TestMode)
	ResetTestDB()
}

func addTestUser() (*User, error) {
	user := &User{
		Username: "tester",
		Password: "tester123",
	}

	err := AddUser(user)
	return user, err
}