package main

import (
	"frontend/spa"

	"github.com/gin-gonic/contrib/secure"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.Use(secure.Secure(secure.Options{
		FrameDeny:          true,
		ContentTypeNosniff: true,
		STSSeconds:         31536000,
	}))
	r.Use(spa.Middleware("/", "../build"))
	r.Run()
}
