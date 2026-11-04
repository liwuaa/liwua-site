# liwua-site

个人主页，托管于 Cloudflare Pages。

- 站点：https://liwua.qzz.io
- 备用：https://liwua-site.pages.dev
- 动效：anime.js（参考 [animejs.com](https://animejs.com) 的交错、路径描边与弹性交互）
- 基于NoStr的去中心化群组聊天：[Nostr Chat Client](https://liwua.qzz.io/Src/Nostr%20Chat%20Client.html)
  国内可只连中继服务器：wss://relay.agentry.com ，wss://relay.routstr.com
- HTTP请求测试工具：https://liwua.qzz.io/Src/请求测试工具.html
  

## 本地预览

用任意静态服务器打开根目录即可，例如：

```bash
npx serve .
```

## 部署

推送到 `main` 后，在 Cloudflare Pages 已连接 Git 的情况下会自动部署。
若项目仍显示 **No Git connection**，需在 Pages 设置里连接 GitHub 仓库 `liwuaa/liwua-site`。
