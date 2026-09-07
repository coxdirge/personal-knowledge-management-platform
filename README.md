# Personal Knowledge Management Platform

一个使用 React、TypeScript 和 Go 构建的知识管理项目，用于记录、保存和管理笔记。项目采用前后端分离架构，以 PostgreSQL 持久化数据，并提供 REST API。

当前处于早期开发阶段：后端已实现笔记 CRUD，仓库中的前端提供基础 API 连通性页面，完整笔记界面仍在开发中。

## 功能与状态

| 功能 | 状态 |
| --- | --- |
| 创建、列出、读取、更新和删除笔记 | 后端 API 已实现 |
| 按最后更新时间倒序返回笔记 | 已实现 |
| PostgreSQL 持久化与启动时自动建表 | 已实现 |
| 请求参数校验与 JSON 错误响应 | 已实现 |
| 前后端连通性页面 | 已实现 |
| 浏览器内笔记管理界面 | 开发中 |
| 用户注册、登录与笔记权限隔离 | 计划中 |
| Markdown、标签与搜索 | 计划中 |
| 缓存与容器化部署 | 计划中 |

当前 API 没有身份认证或用户隔离，适用于本地开发与功能验证，尚不具备多用户服务的访问控制能力。

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 前端 | React 19、TypeScript、Vite |
| 后端 | Go、Gin |
| 数据访问 | GORM、PostgreSQL |
| 接口调试 | Bruno 请求集合 |
| 后端热重载（可选） | Air |

## 快速开始

### 1. 准备环境

- Go 1.26.5 或更高版本，以 `backend/go.mod` 为准。
- Node.js 22.12+ 与 npm（依赖也支持 Node.js 20.19+ 的 20.x 版本）。
- 已启动的 PostgreSQL，以及具有建库、建表权限的数据库账户。
- Git。

```bash
git clone https://github.com/coxdirge/personal-knowledge-management-platform.git
cd personal-knowledge-management-platform
```

### 2. 配置数据库

先使用自己的 PostgreSQL 账户创建数据库，将以下命令中的 `your_db_user` 替换为实际用户名：

```bash
createdb -h localhost -U your_db_user pkm
```

数据库连接目前直接配置在 [`backend/internal/database/database.go`](backend/internal/database/database.go) 的 `Connect` 函数中，尚未接入环境变量或 `.env` 加载。启动前请将 `dsn` 改为自己的连接信息，例如：

```go
dsn := "host=localhost port=5432 user=your_db_user password=your_db_password dbname=pkm sslmode=disable"
```

根据本地 PostgreSQL 的认证方式设置或省略 `password`。示例中的 `sslmode=disable` 用于本地开发；请勿将真实数据库密码提交到仓库。

后端启动时通过 GORM `AutoMigrate` 创建或更新 `notes` 表，无需手动执行建表 SQL。当前数据模型包含 `id`、`title`、`content`、`created_at` 和 `updated_at`。

### 3. 启动后端

在项目根目录执行：

```bash
cd backend
go mod download
go run ./cmd/server
```

服务监听 `http://localhost:8080`。可在另一个终端检查接口：

```bash
curl http://localhost:8080/api/hello
```

预期返回：

```json
{"message":"hello from backend"}
```

数据库连接和自动迁移发生在 HTTP 服务启动之前，因此访问此接口也需要先配置好数据库。

如果已经安装 Air，也可以在 `backend/` 目录运行 `air`，使用仓库中的 `.air.toml` 热重载配置。

### 4. 启动前端

另开终端，在项目根目录执行：

```bash
cd frontend
npm ci
npm run dev -- --port 5173 --strictPort
```

打开 `http://localhost:5173`。当前已提交的前端页面会请求 `/api/hello`，成功后显示 `hello from backend`；笔记操作可先通过下方 API 或 Bruno 体验。

前端示例中的后端地址为 `http://localhost:8080`。后端允许的跨域来源为 `http://localhost:5173` 和 `http://localhost:5174`；如果更换地址或端口，需要同步调整前端请求地址和 [`backend/cmd/server/main.go`](backend/cmd/server/main.go) 中的 CORS 配置。

## 笔记 API

基础地址：`http://localhost:8080/api`。

| 方法 | 路径 | 用途 | 成功状态码 |
| --- | --- | --- | --- |
| `GET` | `/hello` | 连通性检查 | `200` |
| `POST` | `/notes` | 创建笔记 | `201` |
| `GET` | `/notes` | 获取全部笔记，按更新时间倒序 | `200` |
| `GET` | `/notes/:id` | 获取单条笔记 | `200` |
| `PUT` | `/notes/:id` | 更新笔记的指定字段 | `200` |
| `DELETE` | `/notes/:id` | 删除笔记 | `204` |

创建笔记时 `title` 必填，`content` 可选：

```bash
curl -X POST http://localhost:8080/api/notes \
  -H 'Content-Type: application/json' \
  -d '{"title":"第一条笔记","content":"记录一个想法。"}'
```

列出笔记：

```bash
curl http://localhost:8080/api/notes
```

更新笔记时，将 `1` 替换为创建接口返回的 `id`：

```bash
curl -X PUT http://localhost:8080/api/notes/1 \
  -H 'Content-Type: application/json' \
  -d '{"content":"更新后的内容。"}'
```

`PUT` 支持只更新 `title` 或 `content`，至少需要一个非 `null` 字段；未提供的字段保持原值。列表接口目前不支持分页或搜索。

笔记查询、创建和更新成功时返回 `{"data": ...}`，其中列表的 `data` 是数组，单条笔记的 `data` 是对象；时间字段使用 `created_at` 和 `updated_at`。删除成功返回 `204`，无响应体。错误响应格式为：

```json
{"code":400,"message":"invalid note id"}
```

### 使用 Bruno 调试

请求集合位于 [`docs/api/bruno/personal-knowledge-management-platform`](docs/api/bruno/personal-knowledge-management-platform)。使用支持该 OpenCollection YAML 格式的 Bruno 打开集合，选择 `local` 环境，确认 `baseUrl`，创建笔记后将 `noteId` 更新为返回的 ID，即可调试读取和删除请求。现有 Update Note 请求的 URL 使用固定 ID，执行前也需替换为实际笔记 ID。

## 项目结构

```text
backend/
├── cmd/server/          # 服务入口、路由与依赖组装
└── internal/
    ├── database/        # PostgreSQL 连接
    ├── dto/             # 请求与响应数据结构
    ├── handler/         # HTTP 参数解析、校验与响应
    ├── model/           # 数据库模型
    ├── repository/      # 数据读写
    ├── response/        # JSON 响应辅助函数
    └── service/         # 笔记业务逻辑
frontend/
└── src/                 # React 应用入口、组件与样式
docs/                   # 设计资料与 Bruno 请求集合
```

后端请求依次经过 `Router → Handler → Service → Repository → PostgreSQL`。服务入口负责初始化数据库并组装各层依赖，HTTP 处理、业务逻辑和数据访问分别维护。

## 开发检查

前端静态检查与生产构建：

```bash
cd frontend
npm run lint
npm run build
```

后端编译与测试入口（从项目根目录执行）：

```bash
cd backend
go build ./...
go test ./...
```

当前仓库尚未包含 Go 自动化测试用例；`go test ./...` 不能替代运行服务后的 API 验证。前端构建产物输出到 `frontend/dist/`，可在 `frontend/` 运行 `npm run preview` 本地预览。

## 后续方向

- 完善笔记管理界面与交互反馈。
- 增加用户认证、授权与笔记归属。
- 支持 Markdown、标签和搜索。
- 引入外部配置、版本化数据库迁移、自动化测试与容器化部署。

[`docs/architecture.md`](docs/architecture.md)、[`docs/database.md`](docs/database.md) 和 [`docs/decisions.md`](docs/decisions.md) 保留了架构设计与决策记录，其中包含尚未实现的设计；当前可用能力以本 README 和代码为准。
