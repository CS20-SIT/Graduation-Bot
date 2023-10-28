package log

import (
	"go.uber.org/zap"
	"log"
)

var Logger *zap.SugaredLogger

func Init(isProd bool) {
	var (
		l   *zap.Logger
		err error
	)

	if isProd {
		l, err = zap.NewProduction()
	} else {
		l, err = zap.NewDevelopment()
	}
	if err != nil {
		log.Fatalln("Failed to create zap logger")
	}
	Logger = l.Sugar()
}
