# dsh-token-stats — Token 用量统计插件

统计 [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness) (DSH) 各**模型 / 日期 / 会话**的 token 用量与费用估算（USD/CNY），
入口在 **设置面板 → 📊 Token 统计** 页签。安装为 DSH 外部插件，随 DSH 启动自动加载，**无需手动运行**。

[English README](./README.md)

## 功能

- 📊 原生设置页（跟随 DSH 主题深浅色、中英双语）
- 📈 按天 / 周 / 月趋势折线图（纯 SVG，零第三方依赖）
- 💰 内置单价表（DeepSeek / GPT / Claude / Gemini / Qwen 等）估算 USD/CNY 费用
- 🔁 启动时自动回溯全部历史会话日志，统计跨重启保留
- ⚡ 高性能：会话标题批量读取 + 内存缓存（TTL 5 分钟）、summary 单次遍历、单价/费用记忆化
- 📤 CSV / JSON 导出，支持按模型、会话筛选

## 安装

以 DSH profile 外部依赖方式安装：

1. 克隆 / 复制本仓库到本地目录，如 `D:\dev\dsh-token-stats`
2. 修改 DSH profile 清单（`~/.dsh/profiles/web/package.json`）：

   ```jsonc
   {
     "dependencies": {
       "dsh-token-stats": "file:D:/dev/dsh-token-stats"
     },
     "dsh": {
       "profile": {
         "bundles": ["@deepseek-ai/dsh-base", "@deepseek-ai/dsh-web-app", "dsh-token-stats"]
       }
     }
   }
   ```

3. `cd ~/.dsh/profiles/web && pnpm install`
4. 重启 DSH web，打开 **设置面板 → 📊 Token 统计**。

> `cordis.patch.yml` 声明 bundle 层挂载点，插件随启动自动加载。

## 工作原理

- **权威数据** = DSH 持久化会话日志：`assistant/message` 事件携带真实 `usage`
  （输入 / 输出 / 缓存读 / 缓存写 / 推理 token），`request/header` 事件携带 provider/model
- 启动时一次性回溯（`sessionQuery`，有界并发）重建内存聚合索引
- `llm/stream` 瀑布流捕获流式 usage 用于实时累计（仅展示，不入库）
- adapter 未上报 usage 时用 `tokenMeter.estimateMessage` 估算并标记 `estimated`

## HTTP API（`/token-stats/api`）

| op | 用途 |
| --- | --- |
| `summary` | 今日 / 本周 / 本月 / 累计聚合 |
| `query` | 按天/周/月粒度序列 + 按模型/会话聚合（可筛选 `model`、`sessionId`、`from`、`to`） |
| `models` | 内置单价表（USD/1M tokens）+ 汇率 |
| `sessions` | 会话列表（id + 标题） |
| `export` | CSV / JSON 导出（`format=csv\|json`，可带 `model` / `sessionId` 筛选） |

## 开发与测试

```powershell
node --check index.js      # 服务端半
node --check client.js     # 浏览器端半
node test-plugin.js        # 独立 mock 测试：正确性 + 性能基准
.\sync-deploy.ps1          # 把源码同步进 DSH profile（之后重启 DSH web 生效）
```

## 性能

作者机器实测（14 会话 / 10k 条记录）：

| 接口 | 优化前 | 优化后 |
| --- | --- | --- |
| `sessions` | ~1700ms（N 次串行 `readTitle`） | ~12ms（一次批量 `readTitleSnapshots` + 缓存） |
| `summary` | ~110ms（4 次全量 filter） | <1ms（单次遍历） |
| `query` | ~10ms | 10k 记录下 ~18ms（费用记忆化） |

## License

[MIT](./LICENSE) © 2026 quansheng
