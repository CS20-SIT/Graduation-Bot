package lineapi

import (
	"encoding/json"
	"fmt"
	"github.com/CS20-SIT/Graduation-Bot/media-uploader/model"
	"io"
	"net/http"
	"time"
)

const contentBaseUrl = "https://api-data.line.me/v2/bot/message"

type httpLineApi struct {
	client *http.Client
}

func NewHttpLineApi() LineApi {
	c := &http.Client{
		Timeout: time.Minute * 5,
	}
	return &httpLineApi{client: c}
}

func (h *httpLineApi) GetContent(messageId string, accessToken string) (io.ReadCloser, string, error) {
	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("%s/%s/content", contentBaseUrl, messageId), nil)
	if err != nil {
		return nil, "", err
	}
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", accessToken))

	resp, err := h.client.Do(req)
	if err != nil {
		return nil, "", err
	}
	return resp.Body, resp.Header.Get("Content-Type"), nil
}

func (h *httpLineApi) GetContentStatus(messageId string, accessToken string) (model.TranscodingStatus, error) {
	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("%s/%s/content/transcoding", contentBaseUrl, messageId), nil)
	if err != nil {
		return model.TranscodingStatusFailed, err
	}

	resp, err := h.client.Do(req)
	if err != nil {
		return model.TranscodingStatusFailed, err
	}

	var respBody model.ContentStatusResponse
	if err := json.NewDecoder(resp.Body).Decode(&respBody); err != nil {
		return model.TranscodingStatusFailed, err
	}
	return respBody.Status, nil
}
