package utils

import (
	"fmt"
	"github.com/oklog/ulid/v2"
	"mime"
)

type Utils interface {
	GenerateContentFileName(displayName string, extension string) string
	GetExtension(mimeType string) (string, error)
}

type utils struct {
}

func NewUtils() Utils {
	return &utils{}
}

func (u utils) GenerateContentFileName(displayName string, extension string) string {
	return fmt.Sprintf("%s_%s%s", displayName, ulid.Make().String(), extension)
}

func (u utils) GetExtension(mimeType string) (string, error) {
	extensions, err := mime.ExtensionsByType(mimeType)
	if err != nil {
		return "", err
	}
	if extensions == nil {
		return "", nil
	}

	return extensions[len(extensions)-1], nil
}
