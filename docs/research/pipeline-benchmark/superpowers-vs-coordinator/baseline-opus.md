# Comparative Analysis: Superpowers vs. coordinator-claude

**Date:** 2026-04-02
**Analyst:** Claude Opus 4.6 (direct research, no subagent delegation)
**Method:** Full file-level reading of both repositories — all plugin manifests, all skills, all agents, hooks, commands, architecture docs, tests, and CI configuration.

---

## Executive Summary

Superpowers and coordinator-claude represent two fundamentally different philosophies for augmenting Claude Code. Superpowers is a **skill library** — a curated set of behavioral interventions that make any coding agent follow proven workflows (TDD, brainstorming-before-building, verification-before-claiming-done). Coordinator-claude is an **orchestration system** — a structured agent hierarchy with named reviewers, multi-agent research pipelines, session lifecycle management, and a PM/EM organizational model.

They share significant DNA: coordinator-claude absorbed several superpowers skills wholesale (systematic-debugging, TDD, writing-plans, writing-skills, verification-before-completion, and others). The divergence is in what each system builds *around* those core skills.

**Superpowers** optimizes for: universal applicability, zero-dependency simplicity, multi-platform support, and broad adoption (131K GitHub stars).

**Coordinator-claude** optimizes for: deep orchestration, named persona-based review, multi-agent research, session continuity across compaction, and power-user workflows that assume full-time Claude Code usage.

---

## 1. Architecture

### 1.1 Plugin Structure

**Superpowers** ships as a single monolithic plugin (`plugin.json` at `.claude-plugin/plugin.json`). All skills, hooks, agents, and commands live in one repository, one install target. The plugin manifest declares the plugin name, version, and metadata — no dependency declarations, no configuration surface.

- Skills: `skills/<name>/SKILL.md` (14 total)
- Agents: `agents/<name>.md` (1: code-reviewer)
- Commands: `commands/<name>.md` (3: brainstorm, execute-plan, write-plan)
- Hooks: `hooks/hooks.json` (1 SessionStart hook)
- Multi-platform: `.cursor-plugin/plugin.json`, `.opencode/`, `.codex/`, `GEMINI.md`, `AGENTS.md`

*Source: `E:/dev/research/meta/superpowers/.claude-plugin/plugin.json`, full file listing.*

**Coordinator-claude** ships as a **multi-plugin system** — 7 plugins in `plugins/`, each with its own `plugin.json`:

| Plugin | Purpose | Skills | Agents | Commands |
|--------|---------|--------|--------|----------|
| coordinator | Core pipeline, universal reviewers | 25 | 7 | 23 |
| deep-research | Multi-source research pipelines | 0 | 6 | 3 |
| game-dev | UE systems, Sid reviewer | 0 | 3 | 0 |
| web-dev | Front-end + UX reviewers | 0 | 2 | 0 |
| data-science | ML/stats reviewer | 0 | 1 | 0 |
| notebooklm | Media research via MCP | 0 | 3 | 1 |
| remember | Session memory persistence | 1 | 0 | 0 |

*Source: `X:/coordinator-claude/plugins/*/` directory listing, plugin.json files.*

The multi-plugin architecture enables per-project toggling — game-dev and holodeck plugins load only when `project_type: unreal` is set in `.claude/coordinator.local.md`. Superpowers has no equivalent; all skills load always.

### 1.2 Skill Discovery & Invocation

Both systems share the same core mechanism: skills have YAML frontmatter with `name` and `description`, Claude Code's Skill tool loads them on demand.

**Superpowers' key innovation** is the `using-superpowers` meta-skill — injected into every session via the SessionStart hook. This skill establishes the behavioral imperative: "If you think there is even a 1% chance a skill might apply, you ABSOLUTELY MUST invoke the skill." The hook reads `skills/using-superpowers/SKILL.md`, JSON-escapes it, and injects the full content into the session's `additionalContext`. This means every session starts with the skill-checking mandate in context — no file read required.

*Source: `E:/dev/research/meta/superpowers/hooks/session-start` (lines 18-55), `E:/dev/research/meta/superpowers/skills/using-superpowers/SKILL.md`.*

**Coordinator-claude** uses a different priming mechanism: a `capability-catalog.md` (~220 tokens) injected via its own SessionStart hook. Rather than teaching skill discovery, it establishes the delegation imperative: "Before using a tool yourself, ask: would a specialist produce better results?" The hook also injects project-orientation context (recent git activity, project type, lessons file).

*Source: `X:/coordinator-claude/plugins/coordinator/capability-catalog.md`, `X:/coordinator-claude/plugins/coordinator/hooks/hooks.json`.*

### 1.3 Hook Usage

**Superpowers:** 1 hook (SessionStart only). Handles platform detection (Cursor vs. Claude Code vs. Copilot CLI) and emits platform-appropriate JSON — a polished cross-platform consideration. The hook script includes Windows `.cmd` wrapper support.

*Source: `E:/dev/research/meta/superpowers/hooks/hooks.json`, `hooks/run-hook.cmd`.*

**Coordinator-claude:** 6 hooks across 4 event types:

| Event | Hook | Purpose |
|-------|------|---------|
| SessionStart (startup/compact) | coordinator-reminder.sh | Inject capability catalog |
| SessionStart (startup/compact) | project-orientation.sh | Git activity, lessons, project type |
| SessionStart (startup/compact) | ue-knowledge-distrust.sh | UE hallucination warning |
| PreToolUse (Bash) | validate-commit.sh | Enforce commit policies |
| PreToolUse (WebSearch/WebFetch) | suggest-sonnet-research.sh | Cost optimization nudge |
| PostToolUse (ExitPlanMode) | plan-persistence-check.sh | Verify plan written to disk |
| PostToolUse (all) | context-pressure-advisory.sh | Context usage monitoring |
| PreCompact | context-pressure-precompact.sh | Pre-compaction handoff prompt |

*Source: `X:/coordinator-claude/plugins/coordinator/hooks/hooks.json`.*

Coordinator-claude's hook surface is substantially richer — it uses hooks not just for session initialization but for ongoing behavioral guardrails (commit validation, cost optimization, context pressure management). The PreCompact hook is particularly notable: it prompts the agent to create a structured handoff artifact before context compaction fires, enabling cross-compaction continuity.

### 1.4 Agent Architecture

**Superpowers:** 1 agent definition (`agents/code-reviewer.md`). Generic "Senior Code Reviewer" with no persona, model inheritance from parent, and read-write access. The agent is competent but undifferentiated — it reviews against plan alignment and code quality standards without a specific behavioral identity.

**Coordinator-claude:** 22 agent definitions across all plugins, each with distinct behavioral profiles:

- **Named personas** with consistent identities (Patrik, Sid, Camelia, Palí, Fru, Zolí) that carry specific domain mandates, review checklists, output format specs, and even `color` attributes for visual distinction.
- **Explicit model selection:** Opus for reviewers (judgment), Sonnet for executors (speed), Haiku for scouts (cost).
- **Structured output:** Patrik's agent definition specifies exact JSON output format with severity enum values (`"critical"`, `"major"`, `"minor"`, `"nitpick"`) and field names (`"finding"` not `"title"`, `"line_start"` not `"line"`). This enables machine-parseable review output.
- **Tool-restricted agents:** Patrik is explicitly read-only ("You are a read-only reviewer… Do NOT use: Edit, Write, Bash"). The executor is explicitly write-capable but "the typist, not the architect."
- **Backstop protocol:** Zolí exists solely to challenge Patrik's conservative recommendations — a structural check against under-ambition.

*Source: `X:/coordinator-claude/plugins/coordinator/agents/staff-eng.md` (250 lines), `X:/coordinator-claude/plugins/ARCHITECTURE.md`.*

### 1.5 Routing & Composition

**Superpowers** has no routing concept. The single code-reviewer agent handles all review requests.

**Coordinator-claude** implements a composable routing table (`routing.md`) where each domain plugin contributes a routing fragment. At dispatch time, `/review-dispatch` merges all fragments, matches change signals (front-end? game logic? architecture?) against the composite table, and routes to the appropriate reviewer(s). If no domain reviewer matches, Patrik handles it as universal fallback. The effort calibration system (Low/Medium/High) determines how many reviewers run and whether the backstop is mandatory.

*Source: `X:/coordinator-claude/plugins/coordinator/routing.md`.*

---

## 2. Capabilities — Side-by-Side

| Capability | Superpowers | Coordinator-claude |
|------------|-------------|-------------------|
| **Core workflow skills** | brainstorming, writing-plans, executing-plans, subagent-driven-development, TDD, systematic-debugging, verification-before-completion, finishing-a-development-branch, using-git-worktrees, dispatching-parallel-agents, receiving/requesting-code-review, writing-skills | Same core set (absorbed), plus: stuck-detection, project-onboarding, merging-to-main, consolidate-git, debt-triage, lessons-trim, tracker-maintenance, artifact-consolidation, codex-review-gate, atlas-integrity-check, handoff-archival, validate, skill-discovery |
| **Code review** | 1 generic reviewer | 6 named reviewers with domain specialization + backstop |
| **Research pipelines** | None | 4 pipelines: internet (A), repo (B), structured (C), NotebookLM media (D) |
| **Multi-agent planning** | None | Staff sessions (Agent Teams-based): 2-5 debaters + synthesizer |
| **Session management** | None | session-start, session-end, handoff, pickup, workday-start, workday-complete |
| **Context pressure** | None | PostToolUse advisory, PreCompact handoff prompt |
| **Multi-platform** | Claude Code, Cursor, Codex, OpenCode, Gemini CLI, Copilot CLI | Claude Code only |
| **Visual brainstorming** | WebSocket server for browser-based mockups/diagrams | None |
| **MCP integration** | None | holodeck-control (69 UE tools), holodeck-docs (UE documentation RAG), NotebookLM, Context7 |
| **CI validation** | None | GitHub Actions: frontmatter validation, reference checking, secrets scanning, JSON schema validation, agent tool validation, file size checks, spec line counts, gitignore policy |
| **Cross-model delegation** | Subagent model hints (cheap/standard/capable) | Explicit model selection per role (Haiku/Sonnet/Opus), Codex CLI as parallel runtime |
| **Autonomous operations** | None | /autonomous, /mise-en-place (backlog execution), /code-health (night-shift), /bug-sweep |

### 2.1 Where Superpowers Is Stronger

**Multi-platform support.** Superpowers runs on 6+ platforms. The session-start hook detects Cursor, Claude Code, Copilot CLI, and unknown platforms, emitting platform-appropriate JSON. `GEMINI.md` and `AGENTS.md` provide entry points for Gemini CLI and Copilot CLI. `.codex/INSTALL.md` and `.opencode/` provide Codex and OpenCode support. This is genuinely impressive breadth — each platform has different hook formats, tool names, and context injection mechanisms.

*Source: `E:/dev/research/meta/superpowers/hooks/session-start` (lines 46-55), `GEMINI.md`, `AGENTS.md`, `.codex/INSTALL.md`.*

**Visual brainstorming.** The brainstorming skill includes a WebSocket-based browser companion (`skills/brainstorming/scripts/server.cjs`) for showing mockups, diagrams, and visual options during design discussions. This is a unique capability — coordinator-claude's brainstorming is entirely text-based.

*Source: `E:/dev/research/meta/superpowers/skills/brainstorming/visual-companion.md`, `scripts/server.cjs`.*

**Zero-dependency simplicity.** Superpowers has no external dependencies, no setup script, no CI pipeline to maintain. Install and go. This is a deliberate design choice enforced by contributor guidelines: "PRs that add optional or required dependencies on third-party projects will not be accepted."

*Source: `E:/dev/research/meta/superpowers/CLAUDE.md` (contributor guidelines).*

**Adoption and community proof.** 131K GitHub stars provides massive real-world validation. The test suite includes adversarial prompt testing (`tests/explicit-skill-requests/`, `tests/skill-triggering/`) that pressure-tests skill invocation behavior across different user request patterns.

### 2.2 Where Coordinator-claude Is Stronger

**Orchestration depth.** The full enrichment-review-execute pipeline (`ARCHITECTURE.md`, 224 lines) with write-ahead status protocol, sequential review with mandatory fix gates, effort calibration, backstop reconciliation, and post-review synthesis is significantly more sophisticated than superpowers' linear plan → execute → review flow.

**Research infrastructure.** Four distinct research pipelines using Agent Teams with tiered model selection (Haiku scouts → Sonnet specialists → Opus synthesizer) have no equivalent in superpowers. The repo research pipeline (Pipeline B) with dependency-weighted repomaps and architecture atlas generation is particularly distinctive.

**Session lifecycle management.** Session-start, handoff, pickup, workday-start, workday-complete — a complete session lifecycle that superpowers doesn't attempt. The context-pressure hooks that monitor usage and prompt for handoff artifacts before compaction are a novel approach to cross-compaction continuity.

**CI validation.** 11 Python validation scripts in `.github/scripts/` catch frontmatter errors, broken references, secrets, JSON schema violations, oversized files, and agent tool declarations. Superpowers has no CI pipeline — validation is manual.

**Autonomous operation modes.** `/autonomous`, `/mise-en-place`, `/code-health`, and `/bug-sweep` enable Claude to work independently for extended periods with structured checkpoints. Superpowers' SDD (subagent-driven-development) achieves autonomous execution within a session, but doesn't provide the overnight/unattended workflows coordinator-claude enables.

---

## 3. Patterns & Conventions

### 3.1 Prompt Engineering Techniques

Both systems use several shared techniques that likely originated in superpowers (given coordinator-claude's acknowledged absorption):

**Anti-rationalization tables.** Both systems use `| Excuse | Reality |` tables that preemptively address LLM rationalization patterns. Superpowers' TDD skill has 11 entries; its verification skill has 8. Coordinator-claude's inherited versions are identical.

*Source: `E:/dev/research/meta/superpowers/skills/test-driven-development/SKILL.md` (lines 258-270).*

**Red Flags sections.** Lists of "if you're thinking this, STOP" patterns. Both use these extensively. The `using-superpowers` skill has a 12-entry table mapping rationalizing thoughts to corrective responses.

**Graphviz decision flows.** Both use `dot` language graphs embedded in markdown to visualize decision trees. Superpowers pioneered this — its brainstorming, TDD, SDD, and dispatching-parallel-agents skills all include Graphviz diagrams. Coordinator-claude uses this pattern in its absorbed skills.

**HARD-GATE directives.** Both use XML-style tags (`<HARD-GATE>`, `<EXTREMELY-IMPORTANT>`) for non-negotiable behavioral constraints. These exploit LLMs' tendency to treat XML tags as structural rather than prose, making the constraints harder to rationalize past.

**"Your human partner" language.** Superpowers consistently uses "your human partner" instead of "the user" — deliberate framing that positions the AI as a collaborator rather than a tool. Coordinator-claude uses "the PM" (product manager) instead, establishing a more hierarchical organizational model.

### 3.2 Patterns Unique to Superpowers

**Skill self-review loops.** The brainstorming skill includes a "Spec Self-Review" checklist (placeholder scan, internal consistency, scope check, ambiguity check) that the agent runs on its own output before presenting to the user. The writing-plans skill has a similar self-review (spec coverage, placeholder scan, type consistency). This inline quality gate is lightweight and effective.

*Source: `E:/dev/research/meta/superpowers/skills/brainstorming/SKILL.md` (lines 117-124).*

**Subagent prompt templates as companion files.** SDD keeps its implementer, spec-reviewer, and code-quality-reviewer prompts as separate `.md` files alongside the main SKILL.md, referenced by relative path. This keeps the main skill readable while providing complete dispatch templates.

*Source: `E:/dev/research/meta/superpowers/skills/subagent-driven-development/implementer-prompt.md`, `spec-reviewer-prompt.md`, `code-quality-reviewer-prompt.md`.*

**Model selection guidance in skills.** SDD includes explicit guidance on matching model capability to task complexity ("Touches 1-2 files with a complete spec → cheap model") — a practical cost-optimization pattern.

*Source: `E:/dev/research/meta/superpowers/skills/subagent-driven-development/SKILL.md` (lines 89-101).*

### 3.3 Patterns Unique to Coordinator-claude

**Structured JSON output for reviews.** Patrik's agent definition specifies exact JSON schema for review output — field names, severity enums, verdict strings, coverage declarations. This enables machine-parseable reviews that can be automatically triaged, integrated, and tracked. Superpowers' code-reviewer produces free-form prose.

*Source: `X:/coordinator-claude/plugins/coordinator/agents/staff-eng.md` (lines 99-138).*

**Write-ahead status protocol.** Borrowed from database WAL design — mark status before starting work, update after completion. If a session crashes mid-phase, the tracker shows "in progress" rather than misleading "not started." This is sophisticated crash-recovery infrastructure absent from superpowers.

*Source: `X:/coordinator-claude/plugins/ARCHITECTURE.md` (lines 178-205).*

**EM operating model with explicit delegation boundaries.** The `em-operating-model.md` (76 lines) defines what the coordinator should and should NOT do ("The EM Does Not Type Code"), with escalation tiers for implementation work. This meta-governance layer shapes orchestration behavior in ways that superpowers doesn't attempt.

*Source: `X:/coordinator-claude/plugins/coordinator/em-operating-model.md`.*

**Composable routing fragments.** Domain plugins contribute routing fragments that merge into a composite routing table at dispatch time. This is a genuine plugin composition pattern — adding a new domain means creating a new plugin with a `routing.md`, not modifying the core coordinator.

*Source: `X:/coordinator-claude/plugins/coordinator/routing.md` (lines 46-55).*

---

## 4. Quality & Polish

### 4.1 Code Quality

**Superpowers** is remarkably clean. The session-start hook script is well-commented, handles platform detection gracefully, uses bash parameter substitution for JSON escaping (explicitly noted as faster than character-by-character loops), and handles edge cases (legacy skills directory detection, missing files). The brainstorming server (`server.cjs`) is a zero-dependency WebSocket server — deliberately avoiding npm packages.

**Coordinator-claude** has more surface area and thus more places for quality to vary. The CI pipeline (11 validation scripts) enforces quality structurally — frontmatter must parse, references must resolve, JSON must validate, files must stay under size limits, agent tool declarations must match available tools. This compensates for the larger surface area with automated guardrails.

### 4.2 Documentation

**Superpowers:** README is conversational and accessible ("It starts from the moment you fire up your coding agent..."). The `docs/` directory contains plan documents (design specs for features being built), testing documentation, and platform-specific READMEs. Internal documentation is minimal — the skills are the documentation.

**Coordinator-claude:** Far more extensively documented. `docs/architecture.md` (224 lines) explains the full conceptual model. `docs/getting-started.md`, `docs/customization.md`, `docs/ci-pipeline.md` cover operational topics. `docs/research/` contains 10 research artifacts documenting design decisions with evidence. `ARCHITECTURE.md` in the plugins directory explains the agent hierarchy philosophy. However, the volume of documentation could be overwhelming for newcomers.

### 4.3 Testing

**Superpowers** has 47 test files across four categories:
- `tests/brainstorm-server/` — Node.js unit tests for the WebSocket server (proper test framework)
- `tests/claude-code/` — Shell scripts that run Claude Code with specific prompts and analyze behavior
- `tests/explicit-skill-requests/` — Adversarial prompt tests for skill invocation
- `tests/skill-triggering/` — Tests for automatic skill matching
- `tests/subagent-driven-dev/` — Integration test scaffolds with design docs and plans

The adversarial prompt testing is particularly impressive — it tests whether the skill system correctly triggers across different user phrasings and contexts.

*Source: `E:/dev/research/meta/superpowers/tests/` directory.*

**Coordinator-claude** has 14 test files, primarily in `plugins/remember/tests/` (unit tests for the remember plugin's JS components). The CI validation scripts (11 Python scripts) serve as a form of structural testing but don't test behavioral outcomes. There are no adversarial prompt tests or skill-triggering tests equivalent to superpowers'.

### 4.4 Onboarding

**Superpowers** wins on onboarding. Install from marketplace (one command), restart, and the `using-superpowers` meta-skill handles everything else. No configuration needed.

**Coordinator-claude** requires `git clone` + `bash setup/install.sh` + restart + `/session-start`. The system assumes the user will configure `coordinator.local.md` for project type, understand the PM/EM organizational model, and learn ~23 slash commands. The power is there, but the learning curve is steep.

---

## 5. What Coordinator-claude Could Learn

### 5.1 Multi-Platform Support (High Impact)

Superpowers' cross-platform hook script (`hooks/session-start`) is a masterclass in platform detection and adaptation. Coordinator-claude is Claude Code-only. Even partial support for Cursor would significantly expand reach. The specific patterns to emulate:

- Platform detection via environment variables (`CURSOR_PLUGIN_ROOT`, `CLAUDE_PLUGIN_ROOT`, `COPILOT_CLI`)
- Platform-appropriate JSON output format (`additional_context` vs. `hookSpecificOutput.additionalContext` vs. `additionalContext`)
- Dedicated install instructions per platform (`.codex/INSTALL.md`, `.opencode/INSTALL.md`)
- `GEMINI.md` and `AGENTS.md` for non-Claude-Code platforms

*Source: `E:/dev/research/meta/superpowers/hooks/session-start` (lines 46-55).*

### 5.2 Adversarial Skill Testing (High Impact)

Superpowers' `tests/explicit-skill-requests/` and `tests/skill-triggering/` directories contain shell scripts that run Claude Code with crafted prompts and verify skill invocation behavior. Example prompts include "skip formalities" scenarios, "I know what SDD means" shortcuts, and "after planning flow" transitions. Coordinator-claude has no equivalent — its behavioral testing is implicit (CI validates structure, not behavior).

*Source: `E:/dev/research/meta/superpowers/tests/explicit-skill-requests/prompts/`, `tests/skill-triggering/prompts/`.*

### 5.3 Visual Brainstorming (Medium Impact)

The zero-dependency WebSocket server for browser-based visual collaboration is genuinely novel. For coordinator-claude's brainstorming skill (which is text-only), adding visual companion support would improve design discussions for UI-heavy projects. The superpowers implementation is instructive — it uses a simple HTML template (`frame-template.html`), a Node.js WebSocket server (`server.cjs`), and shell scripts for lifecycle management (`start-server.sh`, `stop-server.sh`).

*Source: `E:/dev/research/meta/superpowers/skills/brainstorming/scripts/`.*

### 5.4 Subagent-Driven Development Pattern (Medium Impact)

Coordinator-claude's executor dispatching is command-driven (`/delegate-execution`), which adds ceremony. Superpowers' SDD skill provides a lighter-weight pattern: fresh subagent per task with two-stage review (spec compliance → code quality), model selection guidance per task complexity, and clear escalation for blocked implementers. The specific patterns worth studying:

- **Implementer status protocol** (DONE, DONE_WITH_CONCERNS, NEEDS_CONTEXT, BLOCKED) with explicit handling for each
- **Model selection by task complexity signals** ("Touches 1-2 files → cheap model")
- **Two-stage review** (spec compliance THEN code quality, never reversed)

*Source: `E:/dev/research/meta/superpowers/skills/subagent-driven-development/SKILL.md` (lines 89-118).*

### 5.5 "Your Human Partner" Language (Low Impact, High Signal)

Superpowers' deliberate use of "your human partner" instead of "the user" is a subtle but effective prompt engineering choice. It positions the AI as a collaborator with agency and responsibility — "your human partner's reputation" creates a different behavioral incentive than "the user's reputation." Coordinator-claude's "the PM" framing is functionally similar but loses the warmth. Worth A/B testing.

### 5.6 Where Coordinator-claude Is Already Stronger

For balance, coordinator-claude has clear advantages that superpowers doesn't match:

- **Named persona reviewers** with structured JSON output, domain specialization, and backstop protocol — superpowers' single generic code-reviewer is significantly weaker
- **Multi-agent research pipelines** — superpowers has nothing comparable
- **Session lifecycle** (handoff/pickup, context pressure management, workday orchestration) — superpowers has no concept of session continuity
- **CI validation** — 11 structural validation scripts that catch errors before they ship
- **Composable plugin architecture** — per-project plugin toggling vs. monolithic all-or-nothing
- **The EM operating model** — a sophisticated meta-governance layer that shapes orchestration behavior
- **Write-ahead status protocol** — crash recovery infrastructure with database WAL-inspired design

---

## 6. Synthesis

These systems serve different audiences. Superpowers is for everyone — install it and your coding agent becomes meaningfully better at following proven workflows. Coordinator-claude is for power users who want a structured engineering team simulation with named reviewers, research pipelines, and session continuity.

The most interesting finding is the degree of shared DNA. Coordinator-claude absorbed superpowers' core skills (TDD, systematic-debugging, writing-plans, writing-skills, verification-before-completion) and built a much larger orchestration layer around them. The superpowers skills function as a "quality floor" — the minimum behavioral standards any coding agent should meet. Coordinator-claude extends this with a "quality ceiling" — the maximum sophistication available when you're willing to invest in setup and learning.

If coordinator-claude were to adopt superpowers' multi-platform support and adversarial testing patterns while maintaining its own orchestration depth, it would bridge the accessibility gap without sacrificing power. Conversely, if superpowers were to add named reviewers with structured output and research pipelines, it would approach coordinator-claude's power but risk losing its simplicity advantage.

The optimal strategy for coordinator-claude is not to become superpowers (simpler, broader) but to learn from its polish: platform adaptability, behavioral testing, and zero-friction onboarding for the core experience. The orchestration layer is coordinator-claude's moat; the question is whether the on-ramp can be made smoother.
