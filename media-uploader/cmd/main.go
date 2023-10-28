package main

import (
	_ "github.com/CS20-SIT/Graduation-Bot/media-uploader"
	"github.com/GoogleCloudPlatform/functions-framework-go/funcframework"
	"log"
	"os"
)

func main() {
	port := "8080"
	os.Setenv("FUNCTION_TARGET", "Main")
	if err := funcframework.Start(port); err != nil {
		log.Fatalf("funcframework.Start: %v\n", err)
	}
}
