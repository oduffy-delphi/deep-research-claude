# superpowers -- Assessment

> **Version assessed:** v5.0.7 | **Date:** 2026-04-02 | **Method:** Pipeline B --deepest (2 Haiku scouts, 4 Sonnet specialists, Opus synthesizer)

## Executive Summary

superpowers (obra/superpowers) is a 14-skill behavioral scaffolding library for AI coding agents, targeting 7 platforms (Claude Code, Cursor, OpenCode, Gemini CLI, Copilot CLI, Codex CLI, Codex App). At v5.0.7, it represents a mature system built around a single architectural conviction: **agent compliance fails under pressure, and skills must be hardened against the agent's own optimization tendencies.**

The library implements this conviction through a universal 4-layer pattern (Iron Law + rationalization table + red flags + spirit-over-letter clause) applied consistently across all skills. Skills are organized into a directed workflow chain -- brainstorming through planning through execution through verification through branch completion -- with state externalized to committed files at every handoff, enabling cold-start resumption by any agent.

The project is notable for three things: (1) a rigorous anti-rationalization architecture that treats the AI agent as a system to be hardened, not merely instructed; (2) multi-platform delivery through a single canonical bootstrap injected via platform-specific adapters; and (3) evidence-driven iteration, with features added and removed based on measured regression data rather than intuition.

## Architecture Overview

### Skill Library (14 skills, 3,159 total lines)

The library divides into four functional layers:

**Workflow Chain** (idea-to-merge pipeline):
- `brainstorming` (164 lines) -- gate-based collaborative design with HARD-GATE preventing premature implementation
- `writing-plans` (152 lines) -- blueprint construction with zero-placeholder guarantee
- `executing-plans` (70 lines) -- minimal sequential plan executor
- `subagent-driven-development` (277 lines) -- controller-executor pattern with two-stage review gates
- `test-driven-development` (371 lines) -- ritual red-green-refactor enforcement

**Operational Skills** (cross-cutting concerns):
- `systematic-debugging` (296 lines) -- 4-phase gate system with 3-strikes escalation
- `verification-before-completion` (139 lines) -- evidence-before-claims gate
- `requesting-code-review` (105 lines) -- isolated subagent review dispatch
- `receiving-code-review` (213 lines) -- anti-performative review reception
- `finishing-a-development-branch` (200 lines) -- 4-option structured branch integration
- `using-git-worktrees` (218 lines) -- isolated workspace creation with safety gates

**Meta/Orchestration:**
- `using-superpowers` (117 lines) -- mandatory pre-cognition interrupt; fires before ANY response
- `dispatching-parallel-agents` (182 lines) -- parallelism decision logic
- `writing-skills` (655 lines) -- TDD-as-documentation process for creating new skills

**Agent Layer:**
- `code-reviewer` (49 lines) -- single lightweight agent, `model: inherit`, no tool restrictions

### Platform Adapters

| Platform | Bootstrap Mechanism | Active/Passive |
|----------|-------------------|----------------|
| Claude Code | SessionStart hook -> shell script -> `hookSpecificOutput.additionalContext` | Active |
| Cursor | SessionStart hook -> same script -> `additional_context` | Active |
| OpenCode | Plugin JS transform -> prepend to first user message | Active |
| Gemini CLI | Context file (`@` include) | Passive |
| Copilot CLI | SessionStart hook (shared with Claude Code path) | Active |
| Codex CLI | Install-time documentation | Passive |
| Codex App | Install-time documentation | Passive |

All platforms inject the same `using-superpowers/SKILL.md` content through different delivery mechanisms. Platform detection uses environment variable sniffing (`CURSOR_PLUGIN_ROOT`, `CLAUDE_PLUGIN_ROOT`, `COPILOT_CLI`) in a single `hooks/session-start` script (`session-start:46-54`).

### Infrastructure

- **Version management:** `.version-bump.json` coordinates versions across all platform manifests
- **Windows compatibility:** `run-hook.cmd` is a bash/cmd polyglot that avoids `.sh` extension triggering Claude Code's Windows auto-detection (`run-hook.cmd:7-9`)
- **Legacy migration:** Session-start checks `~/.config/superpowers/skills` and warns if old path exists (`session-start:13-15`)

## Key Design Patterns

### 1. The Iron Law Architecture

Every skill shares a universal 4-layer behavioral hardening pattern:

1. **Iron Law block** -- uppercase, monospace, absolute prohibition (e.g., `NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST`)
2. **Rationalization table** -- exhaustive enumeration of expected agent escape attempts with rebuttals
3. **Red flags list** -- self-monitoring triggers phrased as first-person thoughts ("This is different because...")
4. **Spirit-over-letter clause** -- explicit statement that finding loopholes violates the rule

`[SYNTHESIS INSIGHT]` This is the defining design primitive of the entire system. It treats the AI agent as an optimization system that will, under pressure, find the shortest path to "done" -- and preemptively closes those paths. The rationalization tables are not educational; they are adversarial. The TDD skill's table (`SKILL.md:258-271`) has 11 rows anticipating specific motivated reasoning patterns. The systematic-debugging skill has 13 red flags. This architecture implicitly models the agent as a system with incentive misalignment under time pressure -- a sophisticated framing that goes beyond simple instruction-following.

### 2. Gate-Based Workflow Progression

The workflow chain enforces sequential progression through committed artifacts:

```
User idea
  -> brainstorming (HARD-GATE: no code until spec approved)
    -> writing-plans (zero-placeholder guarantee)
      -> SDD or executing-plans (fresh subagent per task)
        -> TDD (per-task red-green-refactor)
          -> verification-before-completion
            -> finishing-a-development-branch
```

State is externalized to committed files at every handoff:

| From | To | State Object |
|------|-----|-------------|
| Brainstorming | Writing Plans | Spec at `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` |
| Writing Plans | SDD/Executing Plans | Plan at `docs/superpowers/plans/YYYY-MM-DD-<feature>.md` + sub-skill directive in header |
| SDD Controller | Each Task | Full task text (extracted upfront, not re-read from plan) |
| TDD | Next cycle | Test in red/green state; git commits at each cycle |
| Any terminal skill | Branch completion | All tasks marked complete in TodoWrite |

`[SYNTHESIS INSIGHT]` The plan header's required sub-skill directive (`> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development`) is a subtle but load-bearing design choice. The plan document carries its own execution protocol, enabling cold-start resumption by any capable agent without workflow knowledge. This is the key mechanism that makes the workflow chain composable rather than brittle.

### 3. Two-Stage Sequential Review in SDD

Subagent-driven development enforces spec compliance review BEFORE code quality review. This ordering is architecturally correct -- there is no point checking code style if the implementation is missing features. The spec reviewer operates with adversarial posture: `"CRITICAL: Do Not Trust the Report"` -- the reviewer must read actual code, not the implementer's self-assessment (`spec-reviewer-prompt.md`).

### 4. Pre-Cognition Interrupt (`using-superpowers`)

The meta-skill fires before ANY response, including clarifying questions, with a 1% applicability threshold. This inverts the natural pattern where agents gather context first and consult references second. The skill effectively gates all agent cognition through a skill-check mechanism, with two priority axes: temporal (process skills before implementation) and intent ("build X" -> brainstorming; "fix this" -> debugging).

### 5. Skill Pairs as Closed Interaction Loops

Skills are designed with their counterparts in mind:
- `using-git-worktrees` <-> `finishing-a-development-branch` (create workspace / clean up workspace)
- `requesting-code-review` <-> `receiving-code-review` (dispatch review / handle response)
- `systematic-debugging` -> `test-driven-development` -> `verification-before-completion` (diagnose -> fix with tests -> prove it works)

`[SYNTHESIS INSIGHT]` This pair-level coherence suggests the skill library was designed as a system, not accumulated as a collection. The pairs share assumptions about state, terminology, and failure modes. The receiving-code-review skill's anti-performative stance (forbidding "You're absolutely right!" at `receiving-code-review:29`) is not about tone -- it's about preventing the compliance behavior that would undermine the review pair's integrity.

## Data Flow Map

### Session Lifecycle

```
Session Start
  |
  v
Platform Adapter (hooks/session-start or .opencode/plugins/superpowers.js)
  |
  v
Inject using-superpowers/SKILL.md wrapped in <EXTREMELY_IMPORTANT>
  |
  v
[Every user message]
  |
  v
using-superpowers interrupt check (1% threshold)
  |
  +-- No skill applies -> normal response
  |
  +-- Skill applies -> invoke Skill tool -> announce -> create TodoWrite -> follow checklist
       |
       +-- Process skills (brainstorming, debugging) have priority over implementation skills
```

### Workflow Chain Data Flow

```
brainstorming
  |-- Clarifying questions (one at a time)
  |-- 2-3 approaches with tradeoffs
  |-- Design sections (user approves each)
  |-- Spec written to docs/superpowers/specs/ (committed)
  |-- [Optional] Visual companion: HTML -> local server -> browser -> events -> Claude
  |-- Self-review (inline, no subagent)
  |-- User approval gate
  v
writing-plans
  |-- Scope check (split if multi-subsystem)
  |-- File structure mapping (enumerate all files with responsibility statements)
  |-- Task decomposition (2-5 min steps, one action each)
  |-- Plan header with required sub-skill directive
  |-- Self-review checklist (spec coverage, placeholder scan, type consistency)
  |-- Plan written to docs/superpowers/plans/ (committed)
  v
subagent-driven-development (or executing-plans)
  |-- Controller extracts ALL tasks upfront
  |-- Per task:
  |    |-- Dispatch fresh implementer subagent (full task text, not file path)
  |    |-- Implementer: implement -> test -> commit -> self-review
  |    |-- Spec compliance reviewer (adversarial, reads actual code)
  |    |-- [If pass] Code quality reviewer (via requesting-code-review)
  |    |-- Mark complete in TodoWrite
  |-- Final whole-implementation review
  v
finishing-a-development-branch
  |-- 4 options: merge locally / push+PR / keep / discard
  |-- Worktree cleanup (conditional on option chosen)
```

### Review Data Flow

```
requesting-code-review
  |-- Explicitly names `superpowers:code-reviewer` as dispatch target (SKILL.md:8-9,33-34)
  |-- Dispatch isolated subagent (BASE_SHA, HEAD_SHA, description)
  |-- Never inherits session history
  v
code-reviewer agent (model: inherit, no tool restrictions)
  |-- Plan alignment -> Code quality -> Architecture -> Documentation
  |-- Issue severity: Critical / Important / Suggestions
  v
receiving-code-review (agent-agnostic -- handles feedback from ANY source)
  |-- YAGNI check on "professional features" suggestions
  |-- Anti-performative stance (no "You're absolutely right!")
  |-- Push-back protocol with reasoning requirements
  |-- "Strange things are afoot at the Circle K" safe word for uncomfortable pushback
```

`[SYNTHESIS INSIGHT]` The skill/agent coupling is asymmetric by design. `requesting-code-review` explicitly names `superpowers:code-reviewer` as the dispatch target, making it tightly coupled to the specific agent. `receiving-code-review` is entirely agent-agnostic -- it handles feedback from any source (agent, human, external). If `agents/code-reviewer.md` were removed, requesting breaks at dispatch but receiving is unaffected. The process contract lives in skills; the dispatch mechanism references the agent by name. This is a pragmatic design for a single-agent system but would not scale to multiple specialized reviewers without becoming a routing table.

## Strengths

### 1. Anti-Rationalization Architecture is Genuinely Novel

The systematic approach to foreclosing agent escape routes is the project's strongest contribution. Rather than assuming agents will follow instructions, superpowers anticipates specific failure modes and addresses them preemptively. The TDD skill's rationalization table (`SKILL.md:258-271`) is a masterclass in adversarial prompt design -- it maps 11 common excuses to rebuttals, treating the agent's optimization pressure as a known, modelable force.

### 2. Cold-Start Resumption via Externalized State

Every skill handoff produces a committed file artifact. A fresh agent can enter the workflow at any point by reading the standard file at the standard location. The plan header's embedded sub-skill directive eliminates the "how do I run this?" question entirely. This is a practical solution to the session-death problem without requiring complex checkpoint infrastructure.

### 3. Evidence-Driven Iteration

v5.0.6 removed the subagent review loop based on regression testing across 5 versions with 5 trials each, finding identical quality scores regardless of whether the loop ran (`RELEASE-NOTES.md:21`). This is unusual discipline -- removing a feature because measured data showed it added cost without quality benefit, rather than keeping it because it "should" help.

### 4. Multi-Platform Delivery Without Code Duplication

Seven platforms share the same canonical skill content through platform-specific adapters. The single `hooks/session-start` script handles three output JSON shapes via env var branching. The OpenCode adapter (`superpowers.js`) ships its own YAML frontmatter parser to maintain zero-dependency integrity (`superpowers.js:16-34`).

### 5. Contributor Governance as Anti-Slop Firewall

The CLAUDE.md file states a 94% PR rejection rate, requires human diff review for all PRs, and treats skills as behavior-shaping code requiring eval evidence for modification (`CLAUDE.md:36-38`). This explicitly protects the behavioral scaffolding from well-intentioned but untested agent-generated contributions.

### 6. Two-Stage Review Ordering

SDD's spec-before-quality review sequence is architecturally correct and explicitly defended. The red flag "START CODE QUALITY REVIEW BEFORE SPEC COMPLIANCE IS PASS" (`subagent-driven-development/SKILL.md:247`) shows this is a known failure mode being actively prevented.

## Limitations

### 1. No Crash Recovery in Plan Execution

`executing-plans` has no write-ahead status update to the plan file. If a session dies after Task 3 of 10, there is no record of which tasks completed. The TodoWrite state is session-local and does not persist to disk. For multi-task plans, this is a significant reliability gap.

### 2. No Re-Dispatch Budget in SDD

The review-fix-re-review cycle has no iteration limit. An implementer that consistently misses a spec requirement could loop indefinitely. There is no equivalent of a 3-attempt budget with PM escalation.

### 3. Uneven Test Coverage

SDD and the brainstorm server have deep test coverage. Most workflow skills (systematic-debugging, verification-before-completion, receiving-code-review, using-git-worktrees) have zero ongoing test coverage. The creation-time pressure testing documented in `skills/systematic-debugging/CREATION-LOG.md` is a one-time artifact, not a regression gate.

`[SYNTHESIS INSIGHT]` superpowers has a two-tier testing model that only becomes visible when examining both `tests/` and `skills/*/CREATION-LOG.md`: Tier 1 is creation-time pressure-scenario testing (documented in CREATION-LOG files), and Tier 2 is ongoing headless session integration tests (expensive, only for high-complexity skills). However, only one CREATION-LOG exists in the repo (systematic-debugging), so the creation-time tier is either inconsistently applied or not always documented.

### 4. No CI Pipeline

Tests are developer-run only. For a project with active community contributions (references to multiple external contributors in release notes), the absence of automated CI creates regression risk on merges.

### 5. Blocking Session-Start Hook

The session-start hook uses `async: false` with no timeout (`hooks/hooks.json:5`). On slow systems or network issues, this blocks the entire session start. No timeout boundary exists.

### 6. Option 1 in finishing-a-development-branch Lacks CI Gate

Option 1 ("merge locally") performs a bare `git checkout; git merge` with no CI verification. Code can reach the main branch without passing any automated checks.

### 7. No Background-Dispatch Default for Long Agents

`dispatching-parallel-agents` lacks guidance on using `run_in_background: true` for agents expected to run longer than 2 minutes. Agents block the coordinator waiting for completion.

## Notable Implementation Details

### Visual Companion (Brainstorming)

The brainstorming skill includes an optional visual companion (`visual-companion.md`) that creates browser-rendered mockups during the design phase. Data flow: Claude writes HTML to a server screen directory -> local server renders -> browser displays -> user selects -> events written to `state_dir/events` -> Claude reads on next turn. The server is zero-dependency (v5.0.2 ripped out Express/Chokidar/ws, removing ~1,200 lines) and includes auto-exit, PID monitoring, and liveness checks.

### CSO (Claude Search Optimization)

The `writing-skills` skill contains an empirically-derived anti-pattern: skill descriptions must NOT summarize the skill's workflow, only triggering conditions (`writing-skills:154-157`). The reason: Claude follows the description as a shortcut and skips reading the full skill body. This is a production-observed failure mode with implications for all skill authoring.

### DONE_WITH_CONCERNS Status Code

SDD's implementer can report `DONE_WITH_CONCERNS` -- an unusually honest status that creates a channel for flagging doubts without blocking progress. The controller reads the concerns and decides whether to act. This is a practical solution to the binary pass/fail limitation of most agent reporting protocols.

### Spec Self-Review vs. Subagent Review

Brainstorming performs inline spec self-review (no subagent overhead) but also provides a `spec-document-reviewer-prompt.md` for deeper subagent-based review. The calibration rule: "Flag issues that would cause real problems during planning, not stylistic improvements." This dual-path design avoids the overhead of dispatching a subagent for simple specs while preserving the option for complex ones.

### Token Budget Awareness

`writing-skills` includes explicit word count targets for skill descriptions: 150 words for getting-started content, 200 words for frequently-loaded skills. This engineering optimization acknowledges that skills consume context window budget on every session and must be lean.

### "Strange Things Are Afoot at the Circle K"

`receiving-code-review` includes a Bill & Ted reference as a safe word for uncomfortable pushback (`receiving-code-review:129`). This is a human-protocol detail embedded in an agent skill -- a signal that the skill was designed for a specific user who values cultural shorthand as communication efficiency.

## Beyond the Brief

### The Hardening-vs-Trust Spectrum

`[SYNTHESIS INSIGHT]` superpowers takes a fundamentally pessimistic view of agent compliance. Every skill assumes the agent will try to skip it under pressure. The rationalization tables are not training aids -- they are security controls. This is philosophically distinct from systems that trust the agent and add guardrails at the boundary. superpowers places guardrails inside the agent's reasoning process itself.

This has a cost: the skills are verbose (3,159 lines for 14 skills) and the Iron Law blocks create cognitive overhead on every invocation. But the benefit is measurable: the approach survives exactly the conditions (time pressure, unclear specs, long sessions) where agents most commonly degrade.

### Platform Breadth as Strategic Moat

`[SYNTHESIS INSIGHT]` Supporting 7 platforms creates significant maintenance overhead (a notable fraction of each release addresses platform-specific bugs), but it also makes superpowers the only behavioral scaffolding library with genuine cross-platform reach. The platform adapters are architecturally clean -- same content, different delivery -- which makes adding new platforms mechanical rather than creative work. If the AI coding agent market fragments across multiple harnesses, superpowers' platform breadth becomes a significant strategic advantage.

### The Missing Architecture Document

`[SYNTHESIS INSIGHT]` superpowers lacks a dedicated architecture document. The "why" of design decisions lives in release notes, CREATION-LOG files, and the skills themselves. For a project that values reasoning preservation (specs committed to `docs/superpowers/specs/`), the absence of a document that explains the overall system design -- why Iron Laws, why the workflow chain ordering, why the platform adapter pattern -- is a gap. The information exists but is scattered.

### Testing Philosophy Tension

`[SYNTHESIS INSIGHT]` There is a tension between the project's testing philosophy ("NO SKILL WITHOUT A FAILING TEST FIRST" in writing-skills) and the actual test coverage (most skills have no ongoing tests). The CREATION-LOG model (creation-time pressure testing) partially resolves this -- skills were tested at creation -- but the single CREATION-LOG file in the repo suggests this practice is either inconsistently applied or inconsistently documented. The writing-skills Iron Law demands tests, but the project's own skills don't all have them.

### Release Velocity Reveals Iteration Philosophy

8 releases in 6 weeks, with documented reversals (v5.0.5 restored user choice over mandatory SDD, v5.0.6 removed subagent review loops based on data). The project treats design decisions as hypotheses to be tested and reversed if the data doesn't support them. This is a healthy engineering culture signal that is relatively rare in developer tooling projects.
