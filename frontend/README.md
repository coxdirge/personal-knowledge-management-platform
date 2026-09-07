# Frontend

Personal Knowledge Management Platform 的 Web 前端，使用 React、TypeScript 和 Vite。

完整的环境准备、数据库配置与后端启动步骤见[项目 README](../README.md)。当前已提交的页面用于验证前后端通信：请求 `http://localhost:8080/api/hello` 并显示返回消息。笔记管理界面仍在开发中。

## 本地开发

先按项目 README 启动后端，再在本目录执行：

```bash
npm ci
npm run dev -- --port 5173 --strictPort
```

访问 `http://localhost:5173`。后端 CORS 允许 `http://localhost:5173` 和 `http://localhost:5174`；更换端口时需要同步调整后端配置。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run lint` | 执行 ESLint 检查 |
| `npm run build` | 执行 TypeScript 检查并构建至 `dist/` |
| `npm run preview` | 本地预览已生成的构建产物 |

`preview` 仅启动前端预览服务，API 请求仍需要独立运行的后端。
