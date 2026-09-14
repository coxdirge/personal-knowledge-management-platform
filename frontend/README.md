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

| 命令                   | 用途                                 |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | 启动 Vite 开发服务器                 |
| `npm run lint`         | 执行 ESLint 检查（含格式与类名约定） |
| `npm run format`       | 用 Prettier 写入格式化结果           |
| `npm run format:check` | 检查格式但不写入                     |
| `npm run build`        | 执行 TypeScript 检查并构建至 `dist/` |
| `npm run preview`      | 本地预览已生成的构建产物             |

`preview` 仅启动前端预览服务，API 请求仍需要独立运行的后端。

## 代码风格

格式由工具保证，不靠人工维持：Prettier 负责排版，ESLint 检查格式（`prettier/prettier`）并强制下面的类名约定（`pkmp/one-class-per-line`）。改完代码跑一次 `npm run lint`，报错即为不合规。

### className 约定

每个工具类独占一行，块首尾各留一个换行。单类名不例外：

```jsx
<div
  className="
    flex
    items-center
    gap-2
  "
/>
```

`${}` 插值内部另有一套规则：两个字类以上才拆行，单个类名保持内联。

```jsx
className={`
  flex
  ${isActive ? "ring-2" : "opacity-60"}
`}
```

规则覆盖 `className="..."`、`className={`...`}`，以及插值表达式中嵌套的字符串字面量。不覆盖 `className={variable}`、`className={fn(...)}` 和对象属性 `className`。

这条约定只能一次性整理加工具兜底：Prettier 不拆分字符串内部，所以 `normalize-classnames.mjs` 负责批量重写（幂等，可重复执行），ESLint 规则负责守住新增代码。

```bash
node scripts/normalize-classnames.mjs
```

### 不要安装 prettier-plugin-tailwindcss

它默认移除 className 中的多余空白，会把上面这种多行写法压回单行，直接摧毁本约定。类名排序不是本项目的需求。

### 深色模式

`index.css` 通过 `@custom-variant dark` 把 `dark:` 映射到 `.dark` class，由 `useTheme` 切换。

独立 CSS 文件（如 `Navbar.css`）必须**在自己的文件顶部重复声明一次** `@custom-variant dark`。Tailwind 为每个 CSS 模块单独编译，`index.css` 的声明不会跨文件生效；缺失时 `@variant dark` 会静默退化成 `@media (prefers-color-scheme: dark)`，构建不报错，但样式会跟随操作系统主题而非页面开关。
