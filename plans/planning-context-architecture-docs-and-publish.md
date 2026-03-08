# Planning Context: 架构文档生成与发布

## 上下文摘要

项目是一个多 Agent 编排演示项目（Copilot Orchestra Demo），包含：
- **7 个 Agent**：new-employee-mentor、planning、code-docs、code-review、code-testing、code-debug、Conductor、pr-review-submit
- **6 个 Skill**：coding-standards、github-publish、microservices、security-audit、feishu-docs、playwright-testing
- **docs/ 文档**：conductor-workflow.md、new-employee-mentor-workflow.md
- **测试套件**：unit/e2e/ui/visual（Vitest + Playwright）
- **示例项目**：贪吃蛇游戏

## 意图分析

用户要求：
1. 为当前项目生成架构文档
2. 更新 README
3. 推送到 GitHub 代码仓库

## 推荐路由

| 顺序 | Skill/Agent | 任务 |
|------|-------------|------|
| 1 | code-docs Agent | 生成架构文档 + 更新 README |
| 2 | github-publish Skill | 提交变更并推送到 GitHub |

## 开放问题

- 架构文档范围：新建 `docs/architecture.md`
- README 更新：增量更新，补充架构文档链接
- 提交目标：`feat/add-skills-and-agents` 分支，更新 PR #1
