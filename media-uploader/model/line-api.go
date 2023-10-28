package model

type TranscodingStatus string

const (
	TranscodingStatusProcessing TranscodingStatus = "processing"
	TranscodingStatusSucceeded  TranscodingStatus = "succeeded"
	TranscodingStatusFailed     TranscodingStatus = "failed"
)

type ContentStatusResponse struct {
	Status TranscodingStatus `json:"status"`
}
