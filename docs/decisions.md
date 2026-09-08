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
