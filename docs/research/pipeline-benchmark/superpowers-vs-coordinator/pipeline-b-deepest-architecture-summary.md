# Architecture Atlas — Architecture Summary
**Repository:** superpowers (obra/superpowers)
**Generated:** 2026-04-02
**Run ID:** 2026-04-02-12h01
**Version assessed:** v5.0.7

---

## System A — Workflow Skills

```yaml
system: "Workflow Skills"
chunk: A
file_count: 14
entry_points:
  - "skills/brainstorming/SKILL.md (user invokes via using-superpowers routing)"
cross_system_connections:
  outbound: 11
  inbound: 8
  net: +3
dependencies:
  - "B: using-superpowers (receives routing decisions)"
  - "B: requesting-code-review (SDD dispatches after spec compliance)"
  - "B: verification-before-completion (implicit gate)"
  - "B: finishing-a-development-branch (terminal handoff)"
  - "B: using-git-worktrees (recommended setup)"
  - "D: docs/superpowers/specs/ (produces spec artifacts)"
  - "D: docs/superpowers/plans/ (produces plan artifacts)"
centrality_tier: "Primary Producer — highest outbound count (11)"
```

### Narrative

System A implements the complete idea-to-merge workflow pipeline: brainstorming → writing-plans → subagent-driven-development (or executing-plans) → test-driven-development → branch completion. The pipeline is gate-based: each skill produces a committed file artifact (spec, plan, commits) that enables cold-start resumption by any capable agent at any point.

The defining architectural decision is the HARD-GATE in brainstorming: NO implementation code until a spec is written and user-approved. This prevents the most common AI-assisted development failure mode — premature implementation before requirements are clear. The gate is explicitly defended against every rationalization an agent might use to skip it.

The plan document itself carries its execution protocol — the header contains a `> **For agentic workers:** REQUIRED SUB-SKILL:` directive that eliminates the "how do I run this?" problem for cold-start agents.

Subagent-driven-development is the most complex skill: a controller-executor pattern where a fresh subagent is dispatched per task with the FULL task text (not a file path), followed by two sequential review stages — spec compliance first, code quality second. The ordering is architecturally correct: there is no value in style-checking an implementation that is missing features.

Test-driven-development (371 lines) is the most opinionated skill — it anticipates and defeats 11 common rationalizations for skipping TDD via an exhaustive rationalization resistance table.

### Information Flow

```
User idea
  ──→ brainstorming (HARD-GATE: spec first)
       │ optional: visual-companion server (HTML → browser → events → Claude)
       │ Output: docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md (committed)
       ▼
  writing-plans (zero-placeholder guarantee)
       │ Output: docs/superpowers/plans/YYYY-MM-DD-<feature>.md (committed)
       │         with embedded sub-skill directive in header
       ▼
  subagent-driven-development (recommended) OR executing-plans
       │ SDD: extract all tasks upfront → per task:
       │   fresh implementer subagent (full task text)
       │   → spec-compliance review (adversarial: "Do Not Trust the Report")
       │   → [if pass] code-quality review (via requesting-code-review)
       │   → mark complete in TodoWrite
       │ Each task: test-driven-development (red → green → refactor)
       ▼
  [B] verification-before-completion (implicit gate)
       ▼
  [B] finishing-a-development-branch (4 options: merge/PR/keep/discard)
```

### Cross-System Connections

| Target | Connection | Data |
|--------|------------|------|
| B: requesting-code-review | SDD invokes after spec compliance | BASE_SHA, HEAD_SHA, description |
| B: verification-before-completion | Implicit gate before completion | Evidence command output |
| B: finishing-a-development-branch | Terminal handoff | All tasks complete in TodoWrite |
| B: using-git-worktrees | Recommended workspace setup | Isolated branch directory |
| B: systematic-debugging | TDD references for bug fixing | Cross-skill chain |
| D: docs/superpowers/specs/ | Brainstorming produces | Committed spec document |
| D: docs/superpowers/plans/ | Writing-plans produces | Committed plan document |

### Strengths

- HARD-GATE prevents premature implementation — the most common AI dev failure mode (brainstorming/SKILL.md:12-14)
- Plan-as-cold-start-artifact: any agent can resume at any workflow stage (writing-plans/SKILL.md header design)
- Two-stage sequential review (spec before quality) eliminates wasted review cycles (SDD/SKILL.md:247)
- Rationalization resistance tables in TDD anticipate 11 motivated-reasoning patterns (TDD/SKILL.md:258-271)
- DONE_WITH_CONCERNS status creates honest escalation channel without blocking progress

### Limitations

- No crash recovery for executing-plans: no write-ahead status, TodoWrite is session-local
- No re-dispatch budget in SDD review loop — theoretical infinite loop on persistent spec mismatch
- Spec/plan storage locations are project-opinionated (`docs/superpowers/`); no project-level config mechanism
- Visual companion requires local network port; platform-specific launch complexity (Windows: run_in_background)

### Notable Details

- TDD skill (371 lines) is the largest single workflow skill — reflects the depth of rationalization-hardening required
- Implementer prompt template embeds status codes (DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED) in the prompt itself, not just the controller — ensures subagents report correctly even without controller context
- `spec-reviewer-prompt.md` adversarial posture: reviewer must read actual code, not implementer's report (`"CRITICAL: Do Not Trust the Report"`)
- v5.0.6 removed subagent review loops based on regression testing across 5 versions × 5 trials — evidence-driven design decision

---

## System B — Operational Skills

```yaml
system: "Operational Skills"
chunk: B
file_count: 25
entry_points:
  - "skills/using-superpowers/SKILL.md (mandatory pre-cognition interrupt — fires before ANY response)"
cross_system_connections:
  outbound: 7
  inbound: 10
  net: -3
dependencies:
  - "A: brainstorming, writing-plans, SDD, executing-plans, TDD (routes to these)"
  - "C: agents/code-reviewer.md (requesting-code-review dispatches this agent)"
  - "D: tests/skill-triggering/ (validates routing behavior)"
centrality_tier: "Primary Coordinator — highest inbound count (10), lowest net (-3)"
```

### Narrative

System B is the coordination and operational layer. Its defining skill, `using-superpowers`, acts as a mandatory interrupt handler: it fires before ANY response (including clarifying questions), with a 1% applicability threshold that removes judgment ambiguity. This inverts the natural agent pattern where context is gathered before consulting references.

Every skill in System B shares a universal 4-layer behavioral hardening pattern:
1. **Iron Law** — uppercase, monospace, absolute prohibition
2. **Rationalization table** — exhaustive expected escape attempts with rebuttals
3. **Red flags list** — first-person self-monitoring triggers ("STOP if you think...")
4. **Spirit-over-letter clause** — explicit statement that loophole-finding violates the rule

This architecture treats the AI agent as an optimization system that will find shortcuts under pressure, and preemptively closes those paths.

Skills in System B are organized into functional pairs: `using-git-worktrees` ↔ `finishing-a-development-branch` (create/cleanup workspace), `requesting-code-review` ↔ `receiving-code-review` (dispatch/receive review). The pairs share state assumptions and terminology.

`writing-skills` applies TDD methodology to documentation creation — the skill creation process IS the test suite for the skill. The CSO (Claude Search Optimization) finding is empirically important: descriptions must NOT summarize workflow, only triggering conditions, because Claude uses descriptions as shortcuts to skip reading the full skill body.

### Information Flow

```
[Every user message]
  ──→ using-superpowers interrupt (1% threshold)
       │ Priority: process skills (brainstorming, debugging) before implementation
       │
       ├──→ "build X" → [A] brainstorming
       ├──→ "fix bug" → systematic-debugging
       │                   → [A] TDD (Phase 4)
       │                   → verification-before-completion
       ├──→ "execute plan" → [A] SDD (recommended) or executing-plans
       └──→ "review code" → requesting-code-review
                              ──→ [C] code-reviewer agent (dispatch)
                                   ──→ receiving-code-review (handle response)

Workspace lifecycle:
  using-git-worktrees (create isolated workspace)
       ▲         │
       │         ▼
  finishing-a-development-branch (4-option cleanup)

Review lifecycle:
  requesting-code-review (dispatch with BASE_SHA/HEAD_SHA)
       ▲         │
       │         ▼
  receiving-code-review (YAGNI check, anti-performative, push-back protocol)
```

### Cross-System Connections

| Target | Connection | Data |
|--------|------------|------|
| A: brainstorming | using-superpowers routes "build X" | Routing decision |
| A: writing-plans | using-superpowers routes "write plan" | Routing decision |
| A: SDD/executing-plans | using-superpowers routes "execute" | Routing decision |
| A: TDD | using-superpowers routes "implement" | Routing decision |
| A: TDD (from debugging) | systematic-debugging chain | debug → TDD → verification |
| C: agents/code-reviewer.md | requesting-code-review dispatches | `superpowers:code-reviewer` type |
| D: tests/skill-triggering/ | routing validated by | Trigger condition test suite |

### Strengths

- 1% invocation threshold removes judgment ambiguity from skill routing (using-superpowers)
- Universal Iron Law + rationalization table pattern creates consistent behavioral hardening across all skills
- Skill pairs create closed interaction loops — assumptions and terminology are shared within pairs
- Anti-performative stance in receiving-code-review prevents LLM over-compliance failure mode
- SUBAGENT-STOP guard prevents recursion in delegated contexts (using-superpowers:6)

### Limitations

- using-superpowers does not enumerate specific skills in routing table — relies on Claude's runtime discovery
- No trigger for "ending a task" — interrupt only covers task entry
- Skill priority ordering (process → implementation) stated but not structurally enforced
- writing-skills token budget (150-200 words for descriptions) creates compression pressure on complex skills
- finishing-a-development-branch Option 1 (merge locally) lacks CI gate — code can reach main without automated checks

### Notable Details

- "Strange Things Are Afoot at the Circle K" safe word in receiving-code-review (line 129) — human-protocol detail embedded in agent skill, signals design for specific user
- CSO anti-pattern in writing-skills (lines 154-157): descriptions must NOT summarize workflow — empirically observed failure mode where Claude follows description as shortcut
- 3-strikes architecture in systematic-debugging (Phase 4.5, lines 199-210): after 3 failed fixes, mandates architectural reassessment rather than Fix #4

---

## System C — Infrastructure & Platform

```yaml
system: "Infrastructure & Platform"
chunk: C
file_count: 23
entry_points:
  - "hooks/hooks.json (SessionStart event — active bootstrap for Claude Code + Copilot)"
  - "hooks/hooks-cursor.json (SessionStart for Cursor)"
  - ".opencode/plugins/superpowers.js (plugin registration for OpenCode)"
  - "GEMINI.md (passive @ include for Gemini CLI)"
  - ".codex/INSTALL.md (manual setup for Codex)"
  - ".claude-plugin/plugin.json (Claude Code marketplace discovery)"
  - ".cursor-plugin/plugin.json (Cursor IDE discovery)"
cross_system_connections:
  outbound: 4
  inbound: 2
  net: +2
dependencies:
  - "B: using-superpowers (bootstrap target — all platform adapters inject this skill)"
  - "A: writing-skills (governance via CLAUDE.md)"
  - "D: docs/README.*.md (documented by platform guides)"
centrality_tier: "Injector — bootstrap source for all runtime behavior"
```

### Narrative

System C is the platform delivery layer. It solves one core problem: injecting the `using-superpowers/SKILL.md` content into session context across 7 platforms with different bootstrap mechanisms. The design principle is **one canonical source, platform-specific delivery**.

Platform detection uses environment variable sniffing in a single `hooks/session-start` script: `CURSOR_PLUGIN_ROOT` → Cursor format, `CLAUDE_PLUGIN_ROOT` (without `COPILOT_CLI`) → Claude Code format, otherwise SDK standard. This avoids script duplication but creates a single file all platform maintainers must understand.

The OpenCode adapter (`superpowers.js`) uses a distinct injection vector: `experimental.chat.messages.transform` prepends bootstrap to the first user message rather than using session events. This avoids system-prompt token bloat (issues #750 and #894 are explicitly cited in the adapter comments).

`run-hook.cmd` is a bash/cmd polyglot — valid as both a Windows batch file and a Unix shell script — to avoid the `.sh` extension that triggers Claude Code's Windows auto-detection.

The `CLAUDE.md` governance file functions as an anti-slop firewall: 94% PR rejection rate, human diff review required, skills treated as behavior-shaping code that requires eval evidence for modification. This explicitly protects the behavioral scaffolding from agent-generated contributions.

### Information Flow

```
Platform Bootstrap (Session Start):

[Claude Code / Copilot CLI]                    [OpenCode]
hooks/hooks.json (SessionStart trigger)        .opencode/plugins/superpowers.js
  ──→ run-hook.cmd (bash/cmd polyglot)          ──→ experimental.chat.messages.transform
       ──→ hooks/session-start                         ──→ prepend to first user message
            ──→ read using-superpowers/SKILL.md         (guards via EXTREMELY_IMPORTANT marker)
            ──→ wrap in <EXTREMELY_IMPORTANT>
            ──→ output hookSpecificOutput.additionalContext

[Gemini CLI]                                  [Codex CLI / Codex App]
GEMINI.md (@ includes, passive)               .codex/INSTALL.md
  ──→ harness reads context file               ──→ manual setup only (no active hook)
      (no session-event gating)

All paths ──→ [B] using-superpowers/SKILL.md content in session context
```

### Cross-System Connections

| Target | Connection | Data |
|--------|------------|------|
| B: using-superpowers | session-start injects | `<EXTREMELY_IMPORTANT>` block with full skill content |
| B: using-superpowers | superpowers.js injects | Bootstrap prepended to first user message |
| A: writing-skills | CLAUDE.md governs | Eval evidence required before skill modification |
| D: docs/README.*.md | Platform adapters documented | Install instructions, usage guides |

### Strengths

- Zero-dependency injection: OpenCode adapter ships own YAML frontmatter parser (superpowers.js:16-34)
- Single session-start script handles 3 JSON output shapes via env var branching
- Bootstrap reinjects on `/clear` and `/compact` events (hooks.json SessionStart matcher: "startup|clear|compact")
- Guard against duplicate injection: OpenCode checks for `EXTREMELY_IMPORTANT` marker before prepending (superpowers.js:107)
- run-hook.cmd polyglot avoids Windows `.sh` extension issue (run-hook.cmd:7-9)
- CLAUDE.md contributor governance protects skill quality from bulk AI contributions

### Limitations

- hooks-cursor.json uses `sessionStart` (camelCase) vs hooks.json `SessionStart` (PascalCase) — schema inconsistency, maintenance hazard
- OpenCode adapter mutates Config singleton directly (superpowers.js:89-95) — tight coupling to OpenCode implementation detail
- Codex platform has no active hook — relies entirely on manual installation
- Gemini bootstrap is passive — no session-event gating (no `/clear` reinject equivalent)
- Blocking session-start hook (`async: false`) with no timeout — slow systems block entire session start
- Single session-start script accumulates complexity with each new platform

### Notable Details

- v5.0.7 added Copilot CLI support using the existing Claude Code hook path (shared `CLAUDE_PLUGIN_ROOT` branch with `COPILOT_CLI` distinction)
- .version-bump.json coordinates versions across all platform manifests — prevents version drift
- code-reviewer agent uses `model: inherit` by design — harness handles runtime config, agent provides behavioral scaffolding only; contrasts with coordinator-style explicit model specification

---

## System D — Docs, Tests & Releases

```yaml
system: "Docs, Tests & Releases"
chunk: D
file_count: 30
entry_points:
  - "README.md (primary user-facing entry point, 7-platform install matrix)"
cross_system_connections:
  outbound: 4
  inbound: 6
  net: -2
dependencies:
  - "A: brainstorming/writing-plans produce spec/plan artifacts (stored here)"
  - "B: using-superpowers routing (skill-triggering tests validate)"
  - "C: platform adapters (opencode tests validate, docs describe)"
centrality_tier: "Consumer/Validator — primary sink for artifacts and test targets"
```

### Narrative

System D serves two functions: documentation for users/contributors and test infrastructure for the skill system.

**Testing methodology** has five layers, each at a different abstraction level:
1. Unit tests: WebSocket protocol (RFC 6455 compliance, byte-level frame encoding)
2. Integration tests (headless Claude sessions): primary behavioral validation — run `claude -p` in headless mode, parse `.jsonl` transcripts for behavioral invariants
3. Skill triggering tests: verify natural prompts fire correct skills via `using-superpowers` routing
4. Platform/plugin loading tests: structural validation (no live session required)
5. Server integration tests: HTTP/WebSocket server behavior, ~30 assertions

The most important tests are the headless Claude session integration tests. They verify ACTUAL runtime behavior — not mocked logic — at the cost of 10-30 minutes and ~$4.67/run. The SDD integration test creates a real Node.js project and verifies produced files pass `npm test`.

**Release history** shows evidence-driven iteration at 1 release/week cadence. The most significant signal: v5.0.6 removed the subagent review loop based on regression data (5 versions × 5 trials, identical quality scores). Design decisions are treated as hypotheses; reversals are documented with reasoning.

**Design artifacts** (specs + plans) are committed to the repo under `docs/superpowers/specs/` and `docs/superpowers/plans/`. This preserves reasoning alongside implementation — unusual for a developer tooling project.

### Information Flow

```
[User facing]
README.md ──→ 7-platform install matrix
                 ──→ [C] docs/README.codex.md, docs/README.opencode.md (platform guides)
                 ──→ Sponsorship / philosophy

[Design artifact storage]
[A] brainstorming ──→ docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md
[A] writing-plans ──→ docs/superpowers/plans/YYYY-MM-DD-<feature>.md
                        ──→ consumed back by [A] executing-plans / SDD

[Test validation flows]
tests/claude-code/ ──validates──→ [A] SDD runtime behavior (headless sessions)
tests/brainstorm-server/ ──validates──→ [A] brainstorm server HTTP/WS
tests/opencode/ ──validates──→ [C] OpenCode plugin structure
tests/skill-triggering/ ──validates──→ [B] using-superpowers routing
tests/explicit-skill-requests/ ──validates──→ [B] explicit invocation

[Release tracking]
RELEASE-NOTES.md ── tracks ──→ all platform adapter changes (C), skill pipeline changes (A/B)
```

### Cross-System Connections

| Target | Connection | Data |
|--------|------------|------|
| A: executing-plans/SDD | docs/plans/ consumed as input | Plan files with sub-skill directives |
| A: writing-plans | docs/specs/ consumed as input | Approved spec documents |
| B: using-superpowers | skill-triggering tests validate | Routing condition coverage |
| C: platform adapters | opencode tests + README docs | Structural validation + install guides |

### Strengths

- Tests verify actual LLM runtime behavior, not mocks — expensive but representative
- Protocol-level unit tests cite RFC 6455 with exact byte values (ws-protocol.test.js:50-55)
- Token analysis tool (analyze-token-usage.py) provides cost visibility per subagent run
- Design specs committed to repo — reasoning preserved alongside code (docs/superpowers/specs/)
- Release notes document reversals with explicit reasoning (v5.0.5, v5.0.6)
- Evidence-driven releases: 8 in ~6 weeks with documented regression testing

### Limitations

- Brainstorming and writing-plans have no behavioral integration tests (only trigger-fires checks)
- Entry skills (brainstorming, writing-plans) gate everything downstream but receive least test coverage — inverted from where coverage is most valuable
- Integration tests cost ~$4.67/run, 10-30 min runtime — high friction for frequent execution
- `.jsonl` transcript parsing approach is brittle (grep for specific tool call strings)
- No CI pipeline — tests are developer-run only
- Only one CREATION-LOG.md in repo (systematic-debugging) — creation-time pressure testing inconsistently documented

### Notable Details

- v5.0.6 regression methodology: 5 versions × 5 trials, quality scores identical with/without subagent review loop — principled optimization, not a shortcut
- tests/brainstorm-server/ validates the security fix from v5.0.6: content/ + state/ directory split ensures user interaction data (state/) is not HTTP-accessible (content/ only served via HTTP)
- RELEASE-NOTES.md references specific GitHub issue numbers (#770, #723, #774, #780, #783, #879) — active community issue triage driving releases
- docs/windows/polyglot-hooks.md exists as dedicated Windows troubleshooting — signals Windows compatibility is a recurring pain point

---

## Cross-System Patterns

### Pattern 1: Universal Iron Law Architecture

Every skill in Systems A and B implements the same 4-layer behavioral hardening: Iron Law block → rationalization table → red flags list → spirit-over-letter clause. This is the defining design primitive of superpowers — it treats the AI agent as an optimization system that will find shortcuts under pressure, and preemptively forecloses those shortcuts. The pattern is consistent enough to be a design invariant, not a convention.

**Source:** A-assessment (Area 2), B-assessment (Area 2), synthesis (Key Design Pattern 1)

### Pattern 2: Gate-Based Workflow with Committed-File State

Every workflow transition externalizes state to a committed file (spec → plan → commits). This enables cold-start resumption at any stage without complex checkpoint infrastructure. The plan document's embedded sub-skill directive is the key mechanism: the artifact carries its own execution protocol.

**Source:** A-assessment (Cross-Skill Handoff State), synthesis (Key Design Pattern 2)

### Pattern 3: Skill Pairs as Closed Interaction Loops

Skills are designed with counterparts in mind: (worktrees ↔ finishing), (requesting ↔ receiving). Each pair shares state assumptions, terminology, and failure mode handling. This suggests the library was designed as a coherent system, not accumulated as a collection.

**Source:** B-assessment (Top Finding 3), synthesis (Key Design Pattern 5)

### Pattern 4: One Canonical Source, Platform-Specific Delivery

All 7 platforms inject the same `using-superpowers/SKILL.md` content via different mechanisms. Platform detection is env-var-based in a single script. The zero-dependency design philosophy (CLAUDE.md) is enforced even in the OpenCode adapter's custom YAML frontmatter parser.

**Source:** C-assessment (Platform Bootstrap Architecture), synthesis (Architecture Overview)

### Pattern 5: Evidence-Driven Iteration with Documented Reversals

v5.0.5 reversed mandatory SDD; v5.0.6 removed subagent review loops based on regression data. Design decisions are treated as hypotheses. The project documentation captures the reasoning for reversals, making the evolution legible.

**Source:** D-assessment (Release History), synthesis (Strengths 3)

### Pattern 6: Anti-Slop Governance Protecting Behavioral Scaffolding

CLAUDE.md's 94% rejection rate, human review requirement, and eval-evidence mandate for skill changes explicitly protect behavioral scaffolding from well-intentioned but untested agent-generated contributions. The project uses its own agent-shaping infrastructure to protect itself from uncontrolled modification by other agents.

**Source:** C-assessment (Contributor Governance), synthesis (Strengths 5)
