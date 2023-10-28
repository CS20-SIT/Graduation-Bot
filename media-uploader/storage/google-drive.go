package storage

import (
	"context"
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/log"
	"google.golang.org/api/drive/v3"
	"google.golang.org/api/googleapi"
	"google.golang.org/api/option"
	"io"
)

type googleDriveStorage struct {
	fileService *drive.FilesService
}

func NewGoogleDriveStorage(credentialFilePath string) Storage {
	var opts []option.ClientOption
	if credentialFilePath != "" {
		opts = append(opts, option.WithCredentialsFile(credentialFilePath))
	}

	s, err := drive.NewService(context.Background(), opts...)
	if err != nil {
		log.Logger.Fatalf("failed to create drive service: %s", err)
	}
	fs := drive.NewFilesService(s)
	return &googleDriveStorage{fileService: fs}
}

func (g *googleDriveStorage) Upload(metadata UploadMetadata, content io.Reader) error {
	file := drive.File{
		Parents: []string{metadata.ParentFolder},
		Name:    metadata.FileName,
	}

	_, err := g.fileService.Create(&file).
		Media(content, googleapi.ContentType(metadata.ContentType)).
		Do()

	return err
}
