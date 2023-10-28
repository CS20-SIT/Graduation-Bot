package handler

import "github.com/CS20-SIT/Graduation-Bot/media-uploader/service"

type Handler struct {
	service service.Service
}

func NewHandler(s service.Service) *Handler {
	return &Handler{service: s}
}
