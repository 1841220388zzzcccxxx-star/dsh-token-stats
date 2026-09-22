<!-- handoff:auto:start -->
# 项目交接

## 项目概况

- 项目名称：dsh-token-stats — DeepSeek Harness Token 用量统计插件
- 用途：统计 DSH 各模型/日期/会话的 token 用量与费用（USD/CNY），设置面板 → 📊 Token 统计 页签展示；DSH 外部插件，随启动自动加载
- 技术栈：Node.js ESM + Cordis 插件（服务端 index.js / 客户端 client.js）；前端零第三方依赖（原生 SVG/React 运行时）；PowerShell 部署脚本
- 主要入口：index.js（服务端：事件采集/回溯/聚合//token-stats/api）；client.js（浏览器：settings.section 页签）；cordis.patch.yml（bundle 挂载点）；sync-deploy.ps1（部署）

## 当前状态

- 状态：功能可运行；本轮完成设置页布局重构（单列全宽：去左右分栏、去重复横条列表、间距字号全面放大）
- 最后更新：2026-09-22T10:54:00+08:00

## 本次变更

本轮（用户反馈"列表长且丑 / 左右分栏乱 / 太紧凑"）：页面由「双列 split」改为单列垂直流。① 删除 `.tkst-split` 左右分栏与左栏重复的「按模型统计」横条列表（`tkst-bars`，模型名被截断且与右侧表格数据重复）；模型统计只保留全宽表格一份。② 工具栏拆两行：控件行（粒度分段/模型筛选/会话搜索/刷新/导出）+ 汇总 chips 行（Σ tokens/费用/调用/汇率/更新时间）。③ 间距字号全面放大：page gap 14→18、panel padding 10/12→16/18、表格行 padding 7/10→9/14 且字号 12→13、max-height 420→480、卡片 padding 与字号上调、圆角 12→14、输入框 min-width 160→200。④ 会话表显示标题：新增 `sessTitleMap`（join `op=sessions` 的 title），不再展示原始 UUID；费用构成/模型/会话三个分区表头加计数 meta。⑤ 清理死 CSS（tkst-grid/tkst-bars/tkst-split）。测试锚点保持不变（`slot * 0.85`、`H = 230`、`tkst-grad-` 等），`node --check` + test-client-refs（14 项）+ test-plugin（35 项）全过。

## 验证结果

node --check 两文件通过；node test-client-refs.js 14 项全过；node test-plugin.js 35 项全过；本轮已 sync-deploy，待重启验收。

## 待办与阻塞

用户需重启 DSH web 使新 client.js 生效；README 截图 docs/demo.png 仍是旧版 UI（旧布局/分栏版），建议重启后重截。

## 常用命令

sync-deploy.ps1（改源码后同步到 profile，需重启 DSH）；node test-plugin.js（服务端测试）；node test-client-refs.js（前端引用/渲染检查）；node --check index.js / client.js

## 交接记录

<!-- handoff:history:start -->
- [2026-08-22T19:35:55+08:00] 目标：修复 Token 统计页白屏崩溃并做回归验证；结果：已完成：修复 t 未定义引用，加错误边界，新增前端引用测试，已部署并推送（commit 6f5df43）；下一步：用户重启 DSH web 验收；后续可选：费用卡片+预算条 / 时间范围快捷键 / ECharts 交互图 / 偏好记忆；README 截图更新
- [2026-09-22T10:54:00+08:00] 目标：优化 Token 统计页（列表长且丑 / 左右分栏乱 / 太紧凑）；结果：已完成：单列全宽布局重构（删 .tkst-split 分栏 + 重复的 tkst-bars 模型横条列表）、工具栏两行化、间距字号圆角全面放大、会话表标题化（sessTitleMap join op=sessions）、三分区表头计数 meta、清死 CSS；14+35 项测试全过；下一步：用户重启 DSH web 验收；后续可选：README demo.png 重截 / 表格行数偏好 / 模型表内嵌占比小条
<!-- handoff:history:end -->
<!-- handoff:auto:end -->

## 人工补充

### 版本与修改历史（git 提交时间序）

| 版本/提交 | 内容 |
|---|---|
| `c7a60c2` Initial commit | 初版：会话日志采集、历史回溯、/token-stats/api、设置页统计页签、CSV/JSON 导出 |
| `b53474c` | 开源准备：README 中英双语、MIT LICENSE、.gitignore、docs/demo.png 界面截图 |
| `9ce8088` Perf | 性能优化：sessions 批量读标题+缓存（1.7s→12ms）、summary 单次遍历、单价/费用记忆化、backfill 并发；前端 stale-while-revalidate 缓存、60s 自动刷新、手动刷新按钮、「最后更新」时间戳 |
| `451cc01` UI | 双列网格、会话搜索框、表格列头排序、卡片+模型表环比、三层钻取（模型→会话→每日明细）；服务端 summary.prev + models.prevTotal |
| `3a406bd` UI | 趋势折线图→可悬停柱状图 |
| `d34c78b` UI | 细柱+圆角+网格线+按模型堆叠柱（series.models）+修复设置页横向溢出（响应式 grid、tablewrap、会话名截断） |
| `488217e` UI | 堆叠柱压密（柱宽85%）、图表加高 230px、近 30 天、鲜亮 8 色板、顶部汇总条、表格 20 行、tooltip 加调用+费用 |
| `6f5df43` Fix | **修复白屏崩溃**（见历史问题）+ StatsErrorBoundary 错误边界 + test-client-refs.js |
| 工作区打磨（提交于本轮） | UI 美术升级：卡片 accent/spark/delta 芯片、分段粒度控件、渐变堆叠柱+总量线、费用环图、模型色贯穿、sticky 表、骨架屏、StatsView page 数组组装 |
| 本轮（提交于本轮） | UI 布局重构：单列全宽（删左右分栏 tkst-split + 重复模型横条列表 tkst-bars）、工具栏两行化、间距/字号/圆角全面放大、会话表标题化（sessTitleMap）、分区表头计数、清死 CSS |

### 升级 / 部署方法

1. 改完源码后：`.\sync-deploy.ps1`（直接把 index.js/client.js/package.json/cordis.patch.yml 复制到 `C:\Users\18412\.dsh\profiles\web\node_modules\dsh-token-stats` 再 `pnpm install`）。
   - 注意：pnpm 对 `file:` 依赖在 package.json 未变化时会**跳过**刷新副本，所以脚本必须手动先复制文件（已处理）。
2. **必须重启 DSH web**，新代码才加载（外部插件无 HMR）。
3. 云端：改完 `git add -A && git commit && git push origin main`（推送需临时 token 认证，token 用完在 GitHub 删除）。

### 历史问题与踩坑记录

- **白屏崩溃（已修，commit 6f5df43）**：`TrendChart` 是模块级函数，作用域内没有 `t` 变量（`t=T()` 只在 `StatsView` 内），tooltip 误用 `t.calls` → `ReferenceError` → React 整树卸载 → 页面全白。教训：组件外函数取词必须用 `T()`，且这类"变量未定义" `node --check` 查不出，需引用级伪执行测试（test-client-refs.js）。
- **pnpm 跳过副本刷新**：`file:` 依赖 package.json 未变时 `pnpm install` 不更新 node_modules 副本，改源码后必须手动 Copy-Item（sync-deploy.ps1 已内置）。
- **PowerShell 编码**：① `.ps1` 中文在 GBK 解析环境会乱码/报语法错 → 脚本需 UTF-8 BOM；② PowerShell→Python 传中文 argv 会被破坏 → 大段中文 JSON 数据需写临时 UTF-8 文件由 Python 侧读取；③ PowerShell `Invoke-RestMethod` 发中文 JSON body 会变 `?????` → 用 UTF-8 字节数组作 body。
- **GitHub 描述中文损坏**：第一次 PATCH description 中文变问号，改用 UTF-8 字节 body 后正常。
- **旧代码残留**：线上实例重启前一直加载旧代码，改完必须重启才能验证新效果；判断新代码是否生效可用 API 耗时对比（如 sessions ~11ms 为新版，~1500ms 为旧版）。
- **前端无法直接单测**：client.js 是 `window.__ModuleLoader__.load` 包裹，node 直接跑不了；test-client-refs.js 用 stub 环境 + 真实数据伪执行覆盖渲染路径。

### 已知待办（非阻塞）

- README.md 截图（docs/demo.png）还是旧版 UI，重启后建议重截一张替换。
- 后续可选优化（未做）：费用卡片+月度预算进度条 / 时间范围快捷按钮（近7天/30天）/ ECharts 交互图 / 用户偏好记忆（granularity/排序存 localStorage）。
