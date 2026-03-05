# new-employee-project Agent 工作流程

## 概述

`new-employee-project` 是一个新员工项目路由 Agent，负责分析用户输入并智能分发到 4 个 Skill 执行任务。

## 工作流程图

```mermaid
flowchart TD
    Start([👤 用户输入]) --> Analyze["📋 分析意图<br/>提取关键词和意图"]

    Analyze --> Decision{路由决策树<br/>关键词匹配}

    Decision -->|"审查 / review<br/>检查代码 / 安全漏洞 / 代码质量"| CR["🔍 code-review Skill"]
    Decision -->|"提交 / commit / push<br/>PR / merge / 发布 / 审查者"| GP["🚀 github-publish Skill"]
    Decision -->|"规范 / 标准 / 命名<br/>风格 / 编码规范 / 最佳实践"| CS["📏 coding-standards Skill"]
    Decision -->|"微服务 / 服务拆分 / 容器<br/>Docker / K8s / CI·CD / 熔断 / 限流"| MS["🏗️ microservices Skill"]
    Decision -->|"混合场景<br/>如 提交并审查"| Multi["🔄 按顺序执行多个 Skill"]
    Decision -->|"无法判断"| Ask["❓ 向用户确认意图"]

    Ask --> Analyze

    CR --> LoadCR["加载 SKILL.md<br/>.claude/skills/code-review/"]
    GP --> LoadGP["加载 SKILL.md<br/>.claude/skills/github-publish/"]
    CS --> LoadCS["加载 SKILL.md<br/>.claude/skills/coding-standards/"]
    MS --> LoadMS["加载 SKILL.md<br/>.claude/skills/microservices/"]
    Multi --> LoadMulti["依次加载对应 SKILL.md"]

    LoadCR --> RefCR["📄 references/<br/>review-conventions.md"]
    LoadGP --> RefGP["📄 references/<br/>pr-conventions.md"]
    LoadCS --> RefCS["📄 references/<br/>general.md · frontend.md<br/>backend.md · code-review-checklist.md"]
    LoadMS --> RefMS["📄 references/<br/>development.md · deployment.md"]
    LoadMulti --> RefMulti["📄 加载各 Skill 参考文件"]

    RefCR --> ExecCR["执行代码审查工作流<br/>1. 收集上下文<br/>2. 分级审查 MUST/SHOULD/NIT<br/>3. 生成报告<br/>4. 提交审查意见"]
    RefGP --> ExecGP["执行发布工作流<br/>1. 确认身份<br/>2. 创建分支<br/>3. 提交代码<br/>4. 创建 PR<br/>5. 指定审查者"]
    RefCS --> ExecCS["执行编码规范工作流<br/>1. 定位问题<br/>2. 查找规范<br/>3. 给出建议"]
    RefMS --> ExecMS["执行微服务工作流<br/>1. 架构设计 / 部署方案<br/>2. 服务拆分 · 通信选型<br/>3. 容器化 · K8s 编排<br/>4. CI/CD · 部署策略"]
    RefMulti --> ExecMulti["按顺序执行各 Skill 工作流"]

    ExecCR --> Output["📝 结构化输出结果"]
    ExecGP --> Output
    ExecCS --> Output
    ExecMS --> Output
    ExecMulti --> Output

    Output --> End([✅ 完成])

    style Start fill:#e1f5fe,stroke:#0288d1
    style Decision fill:#fff3e0,stroke:#f57c00
    style CR fill:#fce4ec,stroke:#c62828
    style GP fill:#e8f5e9,stroke:#2e7d32
    style CS fill:#f3e5f5,stroke:#7b1fa2
    style MS fill:#e3f2fd,stroke:#1565c0
    style Multi fill:#fff8e1,stroke:#f9a825
    style Ask fill:#efebe9,stroke:#795548
    style Output fill:#e0f2f1,stroke:#00695c
    style End fill:#e1f5fe,stroke:#0288d1
```

## Skill 路由表

| Skill | 路径 | 触发关键词 | 参考文件 |
| ----- | ---- | ---------- | -------- |
| **code-review** | `.claude/skills/code-review/` | 审查、review、检查代码、安全漏洞、代码质量 | `review-conventions.md` |
| **github-publish** | `.claude/skills/github-publish/` | 提交、commit、push、PR、merge、发布、审查者 | `pr-conventions.md` |
| **coding-standards** | `.claude/skills/coding-standards/` | 规范、标准、命名、风格、编码规范、最佳实践 | `general.md`、`frontend.md`、`backend.md`、`code-review-checklist.md` |
| **microservices** | `.claude/skills/microservices/` | 微服务、服务拆分、Docker、K8s、CI/CD、熔断、限流 | `development.md`、`deployment.md` |

## 执行流程

1. **分析意图** — 阅读用户输入，提取关键词和意图
2. **加载 Skill** — 读取匹配 Skill 的 `SKILL.md` 获取详细工作流
3. **加载参考文件** — 按 `SKILL.md` 指引加载 `references/` 下的规范文件
4. **执行任务** — 按 Skill 定义的工作流逐步完成
5. **反馈结果** — 以结构化格式输出结果
