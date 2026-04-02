# Architecture Atlas — Connectivity Matrix
**Repository:** superpowers (obra/superpowers)
**Generated:** 2026-04-02
**Run ID:** 2026-04-02-12h01

---

## 4x4 Cross-System Connection Matrix

Cells show: outbound connection count from row system to column system.
"Outbound" = the row system invokes, feeds, or depends on the column system.

|  From \ To  | A: Workflow | B: Operational | C: Infrastructure | D: Docs/Tests |
|-------------|:-----------:|:--------------:|:-----------------:|:-------------:|
| **A: Workflow** | — | **7** | 0 | **4** |
| **B: Operational** | **5** | — | **1** | **1** |
| **C: Infrastructure** | **1** | **2** | — | **1** |
| **D: Docs/Tests** | **2** | **1** | **1** | — |
| **TOTAL IN** | **8** | **10** | **2** | **6** |
| **TOTAL OUT** | **11** | **7** | **4** | **4** |

**Net centrality scores** (out − in):
- A: Workflow Skills = +3 (primary producer)
- B: Operational Skills = −3 (primary consumer / coordinator)
- C: Infrastructure = +2 (injector)
- D: Docs/Tests = −2 (consumer/validator)

---

## Connection Details

### A → B: Workflow Skills → Operational Skills (7 connections)

| Connection | Type | Notes |
|------------|------|-------|
| A: subagent-driven-dev → B: requesting-code-review | Invocation | After each task's spec compliance passes, quality review dispatched |
| A: subagent-driven-dev → B: verification-before-completion | Implicit gate | Before completion claim made |
| A: executing-plans → B: finishing-a-development-branch | Terminal handoff | After all tasks complete |
| A: subagent-driven-dev → B: finishing-a-development-branch | Terminal handoff | After all tasks complete |
| A: executing-plans → B: using-git-worktrees | Recommended setup | executing-plans recommends worktree isolation |
| A: subagent-driven-dev → B: using-git-worktrees | Recommended setup | SDD recommends worktree isolation |
| A: TDD → B: systematic-debugging | Debugging chain | debugging → TDD → verification (cross-reference chain) |

### A → D: Workflow Skills → Docs/Tests (4 connections)

| Connection | Type | Notes |
|------------|------|-------|
| A: brainstorming → D: docs/superpowers/specs/ | Artifact output | Committed spec doc (cold-start handoff) |
| A: writing-plans → D: docs/superpowers/plans/ | Artifact output | Committed plan doc with sub-skill directive |
| A: brainstorming (server) ← D: tests/brainstorm-server/ | Validated by | [UNCONFIRMED direction — D tests A's server component] |
| A: subagent-driven-dev ← D: tests/claude-code/ | Validated by | Integration tests verify SDD runtime behavior |

### B → A: Operational Skills → Workflow Skills (5 connections)

| Connection | Type | Notes |
|------------|------|-------|
| B: using-superpowers → A: brainstorming | Routing | "build X" → brainstorming first |
| B: using-superpowers → A: writing-plans | Routing | "write a plan" → writing-plans |
| B: using-superpowers → A: subagent-driven-dev | Routing | "execute plan" → SDD (recommended) |
| B: using-superpowers → A: executing-plans | Routing | "execute plan" inline variant |
| B: using-superpowers → A: test-driven-development | Routing | "implement feature" → TDD enforcement |

### B → C: Operational Skills → Infrastructure (1 connection)

| Connection | Type | Notes |
|------------|------|-------|
| B: requesting-code-review → C: agents/code-reviewer.md | Dispatch | Explicitly dispatches `superpowers:code-reviewer` agent by name |

### B → D: Operational Skills → Docs/Tests (1 connection)

| Connection | Type | Notes |
|------------|------|-------|
| B: using-superpowers ← D: tests/skill-triggering/ | Validated by | [UNCONFIRMED direction — D tests B's routing behavior] |

### C → A: Infrastructure → Workflow Skills (1 connection)

| Connection | Type | Notes |
|------------|------|-------|
| C: CLAUDE.md → A: writing-skills | Governance | Governs skill modification; requires eval evidence before merging changes |

### C → B: Infrastructure → Operational Skills (2 connections)

| Connection | Type | Notes |
|------------|------|-------|
| C: hooks/session-start → B: using-superpowers | Bootstrap injection | Injects skill into session context via `<EXTREMELY_IMPORTANT>` |
| C: .opencode/superpowers.js → B: using-superpowers | Bootstrap injection | Prepends to first user message (OpenCode-specific vector) |

### C → D: Infrastructure → Docs/Tests (1 connection)

| Connection | Type | Notes |
|------------|------|-------|
| C: .opencode/plugins/ ← D: tests/opencode/ | Validated by | [UNCONFIRMED direction — D validates C's plugin structure] |

### D → A: Docs/Tests → Workflow Skills (2 connections)

| Connection | Type | Notes |
|------------|------|-------|
| D: docs/superpowers/specs/ → A: writing-plans | Input consumed | Spec doc is input to plan authoring |
| D: docs/superpowers/plans/ → A: executing-plans/SDD | Input consumed | Plan doc is input to plan execution |

### D → B: Docs/Tests → Operational Skills (1 connection)

| Connection | Type | Notes |
|------------|------|-------|
| D: tests/explicit-skill-requests/ → B: using-superpowers | Test validation | Explicit invocation tests verify routing |

### D → C: Docs/Tests → Infrastructure (1 connection)

| Connection | Type | Notes |
|------------|------|-------|
| D: docs/README.codex.md, README.opencode.md → C: platform adapters | Documentation | Platform-specific install guides reference adapter behavior |

---

## Notes on [UNCONFIRMED] Connections

Three connections are listed with [UNCONFIRMED] direction because the research team identified test coverage flows (D tests A/B/C) that are directional from D outward, but the inventory and assessments express them as "D validates A/B/C" which could imply A/B/C depend on D. The correct interpretation is:
- D tests are consumers of A/B/C artifacts for validation
- A/B/C do NOT depend on D for runtime operation
- Directionality: D → A/B/C for test coverage, but runtime dependency flows only A↔B, C→B

All connections above confirmed from at least one specialist assessment or the synthesis document unless marked [UNCONFIRMED].
