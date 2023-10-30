package storage

import "io"

type UploadMetadata struct {
	ParentFolder string
	FileName     string
	ContentType  string
}

type Storage interface {
	Upload(metadata UploadMetadata, content io.Reader) error
}
