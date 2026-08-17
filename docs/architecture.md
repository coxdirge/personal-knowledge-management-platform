# Architecture Design

## Overview

Personal Knowledge Management Platform 采用前后端分离架构。

整体结构：

Browser
    |
    |
React Frontend
    |
 HTTP / REST API
    |
Gin Backend
    |
 PostgreSQL


系统主要分为：

- Frontend Layer
- Backend Layer
- Persistence Layer

---

# Frontend Architecture

## Responsibilities

Frontend 负责：

- 用户交互
- 页面渲染
- 状态管理
- API调用
- 用户体验


技术：

- React
- TypeScript
- Tailwind CSS


目录：

frontend/

src/

├── components/
├── pages/
├── hooks/
├── services/
├── stores/
└── utils/


说明：

components:
可复用UI组件


pages:
页面级组件


services:
封装后端API请求


hooks:
React逻辑复用


---

# Backend Architecture


Backend采用分层设计。


Request Flow:

Client

↓

Router

↓

Middleware

↓

Handler

↓

Service

↓

Repository

↓

Database



## Handler Layer

职责：

HTTP协议相关逻辑。


例如：

- 参数解析
- 请求验证
- 返回JSON


不负责：

- 复杂业务逻辑


---

## Service Layer


职责：

业务逻辑。


例如：

创建笔记：

1. 验证用户权限
2. 检查数据合法性
3. 调用Repository保存


---

## Repository Layer


职责：

数据访问。


负责：

- SQL
- ORM操作
- 数据查询


业务代码不直接操作数据库。


---

# Why Layered Architecture?

原因：

避免代码耦合。

如果所有逻辑写在Handler：

问题：

- 难测试
- 难修改
- 难扩展


分层以后：

业务逻辑独立于具体数据库实现。

---

# Future Evolution

当前：

单体架构。


未来可能：

Backend Service

拆分：

Auth Service

Note Service

Search Service


