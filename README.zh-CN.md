<p align="center"><img src="assets/icon.png" width="96" alt="拉普拉斯的迷你世界"></p>

<h1 align="center">拉普拉斯的迷你世界 · MCP 服务</h1>

<p align="center"><a href="README.md">English</a> · <b>中文</b></p>

把 [world.lapla.si](https://world.lapla.si/zh/) 上能动手的 3D 科学模型，直接放进 ChatGPT、Claude、Cursor 和其他支持 MCP 的 AI 对话里。

问一句「为什么会有四季？」「给我看看喷气发动机怎么工作」「用迷你世界给我看看黑洞」，助手就会找到对应的模型，把它放进对话：可以转动它，一章一章看，在实验室里改参数，比如把地轴的倾角调成 0°。

```
https://world.lapla.si/mcp
```

不用账号，不用 API Key，不用登录；只读；Streamable HTTP。

<p align="center">
  <img src="screenshots/chatgpt-turbofan-zh.jpg" width="420" alt="ChatGPT 对话里的涡扇发动机模型">
</p>

## 这些模型是什么

[拉普拉斯的迷你世界](https://world.lapla.si/zh/)（Laplace’s Mini World）有一百多块“图版”：每块图版是一个在浏览器里运行的 3D 模型，配一篇简短的图文和出处，还有一个可以动手试的实验室。每块图版都写明它简化了什么。中英文都有。

| 层 | 展厅（图版数） |
|---|---|
| 自然 | 宇宙（10）· 地球与天空（13）· 物质、光与声（17）· 生命与医疗（10） |
| 技术 | 经典机器（15）· 能源、航天与探测（8）· 芯片与信息（6）· 人工智能（4） |
| 思想 | 数学（22） |

比如：四季、潮汐、日食、黑洞、猎户座流星雨、飓风、海啸、彩虹、涡扇发动机、托卡马克、EUV 光刻、安提基特拉机械、恩尼格玛密码机、感知机、Transformer 的注意力、CRISPR、傅里叶级数、洛伦茨吸引子、霍普夫纤维化。完整目录见 [`/models.json`](https://world.lapla.si/models.json) 和 [`/llms.txt`](https://world.lapla.si/llms.txt)。

## 工具

三个工具都是只读的（`readOnlyHint: true`、`destructiveHint: false`、`openWorldHint: false`、`idempotentHint: true`）。

| 工具 | 输入 | 返回 |
|---|---|---|
| `search_models` | `query`、`lang?`（`zh`/`en`）、`limit?`（1–10） | 和话题最相关的图版，带 id 和简介 |
| `show_model` | `slug`、`chapter?`、`lang?`、`lab?`、`params?` | 活的模型（[MCP Apps](https://modelcontextprotocol.io/extensions/apps) 界面），外加一段文字简介和图版链接；不支持界面的客户端也能拿到文字 |
| `list_chapters` | `slug`、`lang?` | 图版的章节和实验室参数（id、范围、选项） |

服务支持 MCP 2026-07-28（无状态、`server/discover`），也支持之前带握手的版本（2025-11-25、2025-06-18、2025-03-26）。交互界面是一个 `ui://` 资源，mimeType 为 `text/html;profile=mcp-app`。

## 怎么接入

### ChatGPT

1. 在 chatgpt.com：**设置 → 应用（Plugins）→ 添加 → 自定义 MCP 服务器**。有的套餐需要先打开开发者模式。
2. URL 填 `https://world.lapla.si/mcp`，认证选 **无**。
3. 试试：「用拉普拉斯的迷你世界给我看看为什么会有四季。」

### Claude（网页版、桌面版、手机）

1. **Customize → Connectors → Add custom connector**。所有套餐都能加自定义连接器，免费版可以加一个。
2. 名称：`拉普拉斯的迷你世界`；URL：`https://world.lapla.si/mcp`；不需要登录。
3. 试试：「用拉普拉斯的迷你世界给我看看涡扇发动机。」

<p align="center"><img src="screenshots/claude-connector-settings.jpg" width="480" alt="Claude 设置里的连接器"></p>

### Claude Code

```sh
claude mcp add --transport http laplace-mini-world https://world.lapla.si/mcp
```

### Cursor

`~/.cursor/mcp.json`（或项目里的 `.cursor/mcp.json`）：

```json
{
  "mcpServers": {
    "laplace-mini-world": { "url": "https://world.lapla.si/mcp" }
  }
}
```

### VS Code（GitHub Copilot）

`.vscode/mcp.json`：

```json
{
  "servers": {
    "laplace-mini-world": { "type": "http", "url": "https://world.lapla.si/mcp" }
  }
}
```

### Gemini CLI

`~/.gemini/settings.json`：

```json
{ "mcpServers": { "laplace-mini-world": { "httpUrl": "https://world.lapla.si/mcp" } } }
```

Gemini 不显示 MCP Apps 界面，工具会用文字回答，并附上图版链接。

### 其他客户端

- 支持 Streamable HTTP 的客户端：直接填 `https://world.lapla.si/mcp`。
- 只能运行本地（stdio）服务的客户端：用 [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) 转接：

```json
{
  "mcpServers": {
    "laplace-mini-world": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://world.lapla.si/mcp"]
    }
  }
}
```

- 直接用 HTTP：见 [`examples/curl.sh`](examples/curl.sh)。

```sh
curl -s https://world.lapla.si/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -H 'MCP-Protocol-Version: 2025-06-18' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_models","arguments":{"query":"黑洞","lang":"zh"}}}'
```

## 截图

| | |
|---|---|
| ![涡扇发动机，封面](screenshots/chatgpt-turbofan-zh-cover.jpg) | ![涡扇发动机，下一章](screenshots/chatgpt-turbofan-zh.jpg) |
| 在 ChatGPT 里用中文提问，打开涡扇发动机 | 翻到下一章 |

![对话里的四季模型，右边全屏的是涡扇发动机](screenshots/chatgpt-seasons-en-fullscreen.jpg)
*用英文打开的四季模型；右边是全屏打开的涡扇发动机。*

![直接打开潮汐模型的实验室，并列出章节](screenshots/chatgpt-tides-lab-zh.jpg)
*潮汐模型直接打开在实验室，章节由 `list_chapters` 列出。*

## 目录、嵌入页和 oEmbed

服务用到的数据都是公开的。

### `models.json`

[`https://world.lapla.si/models.json`](https://world.lapla.si/models.json) 列出每块图版：slug、图版号、中英文标题、眉题、简介和描述、展厅和层、图版和嵌入页地址、卡片图、章节（带 id）、实验室参数（id、类型、范围或选项、默认值）。[`examples/models.mjs`](examples/models.mjs) 用 Node 搜索它：

```sh
node examples/models.mjs 潮汐 zh
```

[`/llms.txt`](https://world.lapla.si/llms.txt) 和 [`/llms-full.txt`](https://world.lapla.si/llms-full.txt) 遵循 [llmstxt.org](https://llmstxt.org)。

### 嵌入页

每个模型都有一个只放舞台、随框大小变化的页面：

```
https://world.lapla.si/embed/{lang}/{slug}/
```

| 参数 | 作用 |
|---|---|
| `chapter=<id>` | 打开在某一章（默认封面） |
| `lab=1` | 打开实验室 |
| `theme=light` / `dark` | 跟随宿主的主题（默认跟随系统） |
| `ui=0` | 只显示模型，只留一个回到原站的链接 |
| `<参数 id>=<值>` | 实验室参数：滑块填数字，选项填选项 id，开关填 `1`/`0`，`play=1` |

例子：`https://world.lapla.si/embed/zh/seasons/?chapter=tilt&theme=dark`

**能嵌在哪里：** 目前嵌入页只允许 world.lapla.si 和 AI 对话平台（ChatGPT、Claude）用 iframe 嵌入。在其他网站上，请链接到图版（`https://world.lapla.si/{lang}/{slug}/`）；想在自己的网站或课程页里嵌入模型，请写信到 contact@lapla.si。

### oEmbed

```
https://world.lapla.si/oembed?url=https://world.lapla.si/zh/seasons/&format=json
```

返回 `rich` 类型的结果，带嵌入 iframe 和卡片图。图版页里有 oEmbed 的发现 `<link>`。

## 隐私

服务不保存、不记录任何关于你的信息：没有账号、Cookie 和会话。工具的输入（搜索词、图版 id、章节 id、实验室参数）只用来生成回答。对话里显示的模型不运行任何统计。详见网站的[隐私说明](https://world.lapla.si/zh/privacy/)。

## MCP Registry

TODO：之后会在这里加上提交到 [MCP Registry](https://registry.modelcontextprotocol.io) 用的 `server.json`。

## 许可

- 模型、文章、图片和截图：[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.zh-hans)，© 拉普拉斯的迷你世界（world.lapla.si）。数据集保留各自的许可，写在每块图版上。
- 本仓库里的示例代码和配置片段（`examples/` 和两份 README 里的代码块）：[MIT](LICENSE)。

服务器的源代码不在这个仓库里。

## 联系

contact@lapla.si · [world.lapla.si](https://world.lapla.si/zh/)
