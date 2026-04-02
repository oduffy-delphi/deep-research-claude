# Architecture Atlas — System Map
**Repository:** superpowers (obra/superpowers)
**Generated:** 2026-04-02
**Run ID:** 2026-04-02-12h01

---

## System Topology

```
 ╔═══════════════════════════════════════════════════════════════════════════════════════╗
 ║  System C — Infrastructure & Platform                                                 ║
 ║                                                                                       ║
 ║  [ENTRY] hooks/hooks.json ──→ hooks/session-start ──→ inject using-superpowers        ║
 ║  [ENTRY] .opencode/plugins/superpowers.js ──→ transform first user message           ║
 ║  [ENTRY] GEMINI.md (@ includes, passive)                                             ║
 ║  [ENTRY] .codex/INSTALL.md / .opencode/INSTALL.md (manual setup)                    ║
 ║                                                                                       ║
 ║  Platform manifests: .claude-plugin/  .cursor-plugin/  gemini-extension.json         ║
 ║  Governance: CLAUDE.md (94% PR rejection, human review required)                     ║
 ║  Agent: agents/code-reviewer.md (model: inherit, triggered after major steps)        ║
 ║  Deprecated: commands/{brainstorm,write-plan,execute-plan}.md → skill shims          ║
 ╚══════════════════════════════════╦════════════════════════════════════════════════════╝
                                    ║ bootstrap: injects using-superpowers/SKILL.md
                                    ║ into session context (EXTREMELY_IMPORTANT block)
                                    ▼
 ╔═══════════════════════════════════════════════════════════════════════════════════════╗
 ║  System B — Operational Skills  [pre-cognition interrupt layer]                       ║
 ║                                                                                       ║
 ║  [ENTRY] using-superpowers ──→ routes ALL agent cognition (1% threshold)             ║
 ║              │                                                                        ║
 ║              ├──→ systematic-debugging ──→ (feeds) System A (TDD, verification)      ║
 ║              ├──→ verification-before-completion  (gate before any success claim)    ║
 ║              ├──→ using-git-worktrees ◄────────────────────────────────────────────┐ ║
 ║              │         ↕ paired                                                    │ ║
 ║              ├──→ finishing-a-development-branch ──→ merge/PR/keep/discard         │ ║
 ║              ├──→ requesting-code-review ──→ dispatches code-reviewer agent (C)    │ ║
 ║              │         ↕ paired                                                    │ ║
 ║              ├──→ receiving-code-review  (handles feedback from any source)        │ ║
 ║              ├──→ dispatching-parallel-agents (independent domain parallelism)     │ ║
 ║              └──→ writing-skills (TDD-as-documentation for new skill creation)     │ ║
 ║                                                                                    │ ║
 ╚════════════════════════════════════╦═══════════════════════════════════════════════╪═╝
                                      ║ routing: "build X" → brainstorming first      │
                                      ║          "fix bug" → debugging first           │
                                      ▼                                                │
 ╔═══════════════════════════════════════════════════════════════════════════════════════╗
 ║  System A — Workflow Skills  [idea-to-merge pipeline]                                 ║
 ║                                                                                       ║
 ║  [ENTRY] brainstorming ──────────────────────────────────────────────────────────────┤
 ║     │  HARD-GATE: no code until spec approved                                        │
 ║     │  Output: docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md (committed)       │
 ║     │  Optional: visual-companion → local server → browser → events → Claude        │
 ║     ▼                                                                                 │
 ║  writing-plans                                                                        │
 ║     │  Zero-placeholder guarantee; plan header embeds sub-skill directive            │
 ║     │  Output: docs/superpowers/plans/YYYY-MM-DD-<feature>.md (committed)           │
 ║     ▼                                                                                 │
 ║  subagent-driven-development ←(recommended) OR executing-plans                       │
 ║     │  SDD: controller extracts tasks → fresh implementer per task →                │
 ║     │       spec-compliance review (adversarial) → code-quality review               │
 ║     │  Each task also invokes: test-driven-development (red→green→refactor)         │──→ uses-git-worktrees (B)
 ║     ▼                                                                                 │
 ║  [implicit] verification-before-completion (B) — gate before completion claim       │
 ║     ▼                                                                                 │
 ║  → finishing-a-development-branch (B) ─────────────────────────────────────────────┘ ║
 ║                                                                                       ║
 ╚═══════════════════════════════════════════════════════════════════════════════════════╝
          │                          ▲
          │ feeds                    │ validates against
          ▼                          │ (spec files, plan files, release notes)
 ╔═══════════════════════════════════════════════════════════════════════════════════════╗
 ║  System D — Docs, Tests & Releases                                                    ║
 ║                                                                                       ║
 ║  README.md (user entry point, 7-platform install guide)  [ENTRY]                     ║
 ║  RELEASE-NOTES.md / CHANGELOG.md (v4.3.1–v5.0.7, evidence-driven versioning)        ║
 ║  docs/testing.md (integration test methodology)                                      ║
 ║  docs/superpowers/specs/  ←── design artifacts from brainstorming (A)               ║
 ║  docs/superpowers/plans/  ←── plan artifacts from writing-plans (A)                 ║
 ║  tests/claude-code/        — headless SDD integration tests (validates A)           ║
 ║  tests/brainstorm-server/  — HTTP/WS server unit + integration tests (validates A)  ║
 ║  tests/opencode/           — plugin loading validation (validates C)                ║
 ║  tests/skill-triggering/   — trigger condition tests (validates B routing)          ║
 ║  tests/explicit-skill-requests/ — explicit invocation tests (validates B)           ║
 ║                                                                                       ║
 ╚═══════════════════════════════════════════════════════════════════════════════════════╝
```

---

## Data Flow Key

| Arrow | Data Type |
|-------|-----------|
| `──→` | Control flow / invocation |
| `←──` | Artifact consumed (file) |
| `↕ paired` | Symmetric skill pair (create/cleanup or dispatch/receive) |
| `[ENTRY]` | External entry point (user-facing or platform-injected) |
| `(A)/(B)/(C)/(D)` | System reference when crossing boundaries |

---

## Cross-System Data Flows

| From | To | Data |
|------|----|------|
| C: hooks/session-start | B: using-superpowers | `<EXTREMELY_IMPORTANT>` block injected into session context |
| C: .opencode/superpowers.js | B: using-superpowers | Bootstrap prepended to first user message |
| B: using-superpowers | A: brainstorming | Routing decision: "build X" → brainstorming first |
| B: using-superpowers | B: systematic-debugging | Routing decision: "fix bug" → debugging first |
| A: brainstorming | D: docs/superpowers/specs/ | Committed spec document (cold-start handoff artifact) |
| A: writing-plans | D: docs/superpowers/plans/ | Committed plan document with embedded sub-skill directive |
| A: subagent-driven-dev | B: requesting-code-review | Invokes code quality review after spec compliance passes |
| A: subagent-driven-dev | B: verification-before-completion | Implicit gate before completion claim |
| A: executing-plans | B: finishing-a-development-branch | Terminal handoff after all tasks complete |
| A: subagent-driven-dev | B: finishing-a-development-branch | Terminal handoff after all tasks complete |
| B: requesting-code-review | C: agents/code-reviewer.md | Dispatches named agent by type `superpowers:code-reviewer` |
| C: agents/code-reviewer.md | B: receiving-code-review | Review output fed into receiving-code-review handler |
| C: CLAUDE.md | A: writing-skills | Governs skill modification; requires eval evidence |
| D: docs/superpowers/specs/ | A: writing-plans | Input spec consumed by plan author |
| D: tests/claude-code/ | A: subagent-driven-dev | Validates runtime behavior via headless sessions |
| D: tests/brainstorm-server/ | A: brainstorming (server) | Validates HTTP/WS server behavior |
| D: tests/opencode/ | C: .opencode/plugins/ | Validates plugin loading and structure |
| D: tests/skill-triggering/ | B: using-superpowers | Validates trigger condition routing |
