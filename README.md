# Copilot Orchestra Demo

基于 GitHub Copilot Custom Agent + Custom Skill 构建的**多 Agent 编排系统**演示项目。

以 `new-employee-mentor`（新员工导师）为统一入口，通过 **Planning → Routing → Execution** 三阶段工作流，将用户请求智能路由到最合适的 Agent 或 Skill 完成任务。

> 📖 **[完整架构文档 →](docs/architecture.md)** &nbsp;|&nbsp; 📋 **[Conductor 工作流 →](docs/conductor-workflow.md)** &nbsp;|&nbsp; 🧭 **[Mentor 工作流 →](docs/new-employee-mentor-workflow.md)**

---

## 架构概览

```
                        ┌───────────────────────────┐
                        │  👤 用户输入               │
                        └────────────┬──────────────┘
                                     ▼
                   ┌─────────────────────────────────────┐
                   │  new-employee-mentor (主入口 Agent)  │
                   │  Phase 1: Planning → Phase 2: Route │
                   │  → Phase 3: Execution               │
                   └──────────┬──────────────────────────┘
                              │ 11 条智能路由
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
     ┌──────────────┐ ┌────────────┐ ┌──────────────┐
     │  5 Agent     │ │  7 Skill   │ │ 直接实现     │
     │  ──────────  │ │  ──────    │ │ （简单任务） │
     │  code-review │ │  coding-   │ └──────────────┘
     │  code-testing│ │  standards │
     │  code-docs   │ │  github-   │
     │  code-debug  │ │  publish   │
     │  Conductor   │ │  micro-    │
     │              │ │  services  │
     │  + pr-review │ │  security- │
     │    -submit   │ │  audit     │
     │              │ │  playwright│
     │              │ │  feishu-   │
     │              │ │  docs      │
     │              │ │  code-     │
     │              │ │  review    │
     └──────────────┘ └────────────┘
                │
                ▼ (Conductor 路由)
     ┌─────────────────────────────┐
     │  Conductor 闭环子系统       │
     │  planning-subagent          │
     │  implement-subagent         │
     │  code-review-subagent       │
     └─────────────────────────────┘
```

---

## 快速开始

### 前提条件

- [VS Code](https://code.visualstudio.com/) 最新版本
- [GitHub Copilot](https://github.com/features/copilot) 订阅（支持 Custom Agent）
- 已安装 GitHub Copilot Chat 扩展

### 使用方式

在 VS Code 中打开本项目，通过 GitHub Copilot Chat 调用 Agent：

```
# 使用主入口（推荐，自动路由）
@new-employee-mentor 审查当前代码的安全风险
@new-employee-mentor 为 snake-game-logic.js 生成单元测试
@new-employee-mentor 提交代码并创建 PR
@new-employee-mentor 查询前端编码规范
@new-employee-mentor 帮我从零搭建一个 Express 微服务项目

# 直接调用特定 Agent
@code-review 审查最近的 PR 变更
@code-testing 为 workspace/ 下的代码生成 E2E 测试
@code-docs 为项目生成架构文档
@code-debug 分析这个报错截图
@Conductor 重构 snake-game 为 TypeScript 项目
```

### 示例项目

`workspace/` 目录包含一个贪吃蛇游戏示例，可用于体验各 Agent/Skill：

```bash
# 运行单元测试
cd workspace && npx vitest run

# 运行 E2E 测试
npx playwright test
```

---

## 三阶段工作流

| 阶段 | 说明 |
|------|------|
| **Phase 1: Planning** | 每次请求强制调用 `planning` Agent，研究代码上下文、分析意图、推荐路由 |
| **Phase 2: Routing** | 将 Planning 结果与 11 条决策树交叉验证，确认路由目标 |
| **Phase 3: Execution** | 加载 Skill/Agent 定义并按工作流执行，输出结构化结果 |

---

## Agent 列表

系统包含 **11 个 Agent**，分为入口、专职、编排、集成四类：

### 入口 Agent

| Agent | 用途 |
|-------|------|
| `new-employee-mentor` | 主入口，智能路由分发（三阶段工作流） |
| `planning` | 上下文研究、意图分析、路由推荐 |

### 专职 Agent

| Agent | 用途 | Handoff |
|-------|------|---------|
| `code-review` | 代码审查 + 安全检查 + 质量评估 | → `pr-review-submit`、→ `implement-subagent` |
| `code-testing` | 单元 / 集成 / UI / E2E 测试生成与执行 | → `implement-subagent`、→ `code-review` |
| `code-docs` | 文档 / 注释 / README 生成，支持同步飞书 | — |
| `code-debug` | 错误诊断：截图分析 → 知识库查询 → 代码定位 → 修复 | → `implement-subagent` |

### 编排 Agent

| Agent | 模型 | 用途 |
|-------|------|------|
| `Conductor` | Claude Opus 4.5 | 多阶段闭环编排（Planning → Implement → Review） |
| `planning-subagent` | Claude Sonnet 4.5 | Conductor 子 Agent：代码库调研 |
| `implement-subagent` | GPT-5.2-Codex | Conductor 子 Agent：TDD 实现 |
| `code-review-subagent` | Claude Sonnet 4.5 | Conductor 子 Agent：代码审查 |

### 集成 Agent

| Agent | 用途 |
|-------|------|
| `pr-review-submit` | 将审查结果自动写入 GitHub PR（行级评论 + Review 提交） |

---

## Skill 列表

系统包含 **7 个 Skill**，每个 Skill 由 `SKILL.md` + `references/` 目录组成：

| Skill | 用途 | 触发关键词 |
|-------|------|-----------|
| `coding-standards` | 全栈编码规范（TypeScript / React / Python / Go） | 规范、标准、命名、风格 |
| `github-publish` | 代码提交、创建 PR、指定审查者、合并代码 | 提交、commit、PR、merge |
| `microservices` | 微服务架构设计、容器化部署、K8s、CI/CD | 微服务、Docker、K8s |
| `security-audit` | OWASP Top 10 安全审计、漏洞扫描、依赖安全检查 | 安全审查、OWASP、漏洞 |
| `playwright-testing` | Playwright UI/E2E 自动化测试 | Playwright、UI 测试 |
| `feishu-docs` | 飞书文档 / 知识库 / 电子表格操作 | 飞书、Feishu、Lark |
| `code-review` | 代码审查清单（🔴MUST / 🟡SHOULD / 🟢NIT 三级） | 审查、review |

---

## 11 条智能路由

| # | 关键词 | 目标 | 类型 |
|---|--------|------|------|
| 1 | 审查 · review · 代码质量 | `code-review` Agent | Agent |
| 2 | 安全审查 · OWASP · 漏洞 | `security-audit` Skill | Skill |
| 3 | 文档 · 注释 · README | `code-docs` Agent | Agent |
| 4 | commit · PR · push · 合并 | `github-publish` Skill | Skill |
| 5 | 规范 · 标准 · 风格 | `coding-standards` Skill | Skill |
| 6 | 微服务 · Docker · K8s | `microservices` Skill | Skill |
| 7 | 测试 · E2E · Playwright | `code-testing` Agent | Agent |
| 8 | 报错 · Bug · 异常 · 诊断 | `code-debug` Agent | Agent |
| 9 | 搭建项目 · 大型重构 | `Conductor` Agent | Agent |
| 10 | 写小工具 · 简单实现 | Mentor 直接实现 | 直接 |
| 11 | 混合场景 | 按顺序执行多个 | 组合 |

---

## 目录结构

```
Copilot-orchestra-demo/
├── .github/agents/                    # Agent 定义（11 个）
│   ├── new-employee-mentor.agent.md   #   主入口路由 Agent
│   ├── planning.agent.md             #   上下文研究 Agent
│   ├── code-review.agent.md          #   代码审查 Agent
│   ├── code-testing.agent.md         #   代码测试 Agent
│   ├── code-docs.agent.md            #   文档生成 Agent
│   ├── code-debug.agent.md           #   错误诊断 Agent
│   ├── Conductor.agent.md            #   多阶段编排 Agent
│   ├── pr-review-submit.agent.md     #   PR 审查提交 Agent
│   ├── planning-subagent.agent.md    #   Conductor 调研子 Agent
│   ├── implement-subagent.agent.md   #   Conductor 实现子 Agent
│   └── code-review-subagent.agent.md #   Conductor 审查子 Agent
│
├── .claude/skills/                    # Skill 定义（7 个）
│   ├── coding-standards/             #   编码规范
│   ├── github-publish/               #   GitHub 发布
│   ├── microservices/                #   微服务架构
│   ├── security-audit/               #   安全审计
│   ├── playwright-testing/           #   Playwright 测试
│   ├── feishu-docs/                  #   飞书文档
│   └── code-review/                  #   代码审查清单
│
├── docs/                             # 项目文档
│   ├── architecture.md               #   系统架构文档
│   ├── conductor-workflow.md         #   Conductor 工作流详解
│   └── new-employee-mentor-workflow.md #  Mentor 工作流详解
│
├── workspace/                        # 示例项目（贪吃蛇游戏）
│   ├── snake-game-logic.js           #   游戏核心逻辑
│   ├── snake-game.html               #   游戏 UI
│   ├── vitest.config.js              #   Vitest 测试配置
│   ├── generate-pptx.js              #   PPTX 生成脚本
│   └── slides/                       #   演示幻灯片
│
├── tests/                            # 测试文件
│   ├── playwright.config.ts          #   Playwright 配置
│   ├── unit/                         #   单元测试
│   ├── e2e/                          #   E2E 测试
│   ├── ui/                           #   UI 测试
│   └── visual/                       #   视觉回归测试
│
└── plans/                            # Conductor 生成的计划文件
```

---

## 设计模式

### Agent（`.agent.md`）

- 通过 YAML frontmatter 定义 `description`、`tools`、`agents`、`handoffs`
- `handoffs` 字段声明 Agent 之间的转交关系和触发提示词
- `model` 字段可指定特定 AI 模型（如 Claude Opus 4.5）
- `agents: ["*"]` 表示可路由到所有可用 Agent

### Skill（`SKILL.md` + `references/`）

- `SKILL.md` 定义触发条件、工作流、输出格式
- `references/` 目录存放详细的参考文档（规范、清单、模板）
- Agent 通过 `read_file` 按需加载 Skill 定义

### Handoff 协作

- 代码审查完成 → Handoff 到 `pr-review-submit` 自动写入 GitHub
- 测试/诊断发现 Bug → Handoff 到 `implement-subagent` 自动修复
- 多个 Agent 可共享同一个子 Agent（如 `implement-subagent`）

### Conductor 闭环

- `Conductor` 通过 `#runSubagent` 调用 3 个子 Agent
- 循环执行 Planning → Implement → Review 直至所有 Phase 完成
- 3 个强制暂停点确保用户始终掌控流程

---

## 文档索引

| 文档 | 说明 |
|------|------|
| [架构文档](docs/architecture.md) | 系统整体架构、Agent/Skill 详解、工作流、路由决策树 |
| [Conductor 工作流](docs/conductor-workflow.md) | Conductor 多阶段闭环编排详解（含 Mermaid 流程图） |
| [Mentor 工作流](docs/new-employee-mentor-workflow.md) | new-employee-mentor 路由分发工作流详解 |

---

## License

MIT
