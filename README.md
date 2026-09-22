# PKMP

Personal Knowledge Management Platform.

PKMP is a full-stack note management application built as an engineering
practice project. The current version focuses on completing a clean,
reproducible full-stack workflow before introducing more advanced knowledge
management features.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Backend

- Go
- Gin
- GORM

### Database

- PostgreSQL

### Deployment

- Docker
- Docker Compose
- Nginx

## Features

- Create notes
- List notes
- Edit notes
- Delete notes
- Search notes by title or content
- Light / dark theme
- Responsive frontend
- Backend validation and structured error handling
- Dockerized full-stack deployment
- Persistent PostgreSQL storage

## Architecture

```text
Browser
  |
  v
Nginx
  |----------------------|
  |                      |
  v                      v
React static files     /api/*
                         |
                         v
                    Go / Gin
                         |
                         v
                      Service
                         |
                         v
                    Repository
                         |
                         v
                    PostgreSQL
```

See [docs/architecture.md](docs/architecture.md) for more details.

## Development

### Requirements

- Go
- Node.js
- Docker

Create a local environment file:

```bash
cp .env.example .env
```

It provides `POSTGRES_PASSWORD`, which the `postgres` and `backend` services read.

Start PostgreSQL:

```bash
docker compose up postgres
```

Start the backend:

```bash
cd backend
go run ./cmd/server
```

Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend development server proxies `/api` requests to the backend.

## Docker

The complete application can be started with:

```bash
docker compose up --build
```

Requires the `.env` file created in [Development](#development).

Then open:

```text
http://localhost
```

The Docker stack contains:

```text
frontend
  -> Nginx + React production build

backend
  -> Go API server

postgres
  -> PostgreSQL + persistent volume
```

Stop the application:

```bash
docker compose down
```

Remove containers and database volume:

```bash
docker compose down -v
```

> `-v` deletes the PostgreSQL volume and therefore removes stored data.

## Backend Tests

```bash
cd backend
go test ./...
```

## Production Build

Frontend:

```bash
cd frontend
npm run build
```

Backend compilation is handled by the backend Dockerfile during image build.

## API

```text
POST   /api/notes
GET    /api/notes
GET    /api/notes/:id
PUT    /api/notes/:id
DELETE /api/notes/:id
```

Search:

```text
GET /api/notes?q=keyword
```

## Project Status

PKMP v1 focuses on establishing the application's engineering foundation.

Possible future directions include:

- authentication
- knowledge graph
- external knowledge-source adapters
- semantic search
- AI / RAG capabilities

These features are intentionally outside the v2 scope.
