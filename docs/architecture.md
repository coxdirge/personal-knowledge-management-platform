# Architecture

## Overview

PKMP currently follows a simple layered architecture.

```text
Browser
  |
  | HTTP
  v
Nginx
  |
  | /api/*
  v
Gin Handler
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

The frontend communicates with the backend through relative `/api` paths.

In development:

```text
Browser
  -> Vite
  -> Vite proxy
  -> Go backend
```

In the Docker environment:

```text
Browser
  -> Nginx
  -> backend:8080
```

This allows frontend code to remain independent of the physical backend
address.

## Backend Layers

### Handler

Responsibilities:

- HTTP request parsing
- path/query parameter parsing
- DTO binding
- mapping service errors to HTTP status codes
- response serialization

The handler should not contain database logic.

### Service

Responsibilities:

- business validation
- normalization
- application semantics
- translating infrastructure errors into domain/application errors

Examples include:

- trimming note fields
- rejecting empty titles
- enforcing field length limits
- translating missing database rows into `ErrNoteNotFound`

### Repository

Responsibilities:

- persistence
- GORM queries
- PostgreSQL interaction

The repository does not decide HTTP semantics.

## Note Update Semantics

Update DTO fields use pointers.

Conceptually:

```text
nil
= field was omitted

non-nil ""
= caller explicitly provided an empty value
```

This distinction is required for partial updates.

For example:

```text
Title: nil
```

means:

> Do not modify the title.

while:

```text
Title: pointer("")
```

means:

> Explicitly set the title to an empty value.

The latter is rejected by service validation.

## Search

The notes endpoint supports:

```text
GET /api/notes?q=keyword
```

A blank query returns all notes.

A non-empty query performs case-insensitive matching against note title and
content.

Results are ordered by `updated_at DESC`.

## Docker Topology

```text
Host
 |
 | :80
 v
frontend container
 |
 | Nginx reverse proxy
 v
backend:8080
 |
 v
postgres:5432
 |
 v
postgres_data volume
```

Docker Compose provides internal DNS.

Therefore:

```text
DB_HOST=postgres
```

refers to the PostgreSQL service.

Inside the backend container:

```text
localhost
```

would refer to the backend container itself, not PostgreSQL.

## Persistent Data

The PostgreSQL container stores its database files in a named Docker volume:

```text
postgres_data
```

Container lifetime and data lifetime are therefore independent.

```bash
docker compose down
```

removes containers but preserves the volume.

```bash
docker compose down -v
```

also removes persistent database data.
