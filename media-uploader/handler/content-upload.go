package handler

import (
	"context"
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/log"
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/model"
	"github.com/cloudevents/sdk-go/v2/event"
	"github.com/cloudevents/sdk-go/v2/event/datacodec/json"
)

func (h *Handler) HandleContentUpload(ctx context.Context, e event.Event) error {
	var pubMsg model.PublishedMessage
	if err := e.DataAs(&pubMsg); err != nil {
		log.Logger.Errorw("failed to marshall published data, %s", err.Error())
		return nil
	}

	var msg model.UploadContentMessage
	if err := json.Decode(ctx, pubMsg.Message.Data, &msg); err != nil {
		log.Logger.Errorw("failed to marshall msg data, %s", err.Error())
		return nil
	}

	return h.service.UploadContent(msg)
}
