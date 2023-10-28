package service

import (
	"errors"
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/log"
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/model"
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/storage"
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
	defer content.Close()

	extension, err := s.utils.GetExtension(contentType)
	if err != nil {
		s.logError("failed to get file extension by content-type", msg.MessageID, err)
		return nil
	}

	metadata := storage.UploadMetadata{
		ParentFolder: msg.FolderID,
		FileName:     s.utils.GenerateContentFileName(msg.GuestDisplayName, extension),
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
