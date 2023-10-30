package lineapi

import (
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/model"
	"io"
)

type LineApi interface {
	GetContent(messageId string, accessToken string) (io.ReadCloser, string, error)
	GetContentStatus(messageId string, accessToken string) (model.TranscodingStatus, error)
}
