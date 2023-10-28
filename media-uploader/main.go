package media_uploader

import (
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/handler"
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/lineapi"
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/log"
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/service"
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/storage"
	"github.com/GoogleCloudPlatform/functions-framework-go/functions"
	"os"
)

func init() {
	log.Init(os.Getenv("ENV") == "production")

	lineApi := lineapi.NewHttpLineApi()
	driveStorage := storage.NewGoogleDriveStorage(os.Getenv("GCP_CRED_FILE_PATH"))

	s := service.NewService(lineApi, driveStorage)
	h := handler.NewHandler(s)

	functions.CloudEvent("Main", h.HandleContentUpload)
}
