package app

import (
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	httpRequestsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "resource_community_http_requests_total",
			Help: "Total number of HTTP requests handled by resource_community_go.",
		},
		[]string{"method", "path", "status"},
	)
	httpRequestDurationSeconds = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "resource_community_http_request_duration_seconds",
			Help:    "HTTP request latency distribution in seconds.",
			Buckets: []float64{0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5},
		},
		[]string{"method", "path", "status"},
	)
)

func MetricsMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		startedAt := time.Now()

		ctx.Next()

		path := ctx.FullPath()
		if path == "" {
			path = "unmatched"
		}
		status := strconv.Itoa(ctx.Writer.Status())
		method := ctx.Request.Method

		httpRequestsTotal.WithLabelValues(method, path, status).Inc()
		httpRequestDurationSeconds.WithLabelValues(method, path, status).Observe(time.Since(startedAt).Seconds())
	}
}
