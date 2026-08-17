# Personal Knowledge Management Platform

一个基于 React + TypeScript + Go 构建的全栈知识管理系统。

本项目的目标不是重新实现一个商业级知识管理软件，而是通过完整的软件开发流程，学习并实践现代 Web 应用中的核心工程能力：

- 前后端分离架构
- REST API 设计
- 用户认证与权限控制
- 数据库建模
- 缓存设计
- 服务部署
- 工程化开发流程

---

## Project Motivation

作为软件工程学生，目前已经学习了：

- 数据结构
- 计算机组成原理
- 计算机网络
- Rust / Go 编程
- 类型系统与函数式编程基础

但是缺少一次完整的软件工程实践：

> 从需求设计，到架构搭建，到开发部署，再到性能优化。

因此设计并实现此项目，用于补充实际工程经验。

---

# Features

## User System

- [ ] 用户注册
- [ ] 用户登录
- [ ] JWT / Cookie 身份认证
- [ ] 用户权限控制


## Note Management

- [ ] 创建笔记
- [ ] 编辑笔记
- [ ] 删除笔记
- [ ] Markdown 支持
- [ ] 标签系统


## Search

- [ ] 基础关键词搜索
- [ ] 数据库索引优化
- [ ] 搜索服务扩展


## System Optimization

- [ ] Redis 缓存
- [ ] API 错误处理
- [ ] 日志系统
- [ ] Docker 部署

---

# Tech Stack

## Frontend

| Technology | Purpose |
|-|-|
| TypeScript | 类型安全 |
| React | UI 框架 |
| Vite | 构建工具 |
| Tailwind CSS | 样式系统 |


## Backend

| Technology | Purpose |
|-|-|
| Go | 后端语言 |
| Gin | Web Framework |
| GORM | ORM |
| PostgreSQL | 数据库 |


## Additional

| Technology | Purpose |
|-|-|
| Redis | 缓存 |
| Docker | 部署 |
| Nginx | 反向代理 |

---

# Architecture

整体采用前后端分离架构：

```
                Browser

                   |
                   |

             React Frontend

                   |
                 HTTP

                   |

              Gin Backend

                   |

        --------------------

        Handler Layer

        Service Layer

        Repository Layer

                   |

             PostgreSQL

```

---

# Backend Design

后端采用分层设计：

```
backend/

├── cmd/
│   └── server/
│
├── internal/
│
│   ├── handler/
│   │
│   ├── service/
│   │
│   ├── repository/
│   │
│   ├── model/
│   │
│   └── middleware/
│
└── pkg/

```

职责：

## Handler

负责：

- HTTP 请求解析
- 参数校验
- 返回响应


## Service

负责：

- 核心业务逻辑
- 权限判断


## Repository

负责：

- 数据库访问
- SQL 操作

---

# Database Design

初步设计：

## users

用户信息：

```
id
username
password_hash
created_at
updated_at
```

---

## notes

笔记：

```
id
user_id
title
content
created_at
updated_at
```

关系：

```
User 1 ---- N Notes
```

---

## tags

标签：

```
id
name
```

---

## note_tags

笔记与标签关联：

```
note_id
tag_id
```

关系：

```
Note N ---- N Tag
```

---

# Development Plan

## Phase 1: Basic Full Stack

目标：

完成最小闭环。

内容：

- React 项目初始化
- Gin 服务初始化
- 前后端通信
- 数据库连接
- CRUD


---

## Phase 2: Authentication

目标：

实现完整用户系统。

内容：

- 注册
- 登录
- JWT
- Middleware
- 权限控制


---

## Phase 3: Feature Development

内容：

- Markdown 编辑
- 标签系统
- 搜索


---

## Phase 4: Engineering Improvement

内容：

- Redis
- Docker
- 部署
- 日志
- 性能优化


---

# Future Exploration

未来可能加入：

## Search Engine

探索：

- Elasticsearch
- Meilisearch
- Rust 搜索服务


## Distributed System

探索：

- 服务拆分
- 消息队列
- 高并发设计


## AI Integration

探索：

- 本地模型
- RAG
- 知识库问答

---

# Learning Goals

通过这个项目，希望掌握：

- 如何设计一个完整 Web 系统
- 如何连接前端、后端、数据库
- 如何处理真实工程问题
- 如何进行项目架构设计
- 如何为未来后端 / 系统方向学习打基础

---

# Status

🚧 In Development

Started: 2026 Summer

Goal:

完成一个可部署、可展示、可写入简历的全栈项目。
