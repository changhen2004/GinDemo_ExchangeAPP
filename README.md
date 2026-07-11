# resource_community_go

基于 `Go + Gin + Gorm + Redis + RabbitMQ + Vue3` 的资源社区项目。

## 项目介绍

resource_community_go 是一个围绕“资源分享”场景构建的内容社区项目。  
项目当前包含用户系统、资源发布、资源浏览、点赞、评论、收藏、积分、签到、资源解锁、图片上传、热门资源流、异步 Worker 等能力。

## 技术栈

### 后端

- Go
- Gin
- Gorm
- MySQL
- Redis
- RabbitMQ
- JWT

### 前端

- Vue 3
- TypeScript
- Pinia
- Vue Router
- Element Plus
- Vite

## 功能

| 模块 | 功能 |
|------|------|
| 账号 | 注册、登录、Refresh Token、登出、Bearer Token 鉴权 |
| 资源 | 发布、列表、详情、分页、关键词搜索、标签筛选、最新/热度排序、资源解锁 |
| 点赞 | 点赞、点赞计数读取、RabbitMQ 异步落库、热度更新 |
| 评论 | 评论列表、发布、删除、RabbitMQ 异步积分发放、热度更新 |
| 收藏 | 收藏、取消收藏、我的收藏、热度更新 |
| 积分 | 积分余额、积分流水、每日签到、发布奖励、互动奖励、权益兑换 |
| 上传 | 封面图上传、正文配图上传 |
| 热榜 | Redis ZSet 热榜、浏览/点赞/评论/收藏参与热度计算、热榜缓存 |
| 工程 | Docker Compose、API/Worker 拆分运行、健康检查、pprof、GitHub Actions CI/CD |

## 项目结构

```text
resource_community_go/
├── backend/
│   ├── cmd/
│   │   └── worker/
│   ├── config/
│   ├── internal/
│   │   ├── app/
│   │   ├── article/
│   │   ├── asyncjob/
│   │   ├── auth/
│   │   ├── cachekey/
│   │   ├── comment/
│   │   ├── exchange/
│   │   ├── favorite/
│   │   ├── media/
│   │   ├── points/
│   │   └── worker/
│   ├── utils/
│   └── main.go
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── router/
│   │   ├── store/
│   │   ├── types/
│   │   └── views/
├── docs/
├── docker-compose.yml
└── README.md
```

## 后端模块说明

- `internal/auth`：认证与用户登录
- `internal/article`：资源发布、列表、详情、热榜
- `internal/comment`：评论相关能力
- `internal/favorite`：收藏相关能力
- `internal/points`：积分、签到、解锁、权益兑换
- `internal/media`：文件上传
- `internal/asyncjob`：异步任务定义与发布
- `internal/worker`：异步 Worker 消费处理
- `internal/app`：路由、鉴权、中间件、可观测性

## 接口清单

### 健康检查

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/healthz` | 否 | 服务健康检查 |

### 账号 `/api/auth`

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| POST | `/login` | 否 | 登录，返回 access_token + refresh_token |
| POST | `/register` | 否 | 注册 |
| POST | `/refresh` | 否 | 刷新 access_token |
| POST | `/logout` | JWT | 登出 |

### 资源 `/api/articles`

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/articles` | 否 | 资源列表，支持分页、排序、关键词、标签 |
| GET | `/articles/hot` | 否 | 热门资源列表 |
| GET | `/articles/:id` | 否 | 资源详情 |
| POST | `/articles` | JWT | 发布资源 |
| POST | `/articles/:id/unlock` | JWT | 积分解锁资源 |

### 点赞 `/api/articles`

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/articles/:id/like` | 否 | 获取点赞计数 |
| POST | `/articles/:id/like` | JWT | 点赞 |

### 评论 `/api`

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/articles/:id/comments` | 否 | 评论列表 |
| POST | `/articles/:id/comments` | JWT | 发布评论 |
| DELETE | `/comments/:id` | JWT | 删除评论 |

### 收藏 `/api`

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| POST | `/articles/:id/favorite` | JWT | 收藏资源 |
| DELETE | `/articles/:id/favorite` | JWT | 取消收藏 |
| GET | `/me/favorites` | JWT | 我的收藏列表 |

### 积分 `/api/me`

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/me/points` | JWT | 我的积分摘要 |
| GET | `/me/points/records` | JWT | 我的积分流水 |
| POST | `/me/check-in` | JWT | 每日签到 |
| POST | `/me/points/redeem` | JWT | 兑换权益 |

### 上传 `/api/uploads`

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| POST | `/uploads/cover` | JWT | 上传封面图 |
| POST | `/uploads/content-images` | JWT | 上传正文配图 |

### 汇率 `/api/exchangeRates`

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/exchangeRates` | 否 | 汇率查询 |
| POST | `/exchangeRates` | JWT | 发布汇率 |

## 本地运行

项目已提供 `.env.example`：

```bash
cp .env.example .env
```

### Docker Compose 启动

```bash
docker compose up --build
```

默认启动：

- MySQL
- Redis
- RabbitMQ
- Backend
- Worker
- Frontend

访问地址：

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000/api`
- Health Check: `http://localhost:3000/healthz`
- RabbitMQ 管理台: `http://localhost:15672`

停止：

```bash
docker compose down
```

### 分别启动

#### 启动后端

```bash
cd backend
go mod download
go run .
```

#### 启动 Worker

```bash
cd backend
go run ./cmd/worker
```

#### 启动前端

```bash
cd frontend
npm ci
npm run dev
```

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `RESOURCE_COMMUNITY_GO_APP_PORT` | `3000` | 后端监听端口 |
| `RESOURCE_COMMUNITY_GO_ENABLE_PPROF` | `false` | 是否开启 pprof |
| `RESOURCE_COMMUNITY_GO_SLOW_REQUEST_THRESHOLD_MS` | `500` | 慢请求阈值，单位毫秒 |
| `RESOURCE_COMMUNITY_GO_DATABASE_DSN` | `resource_community_go:resource_community_go@tcp(mysql:3306)/resource_community_go?charset=utf8mb4&parseTime=True&loc=Local` | MySQL 连接串 |
| `RESOURCE_COMMUNITY_GO_REDIS_ADDR` | `redis:6379` | Redis 地址 |
| `RESOURCE_COMMUNITY_GO_REDIS_PASSWORD` | 空 | Redis 密码 |
| `RESOURCE_COMMUNITY_GO_REDIS_DB` | `0` | Redis DB |
| `RESOURCE_COMMUNITY_GO_RABBITMQ_URL` | `amqp://guest:guest@rabbitmq:5672/` | RabbitMQ 连接地址 |
| `RESOURCE_COMMUNITY_GO_RABBITMQ_EXCHANGE` | `resource_community_go.async` | RabbitMQ Exchange |
| `RESOURCE_COMMUNITY_GO_RABBITMQ_QUEUE` | `resource_community_go.async.jobs` | RabbitMQ Queue |
| `RESOURCE_COMMUNITY_GO_JWT_SECRET` | `change-me-in-production` | JWT 签名密钥 |
| `RESOURCE_COMMUNITY_GO_UPLOAD_DIR` | `uploads` | 上传目录 |
| `VITE_API_BASE_URL` | `http://localhost:3000/api` | 前端 API 基地址 |

详见 `.env.example`。

## 测试

### 后端测试

```bash
cd backend
go test ./...
```

### 前端构建校验

```bash
cd frontend
npm run build
```

### Compose 配置校验

```bash
docker compose config
```


### CI

当前 CI 包含：

- 后端测试
- 前端构建
- Docker Compose 配置校验
- Docker 镜像构建校验
