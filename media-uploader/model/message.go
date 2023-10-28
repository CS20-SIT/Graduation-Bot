package model

type LineMessageType string

const (
	MessageTypeImage LineMessageType = "image"
	MessageTypeVideo LineMessageType = "video"
)

type UploadContentMessage struct {
	ChannelAccessToken string          `json:"channelAccessToken"`
	MessageID          string          `json:"messageId"`
	Timestamp          int64           `json:"timestamp"`
	GuestDisplayName   string          `json:"guestDisplayName"`
	FolderID           string          `json:"folderId"`
	MessageType        LineMessageType `json:"messageType"`
}

type PublishedMessage struct {
	Message      PubSubMessage `json:"message"`
	Subscription string        `json:"subscription"`
}

type PubSubMessage struct {
	Data       []byte            `json:"data"`
	Attributes map[string]string `json:"attributes"`
}
