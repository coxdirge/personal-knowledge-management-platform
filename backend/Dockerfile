# =========================
# Build stage
# =========================

FROM golang:1.26.5-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build \
    -o /bin/pkmp-server \
    ./cmd/server


# =========================
# Runtime stage
# =========================

FROM alpine:latest

WORKDIR /app

RUN apk add --no-cache ca-certificates

COPY --from=builder /bin/pkmp-server /usr/local/bin/pkmp-server

EXPOSE 8080

CMD ["pkmp-server"]
