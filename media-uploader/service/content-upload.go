package service

import (
	"errors"
	"fmt"
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/log"
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/model"
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/storage"
	"github.com/oklog/ulid/v2"
	"mime"
)

func (s *service) UploadContent(msg model.UploadContentMessage) error {
	if msg.MessageType == model.MessageTypeVideo {
		status, err := s.lineApi.GetContentStatus(msg.MessageID, msg.ChannelAccessToken)
		if err != nil {
			s.logError("failed to get content status", msg.MessageID, err)
			return err
		}
		switch status {
		case model.TranscodingStatusFailed:
			log.Logger.Warnw("content status is failed", "messageId", msg.MessageID)
			return nil
		case model.TranscodingStatusProcessing:
			log.Logger.Infow("content is still processing", "messageId", msg.MessageID)
			return errors.New("content is still processing")
		}
	}

	content, contentType, err := s.lineApi.GetContent(msg.MessageID, msg.ChannelAccessToken)
	if err != nil {
		s.logError("failed to get content data", msg.MessageID, err)
		return err
	}

	extensions, err := mime.ExtensionsByType(contentType)
	if err != nil {
		s.logError("failed to get file extension by content-type", msg.MessageID, err)
		return nil
	}
	if extensions == nil {
		s.logError("can't match content type to extension", msg.MessageID, err)
		return nil
	}

	metadata := storage.UploadMetadata{
		ParentFolder: msg.FolderID,
		FileName:     fmt.Sprintf("%s_%s%s", msg.GuestDisplayName, ulid.Make().String(), extensions[len(extensions)-1]),
		ContentType:  contentType,
	}
	if err := s.storage.Upload(metadata, content); err != nil {
		s.logError("failed to upload content to storage", msg.MessageID, err)
		return err
	}

	log.Logger.Infow("uploaded content to storage", "messageId", msg.MessageID)
	return nil
}

func (s *service) logError(msg, msgId string, err error) {
	log.Logger.Errorf("%s, %s, message-id: %s", msg, err.Error(), msgId)
}
