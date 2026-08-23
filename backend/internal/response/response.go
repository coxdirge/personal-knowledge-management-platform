package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Error(
	c *gin.Context,
	status int,
	message string,
) {

	c.JSON(
		status,
		gin.H{
			"code":    status,
			"message": message,
		},
	)

}

func Success(
	c *gin.Context,
	status int,
	data any,
) {

	c.JSON(
		status,
		gin.H{
			"data": data,
		},
	)

}

func NoContent(
	c *gin.Context,
) {

	c.Status(http.StatusNoContent)

}
