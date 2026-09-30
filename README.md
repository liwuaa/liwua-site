# liwua-site

个人主页静态站，通过 Cloudflare Pages 部署，绑定域名 `liwua.qzz.io`。

## 本地预览

用浏览器直接打开 `index.html`，或任意静态服务器：

```bash
npx --yes serve .
```

## 部署

1. 推送到 GitHub 仓库 `liwuaa/liwua-site`
2. 在 Cloudflare Pages 连接该仓库，构建命令留空，输出目录为 `/`
3. 绑定自定义域名 `liwua.qzz.io`
