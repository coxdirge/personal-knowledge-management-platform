# Personal Knowledge Management Platform Roadmap

## Vision

This project aims to evolve from a simple note management system
into a personal knowledge infrastructure.

The core idea is not only storing information,
but connecting, searching, understanding and extending knowledge.


---

# Phase 1: PKM MVP

Current Goal:

Build a complete full-stack note management system.

Technology:

- React
- TypeScript
- Tailwind CSS
- Go
- Gin
- PostgreSQL


Features:

- CRUD notes
- REST API
- Frontend interaction
- Basic error handling


---

# Phase 2: Knowledge Organization

Possible extensions:

- Markdown support
- Tags
- Categories
- File import
- Full-text search
- User system


---

# Phase 3: Intelligent Knowledge System

Possible AI extensions:

## Vector Search

Introduce:

- Embedding generation
- Vector database
- Semantic search


Possible technologies:

- pgvector
- Qdrant
- Milvus


Architecture:

Markdown
    |
Parser
    |
Chunking
    |
Embedding
    |
Vector Storage
    |
Semantic Search


---

## RAG Integration

Enable:

- Ask questions about personal notes
- Generate summaries
- Connect related knowledge


Architecture:

User Query

↓

Embedding

↓

Retrieve Relevant Notes

↓

LLM

↓

Answer


---

# Phase 4: External Knowledge Integration

Possible integrations:

## Obsidian

Use:

- Markdown files
- Obsidian vault structure
- CLI/API synchronization


Goal:

Make this system act as a knowledge middleware layer.


Architecture:

Obsidian Vault

        |

        v

PKM Platform

        |

 -----------------

 |       |        |

Web     AI     Search


---

# Long-term Exploration

Possible experiments:

- Custom Markdown parser
- Personal search engine
- Knowledge graph
- Agent system
- DSL for querying knowledge
