# Architecture Decisions


## ADR-001: Use React + Go Gin for initial architecture

Date:
2026-08-17

Status:
Accepted


## Context

The project requires a complete full-stack development experience.

The goal is not only to build features, but also to understand how frontend, backend and database systems interact.


## Decision

Use:

Frontend:
- React
- TypeScript
- Vite


Backend:
- Go
- Gin


## Reason

React provides a modern frontend ecosystem.

Go and Gin provide a simple but production-oriented backend environment.

This architecture is suitable for learning full-stack engineering.


## Decision: Keep the system extensible

We intentionally separate:

- storage
- business logic
- API
- frontend components

because future extensions may include:

- search
- AI retrieval
- external knowledge sources
- automation agents

The current architecture should allow these capabilities
to be integrated without rewriting the core system.

---

Date: 2026-09-22
# Engineering Decisions

This document records selected engineering decisions made during PKMP v2.

The goal is not to claim that these decisions are universally optimal, but to
preserve the reasoning behind the current design.

## Layered Backend

The backend uses:

```text
handler
-> service
-> repository
```

This separates three different concerns:

```text
HTTP semantics
business semantics
persistence semantics
```

For example, a raw GORM error should not directly determine an HTTP response.

Instead:

```text
repository error
-> service translation
-> handler HTTP mapping
```

## Pointer Fields in Update DTOs

Update DTO fields use pointers so that the application can distinguish:

```text
field omitted
```

from:

```text
field explicitly provided with an empty value
```

Without this distinction, partial update semantics become ambiguous.

## Validation in the Service Layer

Important validation rules exist in the service layer rather than relying only
on frontend validation.

Frontend validation improves UX.

Backend validation protects application invariants.

Current note rules include:

- title is required
- title maximum length: 120
- content maximum length: 10,000

## Relative API Paths

The frontend uses:

```text
/api
```

instead of hardcoding:

```text
http://localhost:8080/api
```

The environment determines how `/api` reaches the backend.

Development:

```text
Vite proxy
```

Docker / production-like environment:

```text
Nginx reverse proxy
```

This keeps deployment details out of frontend application code.

## Search State

The frontend separates:

```text
searchInput
```

from:

```text
searchQuery
```

`searchInput` represents what the user is currently typing.

`searchQuery` represents the query associated with the currently displayed
result set.

This prevents typing from accidentally changing request dependencies and
triggering full-page reload behavior.

## Docker Multi-Stage Builds

Both frontend and backend use multi-stage Docker builds.

Backend:

```text
Go compiler image
-> compile binary
-> lightweight runtime image
```

Frontend:

```text
Node image
-> build static assets
-> Nginx runtime image
```

Build-time tools therefore do not need to exist in the final runtime image.

## Docker Service Discovery

Docker Compose service names are used as internal hostnames.

For example:

```text
backend
postgres
```

can communicate without exposing every service port to the host.

Only Nginx needs to be the public application entry point.

## Database Persistence

PostgreSQL data is stored in a named Docker volume.

The database container is considered disposable; the database data is not.

## Scope of v1

PKMP v1 intentionally does not include:

- authentication
- Redis
- message queues
- knowledge graphs
- RAG
- AI agents
- external knowledge source synchronization

The purpose of v1 is to establish a complete and understandable full-stack
engineering foundation before increasing system complexity.
