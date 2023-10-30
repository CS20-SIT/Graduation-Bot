package handler

import (
	"context"
	"encoding/json"
	"errors"
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/log"
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/model"
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/service"
	"github.com/cloudevents/sdk-go/v2/event"
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

func Test_Handler_HandleContentUpload(t *testing.T) {
	type fields struct {
		service *service.MockService
	}
	type args struct {
		ctx context.Context
		e   event.Event
	}
	ctx := context.Background()

	msg := model.UploadContentMessage{
		ChannelAccessToken: "accessToken",
		MessageID:          "messageId",
		Timestamp:          time.Now().Unix(),
		GuestDisplayName:   "guestDisplayName",
		FolderID:           "folderId",
		MessageType:        "messageType",
	}

	test := []struct {
		name    string
		fields  fields
		args    args
		wantErr bool
	}{
		{
			name: "noError_returnNil",
			fields: fields{
				service: func() *service.MockService {
					m := new(service.MockService)
					m.EXPECT().UploadContent(msg).Return(nil).Once()
					return m
				}(),
			},
			args: args{
				ctx: ctx,
				e:   getEventData(msg),
			},
			wantErr: false,
		},
		{
			name: "invalidPublishedMessage_returnNil",
			args: args{
				ctx: ctx,
				e:   getInvalidEventData(),
			},
			wantErr: false,
		},
		{
			name: "invalidRequestData_returnNil",
			args: args{
				ctx: ctx,
				e:   getInvalidRequestEventData(),
			},
			wantErr: false,
		},
		{
			name: "serviceError_returnError",
			fields: fields{
				service: func() *service.MockService {
					m := new(service.MockService)
					m.EXPECT().UploadContent(msg).Return(errors.New("mock")).Once()
					return m
				}(),
			},
			args: args{
				ctx: ctx,
				e:   getEventData(msg),
			},
			wantErr: true,
		},
	}

	for _, tt := range test {
		t.Run(tt.name, func(t *testing.T) {
			log.Init(false)
			h := &Handler{service: tt.fields.service}
			gotErr := h.HandleContentUpload(tt.args.ctx, tt.args.e)
			if tt.wantErr {
				assert.NotNil(t, gotErr)
			} else {
				assert.Nil(t, gotErr)
			}

			if tt.fields.service != nil {
				tt.fields.service.AssertExpectations(t)
			}
		})
	}
}

func getEventData(msg model.UploadContentMessage) event.Event {
	jsonReq, _ := json.Marshal(msg)
	pubsubMsg := model.PubSubMessage{Data: jsonReq}
	publishedMsg := model.PublishedMessage{Message: pubsubMsg}
	jsonPublishedMsg, _ := json.Marshal(publishedMsg)

	e := event.New()
	_ = e.SetData("application/json", jsonPublishedMsg)
	return e
}

func getInvalidRequestEventData() event.Event {
	pubsubMsg := model.PubSubMessage{Data: []byte("not valid request")}
	publishedMsg := model.PublishedMessage{Message: pubsubMsg}
	jsonPublishedMsg, _ := json.Marshal(publishedMsg)

	e := event.New()
	_ = e.SetData("application/json", jsonPublishedMsg)
	return e
}

func getInvalidEventData() event.Event {
	e := event.New()
	_ = e.SetData("application/json", "invalid data")
	return e
}
