package service

import (
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/lineapi"
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/model"
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/storage"
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/utils"
)

type Service interface {
	UploadContent(msg model.UploadContentMessage) error
}

type service struct {
	lineApi lineapi.LineApi
	storage storage.Storage
	utils   utils.Utils
}

func NewService(lineApi lineapi.LineApi, s storage.Storage, u utils.Utils) Service {
	return &service{
		lineApi: lineApi,
		storage: s,
		utils:   u,
	}
}
