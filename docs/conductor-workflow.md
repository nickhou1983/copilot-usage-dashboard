# Conductor Agent 工作流程

## 概述

`Conductor` 是一个编排型 Agent，负责管理完整的开发生命周期：**规划 → 实现 → 审查 → 提交**。它不直接编写代码，而是通过调用 3 个子 Agent（subagent）分工协作完成复杂任务。

## 整体流程图

```mermaid
flowchart TD
    Start([👤 用户提出需求]) --> P1["Phase 1: 规划阶段"]

    subgraph Planning["📋 Phase 1: 规划"]
        P1 --> Analyze["分析用户需求<br/>确定任务范围"]
        Analyze --> Research["调用 planning-subagent<br/>🔍 收集上下文 / 研究代码库"]
        Research --> ResearchReturn["返回研究结果<br/>相关文件 · 函数 · 模式 · 方案"]
        ResearchReturn --> Draft["起草多阶段计划<br/>3-10 个 Phase，遵循 TDD"]
        Draft --> Present["向用户展示计划"]
        Present --> Approval{用户审批?}
        Approval -->|"需要修改"| Draft
        Approval -->|"✅ 批准"| WritePlan["写入 plans/&lt;task&gt;-plan.md"]
    end

    WritePlan --> ImplLoop["Phase 2: 实现循环"]

    subgraph Implementation["🔄 Phase 2: 实现循环（每个 Phase 重复）"]
        ImplLoop --> Impl["2A. 调用 implement-subagent<br/>⚙️ 执行当前 Phase 实现"]
        Impl --> ImplDone["返回实现摘要<br/>修改的文件 · 测试结果"]
        ImplDone --> Review["2B. 调用 code-review-subagent<br/>🔍 审查实现结果"]
        Review --> ReviewResult{审查结果?}
        ReviewResult -->|"NEEDS_REVISION<br/>需要修改"| Impl
        ReviewResult -->|"FAILED<br/>失败"| ConsultUser["⛔ 暂停，咨询用户"]
        ConsultUser --> Impl
        ReviewResult -->|"APPROVED<br/>✅ 通过"| Commit["2C. 返回用户<br/>展示摘要 + Commit 消息"]
        Commit --> WritePhase["写入 plans/&lt;task&gt;-phase-N-complete.md"]
        WritePhase --> UserCommit{用户确认?}
        UserCommit -->|"继续下一 Phase"| HasMore{还有更多 Phase?}
        UserCommit -->|"修改 / 中止"| Impl
        HasMore -->|"是"| ImplLoop
        HasMore -->|"否"| Complete
    end

    Complete["Phase 3: 完成"]

    subgraph Completion["✅ Phase 3: 计划完成"]
        Complete --> FinalReport["编写最终报告<br/>plans/&lt;task&gt;-complete.md"]
        FinalReport --> FinalPresent["向用户展示完成摘要"]
    end

    FinalPresent --> End([🎉 任务完成])

    style Start fill:#e1f5fe,stroke:#0288d1
    style Planning fill:#fff8e1,stroke:#f9a825
    style Implementation fill:#e8f5e9,stroke:#2e7d32
    style Completion fill:#f3e5f5,stroke:#7b1fa2
    style End fill:#e1f5fe,stroke:#0288d1
    style Approval fill:#fff3e0,stroke:#f57c00
    style ReviewResult fill:#fff3e0,stroke:#f57c00
    style UserCommit fill:#fff3e0,stroke:#f57c00
    style HasMore fill:#fff3e0,stroke:#f57c00
```

## 子 Agent 调用关系图

```mermaid
flowchart LR
    Conductor["🎵 Conductor<br/>Claude Opus 4.5<br/>编排 Agent"]

    Conductor -->|"研究上下文"| Planning["🔍 planning-subagent<br/>Claude Sonnet 4.5"]
    Conductor -->|"执行实现"| Implement["⚙️ implement-subagent<br/>GPT-5.2-Codex"]
    Conductor -->|"代码审查"| Review["📝 code-review-subagent<br/>Claude Sonnet 4.5"]

    Planning -->|"返回结构化研究结果<br/>相关文件 · 函数 · 模式 · 方案"| Conductor
    Implement -->|"返回实现摘要<br/>修改文件 · 测试结果"| Conductor
    Review -->|"返回审查结果<br/>APPROVED / NEEDS_REVISION / FAILED"| Conductor

    subgraph PlanTools["planning-subagent 工具"]
        PT1["search"] ~~~ PT2["usages"]
        PT3["problems"] ~~~ PT4["fetch"]
        PT5["githubRepo"] ~~~ PT6["changes"]
    end

    subgraph ImplTools["implement-subagent 工具"]
        IT1["edit"] ~~~ IT2["search"]
        IT3["runCommands"] ~~~ IT4["runTasks"]
        IT5["todos"] ~~~ IT6["problems"]
    end

    subgraph ReviewTools["code-review-subagent 工具"]
        RT1["search"] ~~~ RT2["usages"]
        RT3["problems"] ~~~ RT4["changes"]
    end

    Planning -.-> PlanTools
    Implement -.-> ImplTools
    Review -.-> ReviewTools

    style Conductor fill:#e3f2fd,stroke:#1565c0,stroke-width:3px
    style Planning fill:#fff8e1,stroke:#f9a825
    style Implement fill:#e8f5e9,stroke:#2e7d32
    style Review fill:#fce4ec,stroke:#c62828
    style PlanTools fill:#fffde7,stroke:#f9a825,stroke-dasharray:5 5
    style ImplTools fill:#e8f5e9,stroke:#2e7d32,stroke-dasharray:5 5
    style ReviewTools fill:#fce4ec,stroke:#c62828,stroke-dasharray:5 5
```

## 强制暂停点（Mandatory Stops）

```mermaid
flowchart LR
    S1["🔴 暂停 1<br/>计划审批"] --> S2["🔴 暂停 2<br/>每个 Phase 完成后<br/>等待用户 Commit"] --> S3["🔴 暂停 3<br/>整体计划完成"]

    style S1 fill:#ffcdd2,stroke:#c62828
    style S2 fill:#ffcdd2,stroke:#c62828
    style S3 fill:#ffcdd2,stroke:#c62828
```

Conductor 在以下时刻必须暂停等待用户确认：

1. **计划审批** — 展示计划后等待用户批准或修改
2. **Phase 提交** — 每个 Phase 审查通过后，等待用户 Git Commit 并确认继续
3. **计划完成** — 最终报告生成后通知用户

## 子 Agent 职责对比

| 子 Agent | 模型 | 职责 | 输出 |
| -------- | ---- | ---- | ---- |
| **planning-subagent** | Claude Sonnet 4.5 | 研究代码库上下文，收集相关文件/函数/模式 | 结构化研究结果 |
| **implement-subagent** | GPT-5.2-Codex | 按 TDD 流程执行实现（测试先行 → 编码 → 验证） | 实现摘要 + 测试结果 |
| **code-review-subagent** | Claude Sonnet 4.5 | 审查实现质量，验证测试覆盖和最佳实践 | APPROVED / NEEDS_REVISION / FAILED |

## 产出文件

| 阶段 | 文件 | 说明 |
| ---- | ---- | ---- |
| 计划 | `plans/<task>-plan.md` | 多阶段实现计划 |
| 每 Phase 完成 | `plans/<task>-phase-<N>-complete.md` | Phase 完成报告 + Commit 消息 |
| 整体完成 | `plans/<task>-complete.md` | 最终总结报告 |
