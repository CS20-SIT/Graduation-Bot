package service

import (
	"errors"
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/lineapi"
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/log"
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/model"
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/storage"
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/utils"
	"github.com/stretchr/testify/assert"
	"io"
	"strings"
	"testing"
	"time"
)

var mockError = errors.New("mock")

func Test_service_UploadContent(t *testing.T) {
	type fields struct {
		lineApi *lineapi.MockLineApi
		storage *storage.MockStorage
		utils   *utils.MockUtils
	}
	type args struct {
		msg model.UploadContentMessage
	}

	content := io.NopCloser(strings.NewReader("mock_content"))
	contentType := "image/jpeg"
	extension := ".jpg"
	folderId := "folderId"
	fileName := "fileName"

	uploadMetadata := storage.UploadMetadata{
		ParentFolder: folderId,
		FileName:     fileName,
		ContentType:  contentType,
	}
	imageMsg := model.UploadContentMessage{
		ChannelAccessToken: "accessToken",
		MessageID:          "messageId",
		Timestamp:          time.Now().Unix(),
		GuestDisplayName:   "guestDisplayName",
		FolderID:           folderId,
		MessageType:        model.MessageTypeImage,
	}
	videoMsg := model.UploadContentMessage{
		ChannelAccessToken: "accessToken",
		MessageID:          "messageId",
		Timestamp:          time.Now().Unix(),
		GuestDisplayName:   "guestDisplayName",
		FolderID:           folderId,
		MessageType:        model.MessageTypeVideo,
	}

	tests := []struct {
		name    string
		fields  fields
		args    args
		wantErr bool
	}{
		{
			name: "imageMessageNoError_returnNil",
			fields: fields{
				lineApi: func() *lineapi.MockLineApi {
					m := new(lineapi.MockLineApi)
					m.EXPECT().GetContent(imageMsg.MessageID, imageMsg.ChannelAccessToken).Return(content, contentType, nil).Once()
					return m
				}(),
				storage: func() *storage.MockStorage {
					m := new(storage.MockStorage)
					m.EXPECT().Upload(uploadMetadata, content).Return(nil).Once()
					return m
				}(),
				utils: func() *utils.MockUtils {
					m := new(utils.MockUtils)
					m.EXPECT().GetExtension(contentType).Return(extension, nil)
					m.EXPECT().GenerateContentFileName(imageMsg.GuestDisplayName, extension).Return(fileName).Once()
					return m
				}(),
			},
			args: args{
				msg: imageMsg,
			},
			wantErr: false,
		},
		{
			name: "videoMessageGetTranscodeStatusError_returnError",
			fields: fields{
				lineApi: func() *lineapi.MockLineApi {
					m := new(lineapi.MockLineApi)
					m.EXPECT().
						GetContentStatus(videoMsg.MessageID, videoMsg.ChannelAccessToken).
						Return(model.TranscodingStatusFailed, mockError).
						Once()
					return m
				}(),
			},
			args: args{
				msg: videoMsg,
			},
			wantErr: true,
		},
		{
			name: "videoMessageTranscodeSuccess_returnNil",
			fields: fields{
				lineApi: func() *lineapi.MockLineApi {
					m := new(lineapi.MockLineApi)
					m.EXPECT().GetContentStatus(videoMsg.MessageID, videoMsg.ChannelAccessToken).Return(model.TranscodingStatusSucceeded, nil).Once()
					m.EXPECT().GetContent(videoMsg.MessageID, videoMsg.ChannelAccessToken).Return(content, contentType, nil).Once()
					return m
				}(),
				storage: func() *storage.MockStorage {
					m := new(storage.MockStorage)
					m.EXPECT().Upload(uploadMetadata, content).Return(nil).Once()
					return m
				}(),
				utils: func() *utils.MockUtils {
					m := new(utils.MockUtils)
					m.EXPECT().GetExtension(contentType).Return(extension, nil)
					m.EXPECT().GenerateContentFileName(videoMsg.GuestDisplayName, extension).Return(fileName).Once()
					return m
				}(),
			},
			args: args{
				msg: videoMsg,
			},
			wantErr: false,
		},
		{
			name: "videoMessageTranscodeProcessing_returnError",
			fields: fields{
				lineApi: func() *lineapi.MockLineApi {
					m := new(lineapi.MockLineApi)
					m.EXPECT().GetContentStatus(videoMsg.MessageID, videoMsg.ChannelAccessToken).Return(model.TranscodingStatusProcessing, nil).Once()
					return m
				}(),
			},
			args: args{
				msg: videoMsg,
			},
			wantErr: true,
		},
		{
			name: "videoMessageTranscodeFailed_returnNil",
			fields: fields{
				lineApi: func() *lineapi.MockLineApi {
					m := new(lineapi.MockLineApi)
					m.EXPECT().GetContentStatus(videoMsg.MessageID, videoMsg.ChannelAccessToken).Return(model.TranscodingStatusFailed, nil).Once()
					return m
				}(),
			},
			args: args{
				msg: videoMsg,
			},
			wantErr: false,
		},
		{
			name: "getContentError_returnError",
			fields: fields{
				lineApi: func() *lineapi.MockLineApi {
					m := new(lineapi.MockLineApi)
					m.EXPECT().
						GetContent(imageMsg.MessageID, imageMsg.ChannelAccessToken).
						Return(nil, "", mockError).
						Once()
					return m
				}(),
			},
			args: args{
				msg: imageMsg,
			},
			wantErr: true,
		},
		{
			name: "getExtensionError_returnNil",
			fields: fields{
				lineApi: func() *lineapi.MockLineApi {
					m := new(lineapi.MockLineApi)
					m.EXPECT().GetContent(imageMsg.MessageID, imageMsg.ChannelAccessToken).Return(content, contentType, nil).Once()
					return m
				}(),
				utils: func() *utils.MockUtils {
					m := new(utils.MockUtils)
					m.EXPECT().GetExtension(contentType).Return("", mockError)
					return m
				}(),
			},
			args: args{
				msg: imageMsg,
			},
			wantErr: false,
		},
		{
			name: "uploadContentError_returnError",
			fields: fields{
				lineApi: func() *lineapi.MockLineApi {
					m := new(lineapi.MockLineApi)
					m.EXPECT().GetContent(imageMsg.MessageID, imageMsg.ChannelAccessToken).Return(content, contentType, nil).Once()
					return m
				}(),
				storage: func() *storage.MockStorage {
					m := new(storage.MockStorage)
					m.EXPECT().Upload(uploadMetadata, content).Return(mockError).Once()
					return m
				}(),
				utils: func() *utils.MockUtils {
					m := new(utils.MockUtils)
					m.EXPECT().GetExtension(contentType).Return(extension, nil)
					m.EXPECT().GenerateContentFileName(imageMsg.GuestDisplayName, extension).Return(fileName).Once()
					return m
				}(),
			},
			args: args{
				msg: imageMsg,
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			log.Init(false)
			s := &service{
				lineApi: tt.fields.lineApi,
				storage: tt.fields.storage,
				utils:   tt.fields.utils,
			}
			gotErr := s.UploadContent(tt.args.msg)
			if tt.wantErr {
				assert.NotNil(t, gotErr)
			} else {
				assert.Nil(t, gotErr)
			}

			if tt.fields.lineApi != nil {
				tt.fields.lineApi.AssertExpectations(t)
			}
			if tt.fields.storage != nil {
				tt.fields.storage.AssertExpectations(t)
			}
			if tt.fields.utils != nil {
				tt.fields.utils.AssertExpectations(t)
			}
		})
	}
}
