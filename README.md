# 🎵 Miuse - AI 音乐创作平台

免费的 AI 音乐生成与分享平台。在线创作、发布、发现好音乐。

## 功能

- 🎹 **AI 生成音乐** — 7 种风格 × 8 种调性，参数可调
- 🌐 **歌曲广场** — 发布、搜索、播放他人作品
- 👤 **用户系统** — 注册登录，管理自己的作品
- 💰 **充值虾币** — 解锁高级功能
- 📱 **响应式** — 手机/电脑都能用

## 技术栈

| 层 | 方案 | 费用 |
|---|---|---|
| 前端 | HTML/CSS/JS (Tone.js) | 免费 |
| 部署 | Vercel / Netlify | 免费 |
| 后端 | Supabase (Auth + DB + Storage) | 免费 |
| 域名 | xx.vercel.app (自带) → 后续可绑自定义域名 | 免费 |

## 一键部署 (5 分钟)

### 第 1 步：注册 Supabase

1. 打开 [supabase.com](https://supabase.com) 注册（用 GitHub 登录最快）
2. 创建新项目 → 设置数据库密码 → 选择 **新加坡** 区域（国内访问快）
3. 等 2 分钟项目初始化完成

### 第 2 步：初始化数据库

1. 进入项目 → **SQL Editor** → **New query**
2. 把 `schema.sql` 文件内容全部粘贴进去 → **Run**
3. 进入 **Storage** → 创建新 bucket，名称填 `songs`，勾选 "Public bucket"

### 第 3 步：获取 API 密钥

1. 进入 **Settings → API**
2. 复制 `Project URL`（类似 `https://xxxxx.supabase.co`）
3. 复制 `anon public key`
4. 打开 `index.html`，找到顶部这两行，替换：

```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';  // 改成你的 URL
const SUPABASE_KEY = 'YOUR_ANON_KEY';                      // 改成你的 key
```

### 第 4 步：部署到 Vercel

**方法 A：拖拽部署（最简单）**
1. 打开 [vercel.com](https://vercel.com) 注册
2. 把这个 `miuse` 文件夹直接拖到 Vercel 页面上
3. 等 10 秒，获得网址 `xxx.vercel.app`

**方法 B：GitHub 自动部署**
1. 把这个文件夹推送到 GitHub
2. 在 Vercel 中 Import GitHub 仓库
3. 之后每次 git push 自动更新

### 第 5 步：配置认证

1. Supabase → **Authentication → Settings**
2. 关闭 "Confirm email"（测试阶段）
3. 这样用户注册后直接就能登录

## 本地预览

直接双击 `index.html` 打开即可（本地模式下歌曲存在浏览器 localStorage 中）。

注意：本地模式没有后端，歌曲不会跨设备同步。部署后才完整。

## 充值说明

当前采用**人工确认**模式：
1. 用户选择充值金额 → 扫码付款
2. 联系客服确认（微信/飞书）
3. 后台手动增加虾币

后续可接入微信支付/支付宝（需营业执照）。

## 后续开发计划

- [ ] 歌词填写 + AI 歌词生成
- [ ] 用户主页、关注系统
- [ ] 评论、收藏
- [ ] 自动支付确认
- [ ] 自定义域名
- [ ] PWA 支持（安装到手机桌面）
