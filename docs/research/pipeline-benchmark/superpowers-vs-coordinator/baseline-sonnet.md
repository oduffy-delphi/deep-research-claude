# Comparative Analysis: superpowers vs. coordinator-claude

**Date:** 2026-04-02  
**Analyst:** Claude Sonnet 4.6 (direct, no sub-agents)  
**Scope:** Architecture, capabilities, patterns, quality, and actionable improvement candidates

---

## Executive Summary

`superpowers` (obra/superpowers, 131k stars) and `coordinator-claude` (oduffy-delphi/coordinator-claude) are both Claude Code plugin systems that enforce structured development workflows through skills, agents, hooks, and commands. They share a surprising amount of DNA — both grew out of the same upstream `superpowers` codebase, and many skills in `coordinator-claude` are direct forks of `superpowers` originals. But the systems have diverged significantly in design philosophy:

- **superpowers** is a zero-dependency, single-plugin, broadly portable system focused on the developer workflow: brainstorm → plan → TDD implementation → review. Its north star is reproducible engineering discipline, enforced via tightly-written skills and a single session-start hook that injects the `using-superpowers` skill.

- **coordinator-claude** is a multi-plugin orchestration stack modeled on a formal PM/EM agent hierarchy. Its north star is structured delegation: the main session is the EM, it delegates to named reviewers (Patrik, Sid, Camelia, etc.) and executors, and session lifecycle is carefully managed through hooks, handoffs, and pipeline commands. It is feature-dense but personal/professional-grade rather than mass-market.

The comparison is not purely competitive. `coordinator-claude` explicitly forks `superpowers` skills and extends them; the question is where each system is stronger, and what each can learn from the other.

---

## 1. Architecture

### superpowers: Single-Plugin, Hook-Injected

**Structure:**
```
.claude-plugin/plugin.json       — plugin manifest
hooks/
  hooks.json                     — SessionStart hook definition
  session-start                  — bash script
  run-hook.cmd                   — Windows wrapper
skills/
  brainstorming/SKILL.md + scripts/
  systematic-debugging/SKILL.md + support files
  test-driven-development/SKILL.md
  writing-plans/SKILL.md
  subagent-driven-development/SKILL.md
  executing-plans/SKILL.md
  [9 other skills]
agents/
  code-reviewer.md
commands/
  brainstorm.md, execute-plan.md, write-plan.md
```

**Extension model:** Everything is a single flat plugin. There is no concept of sub-plugins or domain routing. All skills live in a shared namespace. Users extend by forking or adding personal skills to `~/.claude/skills/`.

**Hook design:** One `SessionStart` hook that reads `skills/using-superpowers/SKILL.md` into context on every session start. The hook is a 57-line bash script ([`hooks/session-start`](E:/dev/research/meta/superpowers/hooks/session-start)) that: (a) reads the skill file, (b) escapes it for JSON embedding, (c) emits platform-appropriate JSON (`hookSpecificOutput` for Claude Code, `additionalContext` for Copilot CLI, `additional_context` for Cursor). Platform detection is via `CURSOR_PLUGIN_ROOT` and `COPILOT_CLI` environment variables. This is remarkably clean for cross-platform support.

**Configuration:** Zero. No per-project config files, no routing tables, no domain specialization. The only configuration is which skills you install.

**Multi-platform support:** superpowers explicitly supports Claude Code, Cursor, Copilot CLI, Gemini CLI, Codex, and OpenCode. Each platform has separate install docs and a separate hook output format. The `using-superpowers/references/` directory has per-platform tool-name mappings so skills written for Claude Code work on Gemini and Copilot.

### coordinator-claude: Multi-Plugin, Routing-Aware Hierarchy

**Structure:**
```
plugins/
  coordinator/
    .claude-plugin/plugin.json
    agents/ (7 agents: staff-eng, eng-director, ambition-advocate, enricher, executor, review-integrator, docs-checker)
    commands/ (24 commands: session-start, handoff, workday-start, staff-session, etc.)
    hooks/hooks.json + scripts/ (8 hooks)
    pipelines/ (executing-plans, staff-session, deep-research, etc.)
    skills/ (26 skills)
    routing.md, capability-catalog.md, em-operating-model.md
  game-dev/   (Sid agent, blueprint workers, routing.md)
  web-dev/    (Palí, Fru agents, routing.md)
  data-science/ (Camelia agent, routing.md)
  notebooklm/ (Scout/Worker/Sweep agents, research pipeline)
  remember/   (Node.js session memory system)
  [deep-research plugin — standalone repo]
```

**Extension model:** Each domain plugin provides a `routing.md` fragment that the core `routing.md` merges at dispatch time (via `/review-dispatch`). This is a proper plugin interface: plugins register themselves via a known file-system contract. Domain plugins are toggled per-project via `coordinator.local.md` with a `project_type` field.

**Hook design:** 8 hooks across 4 events:
- `SessionStart/startup|compact`: `coordinator-reminder.sh` (reads project type, emits EM model or capability catalog) + `project-orientation.sh` (loads active plans, git state, tracker) + `ue-knowledge-distrust.sh` (UE warning)
- `SessionStart/clear`: lighter orientation pass
- `PreToolUse/Bash`: `validate-commit.sh` (prevents git operations on main)
- `PreToolUse/WebSearch|WebFetch`: `suggest-sonnet-research.sh` (nudges to delegate web research)
- `PostToolUse/ExitPlanMode`: `plan-persistence-check.sh` (verifies plan was written to disk, not just context)
- `PostToolUse/*`: `context-pressure-advisory.sh` (emits warnings at 60%/78% context, detects post-compaction via sentinel file, autonomous-run-aware)
- `PreCompact/*`: `context-pressure-precompact.sh` (writes state snapshot before compaction fires)

The hook system is dramatically more sophisticated. The `context-pressure-advisory.sh` ([`hooks/scripts/context-pressure-advisory.sh`](X:/coordinator-claude/plugins/coordinator/hooks/scripts/context-pressure-advisory.sh)) is particularly notable: it detects the model from the transcript header, computes model-appropriate context window sizes (Opus 4.6 gets 1M tokens, Sonnet 200K), estimates usage via file size proxy, and emits bark-once warnings with sentinel files. It also bridges pre/post compaction via a sentinel read — the `PreCompact` hook writes state to `/tmp/compaction-state-{SESSION_ID}.md`, and the `PostToolUse` hook reads it back on the first tool call after compaction fires. This is the most sophisticated hook I've seen in a Claude Code plugin.

**Configuration:** `coordinator.local.md` per project, YAML frontmatter with `project_type` list (`meta`, `unreal`, `web`, `data-science`). This controls which domain agents are active in the routing table.

---

## 2. Capabilities

### Feature Map

| Capability | superpowers | coordinator-claude |
|---|---|---|
| **Brainstorming / design exploration** | Yes — rich skill with visual companion option | Yes — lighter skill without visual companion |
| **Plan writing** | Yes | Yes (extended with stub/enrichment model) |
| **TDD enforcement** | Yes — primary feature | Yes (forked from superpowers) |
| **Systematic debugging** | Yes — primary feature | Yes (forked from superpowers) |
| **Subagent-driven development** | Yes — detailed skill with 2-stage review | Via executor agents + `/delegate-execution` |
| **Named code reviewers** | One generic reviewer (code-reviewer.md) | 6 named reviewers: Patrik, Zolí, Sid, Palí, Fru, Camelia |
| **Review routing** | Manual | Automatic via `/review-dispatch` + routing.md fragments |
| **Session handoffs** | No | Yes — `/handoff`, `/pickup`, cascade obligations |
| **Context pressure management** | No | Yes — advisory, critical, post-compaction bridge |
| **Git workflow enforcement** | Via skills (using-git-worktrees, finishing-branch) | Via hooks (validate-commit.sh blocks main) + skills |
| **Workday lifecycle** | No | Yes — `/workday-start`, `/workday-complete`, `/daily-review` |
| **Agent Teams research** | No | Yes — 4 research pipelines (internet, repo, structured, NotebookLM) |
| **Staff sessions** | No | Yes — multi-debater planning sessions with Zolí synthesis |
| **Codebase enrichment** | No | Yes — enricher agent fills plan stubs with file paths + patterns |
| **Autonomous mode** | No | Yes — `/autonomous` flag aware in context pressure hooks |
| **Stuck detection** | No | Yes — dedicated skill for repetition/oscillation/paralysis |
| **Project onboarding** | No | Yes — `/project-onboarding` generates tracker, CLAUDE.md template |
| **Architecture audit** | No | Yes — `/architecture-audit` pipeline |
| **Session memory (persistent)** | No | Via `remember` plugin — rolling daily/weekly summaries |
| **Visual brainstorming companion** | Yes — browser-based SVG renderer | No |
| **Multi-platform support** | Yes — CC, Cursor, Copilot, Gemini, Codex, OpenCode | Claude Code only (primarily) |
| **Skill writing methodology** | Yes — TDD-based, pressure testing, CSO | Yes (forked, with additions) |
| **Verification before completion** | Yes | Yes (forked) |
| **Git worktrees** | Yes | Yes (forked) |

### Where superpowers is Stronger

**Breadth-of-platform:** The multi-platform support story is genuinely impressive. The `session-start` hook detects Cursor vs. Claude Code vs. Copilot CLI and emits the correct JSON format. The `using-superpowers` skill includes per-platform tool name reference tables (`references/copilot-tools.md`, `references/codex-tools.md`, `references/gemini-tools.md`). coordinator-claude is Claude Code-first with no comparable cross-platform documentation.

**Visual brainstorming:** The visual companion ([`skills/brainstorming/visual-companion.md`](E:/dev/research/meta/superpowers/skills/brainstorming/visual-companion.md), [`scripts/server.cjs`](E:/dev/research/meta/superpowers/skills/brainstorming/scripts/server.cjs)) is unique — a local HTTP server serving SVGs of mockups and diagrams during brainstorming sessions. coordinator-claude has no equivalent. This is a genuinely novel capability for the brainstorming workflow.

**Zero dependency philosophy:** superpowers ships with no Node.js dependency. coordinator-claude's `remember` plugin requires Node. This matters for adoption across diverse environments.

**Openness to contribution:** The PR template, contributor guidelines, and strong community (131k stars, Discord) mean superpowers has external validation of its quality through the contribution filter. coordinator-claude is a personal/professional tool.

### Where coordinator-claude is Stronger

**Context lifecycle management:** The full context pressure → handoff → pickup → compaction bridge cycle is unmatched. superpowers has no equivalent of the multi-phase context pressure monitoring, pre-compaction state snapshots, or handoff cascade obligations.

**Named reviewer depth:** Patrik's reviewer profile ([`agents/staff-eng.md`](X:/coordinator-claude/plugins/coordinator/agents/staff-eng.md)) is ~250 lines: 4-pass review methodology, structured JSON output format with typed severity strings, coverage declaration requirement, strategic context reading (roadmap/vision files), LSP tool usage for C++, holodeck-docs integration for UE, docs-checker integration, backstop protocol with Zolí. This is dramatically more detailed than superpowers' 49-line generic code-reviewer.

**Structured research pipelines:** The 4-pipeline research system (Haiku scouts → Sonnet specialists → Opus synthesizer, with adversarial cross-pollination between specialists) has no superpowers equivalent. The README cites this pattern as independently converging on Anthropic's production multi-agent research architecture.

**Inverted capability delegation:** The design principle where the coordinator intentionally sees fewer tools than its delegates (saves ~40K tokens of MCP schemas) is architecturally sophisticated and well-documented.

**Session lifecycle commands:** `/workday-start`, `/workday-complete`, `/session-start`, `/session-end`, `/handoff`, `/pickup` form a complete session lifecycle system. superpowers has nothing comparable.

---

## 3. Patterns & Conventions

### Skill Format

Both systems use the same SKILL.md frontmatter convention (`name:`, `description:`). This is expected since coordinator-claude forked from superpowers.

**superpowers additions:**
- Specifies `description` should start with "Use when..." — extensively documented in `writing-skills/SKILL.md` with the rationale (CSO — Claude Search Optimization: descriptions that summarize workflow cause Claude to shortcut the skill body)
- `description` must be under ~500 chars, third-person
- Graphviz `dot` flowcharts for non-obvious decision trees — with dedicated render tooling (`render-graphs.js`)
- Persuasion psychology citations in skill-bulletproofing (Cialdini, Meincke)

**coordinator-claude additions:**
- Some skills have `version: 1.0.0` in frontmatter
- Agent files have `model:`, `color:`, `tools:`, and `access-mode:` fields (Claude Code agent manifest format)
- `<!-- Review: patrik — ... -->` inline comments in agent files show that review findings were incorporated (e.g., `staff-eng.md` has `<!-- Review: patrik — verdict strings must match JSON output spec -->`)

### Hook Output Format

superpowers uses `hookSpecificOutput.additionalContext` for Claude Code, `additional_context` for Cursor, `additionalContext` (top-level) for Copilot. The detection logic in `session-start` is clean and documented with inline comments explaining the multi-platform divergence.

coordinator-claude hooks all use `hookSpecificOutput.additionalContext` (Claude Code only). The context pressure hook additionally handles Windows/Git Bash hang issues with `timeout 2 cat` for stdin reading — a pragmatic fix with a good inline comment explaining the history.

### Prompt Engineering Techniques

Both systems use the same core techniques for behavior enforcement:
- **`<HARD-GATE>` / `<EXTREMELY-IMPORTANT>` tags**: High-emphasis XML-like tags for mandatory rules
- **Rationalization tables**: `| Excuse | Reality |` tables that pre-empt known shortcuts
- **Red flags lists**: Explicit list of "stop if you're thinking this"
- **"Spirit vs letter" language**: "Violating the letter of the rules is violating the spirit" in both systems
- **Graphviz flowcharts**: Both use `dot` syntax for process visualization

coordinator-claude adds:
- **Backstop protocol**: Explicit "when to invoke Zolí" sections in Patrik's profile
- **Coverage declarations**: Mandatory coverage table at end of every review (what was reviewed, confidence levels, gaps)
- **Structured JSON output**: Reviews must emit a typed `ReviewOutput` JSON block with strict field names (using EXACT strings like `"critical"` not `"high"`, `"finding"` not `"description"`)
- **`<!-- Review: patrik — ... -->` comments**: Inline documentation that a finding was reviewed and incorporated
- **Write-ahead status protocol**: Plan documents have `**Status:**` fields updated before work begins, not after

### Configuration Patterns

superpowers: global installation, no per-project config. Simple.

coordinator-claude: `coordinator.local.md` YAML frontmatter. The `coordinator-reminder.sh` hook parses this with bash (grep + sed, not jq) to extract `project_type` — supporting both single value (`project_type: meta`) and list form (`project_type:\n  - unreal\n  - data-science`). This is well-commented but fragile compared to a proper YAML parser.

### Agent Communication

superpowers: agents are one-shot subagents dispatched by the main session. No cross-agent communication.

coordinator-claude: Agent Teams (`TeamCreate`/`SendMessage`/shared `TaskList`) enable multi-agent communication. The staff session protocol ([`pipelines/staff-session/team-protocol.md`](X:/coordinator-claude/plugins/coordinator/pipelines/staff-session/team-protocol.md)) defines a full debate protocol: POSITION / CHALLENGE / CONCESSION / QUESTION / DONE message categories, volume governance (max 4 messages/peer, 12 total), self-governance timing (floor/diminishing-returns/ceiling), convergence protocol. This is sophisticated multi-agent coordination.

---

## 4. Quality & Polish

### superpowers

**Code quality:** Very high for its scope. The `session-start` hook is well-written bash with inline documentation, platform detection, and proper escaping. The brainstorming server scripts (`server.cjs`, `helper.js`) are functional Node.js but lightly commented.

**Documentation:** The README is well-written and accurately describes the system. The CHANGELOG is maintained. The PR template is detailed (multiple specific sections, "94% rejection rate" warning). The contributor guidelines are exceptional — reading them, you immediately understand the project's philosophy and what kinds of PRs will be rejected.

**Skill quality:** The core skills (brainstorming, systematic-debugging, writing-skills) are remarkably thorough. The `writing-skills` skill is ~650 lines and is itself a masterclass in the methodology it teaches. The rationalization tables in `systematic-debugging` are particularly good.

**Test coverage:** Limited. The `docs/testing.md` describes manual pressure-testing methodology for skills, but there are no automated tests for skills or hooks.

**User experience:** Zero-config, works on 6 platforms. The visual brainstorming companion is the highest-friction feature but consent-gated ("Want to try it?") and optional. The onboarding story is clean: install the plugin, skills activate automatically.

**Areas of concern:**
- The brainstorming visual server requires running a local HTTP server, which is opaque to users and increases surface area
- No explicit error handling if the `session-start` hook fails — it exits 0 regardless, so failures are silent
- The `skills/brainstorming/SKILL.md` hardcodes a spec save path (`docs/superpowers/specs/`) which is superpowers-project-specific — contributors who don't notice this will get a confusing spec location

### coordinator-claude

**Code quality:** High for hook scripts. The `context-pressure-advisory.sh` is the most complex hook (~200 lines) and is well-structured with phased logic, cross-platform stat calls, model detection, and autonomous-run awareness. The `remember` plugin's `pipeline.js` is clean Node.js with atomic writes (write-to-daily-then-clear-current pattern for data safety) and proper cooldown management.

**Documentation:** Exceptional. The README has research citations for key design decisions (personas, multi-agent review, handoff artifacts vs. compaction). The `ARCHITECTURE.md` is a 80+ line conceptual guide. The `em-operating-model.md` is a 75-line philosophy document with Star Trek references and concrete escalation tiers. The routing table documentation is thorough.

**Skill quality:** Skills are generally strong and where forked from superpowers are on-par. The coordinator-specific additions (stuck-detection, skill-discovery, handoff-archival, tracker-maintenance) are well-written. The `stuck-detection` skill has 5 distinct patterns (repetition, oscillation, analysis paralysis, post-compaction, anti-repetition) with clear recovery instructions.

**Agent profile quality:** Very high. Patrik's profile defines exact output format, severity values, field names, coverage declaration structure, backstop protocol, LSP usage, docs-checker integration. This level of specification is what makes the review system reliable.

**Test coverage:** The `remember` plugin has unit tests (`tests/extract.test.js`, `tests/haiku.test.js`, `tests/paths.test.js`). Hooks are not unit tested. Skills follow the same manual pressure-testing methodology as superpowers.

**User experience:** Higher setup friction than superpowers. Requires `bash setup/install.sh`, understanding of the multi-plugin system, and per-project `coordinator.local.md` configuration. The capability surface is larger but the learning curve is steeper.

**Areas of concern:**
- The `coordinator-reminder.sh` YAML parser is bash-only and potentially fragile for multi-value `project_type` lists with unusual whitespace
- The context pressure advisory uses file size as a proxy for token count — this is inherently imprecise and the inline comment acknowledges it ("rough proxy")
- Many capabilities are coordinator-meta-project-specific (the `has_type "meta"` path in `coordinator-reminder.sh`) and would confuse users who don't run the coordinator on its own infrastructure

---

## 5. What coordinator-claude Could Learn From superpowers

### 5a. Visual Brainstorming Companion (High Impact)

superpowers' visual companion ([`skills/brainstorming/scripts/server.cjs`](E:/dev/research/meta/superpowers/skills/brainstorming/scripts/server.cjs), [`skills/brainstorming/visual-companion.md`](E:/dev/research/meta/superpowers/skills/brainstorming/visual-companion.md)) is a genuinely novel feature with no coordinator-claude equivalent. It serves SVG mockups/diagrams in a local browser during brainstorming — gated behind explicit consent ("Want to try it?") and limited to questions where visuals add value. coordinator-claude's brainstorming skill is purely textual. The visual companion could be added as an optional extension without disrupting the existing flow.

### 5b. Cross-Platform Support Documentation

superpowers' `using-superpowers/references/` directory contains platform-specific tool name mappings: `copilot-tools.md`, `codex-tools.md`, `gemini-tools.md`. coordinator-claude has no cross-platform documentation. If coordinator-claude users wanted to run on Copilot CLI or Gemini CLI, they'd have no guidance. This is low-effort to add and would meaningfully expand the potential user base.

### 5c. The "CSO" Description Discipline

superpowers' writing-skills skill documents a critical insight: skill descriptions that summarize workflow cause Claude to shortcut the skill body. The discovery was empirical (described in `writing-skills/SKILL.md` lines 153-159): a description saying "code review between tasks" caused Claude to do ONE review, while a description saying "Use when executing implementation plans with independent tasks" caused Claude to correctly read the flowchart and follow the two-stage process.

coordinator-claude's skill descriptions are generally good but some verge on workflow summaries. For example, the `systematic-debugging` description says "Triggers on: 'something is broken', 'test is failing'..." — this is good (symptom-based). But other skills could be audited against this principle.

### 5d. Rationalization Preemption in Hooks

superpowers' `using-superpowers` skill has a compact "Red Flags" table that trains Claude not to rationalize around skill invocation. coordinator-claude's hooks emit similar reminders but via `additionalContext` injections at session start, not as searchable skill content. The superpowers approach — putting the rationalization table in the `using-superpowers` skill rather than a hook — means it's loaded once on session start and can be referenced/updated via skill metadata, rather than being hardcoded in a bash script.

### 5e. PR Template and Contributor Guidelines Quality

superpowers' `.github/PULL_REQUEST_TEMPLATE.md` and `CLAUDE.md` contributor guidelines are exceptionally well-crafted. The "94% rejection rate" framing, the explicit list of rejection reasons, and the agent-specific guidance ("Your job is to protect your human partner from that outcome") are unusually effective. coordinator-claude's `CONTRIBUTING.md` is more conventional.

### 5f. Zero-Dependency Commitment

superpowers ships with zero required dependencies. coordinator-claude's `remember` plugin requires Node.js. While Node is ubiquitous, the commitment to zero dependencies is a real UX advantage — superpowers works on any platform with bash and git. coordinator-claude could adopt a "zero mandatory dependencies" rule for the coordinator core, keeping Node-dependent features isolated to optional plugins.

---

## 6. What coordinator-claude Does Better (for Balance)

### 6a. Hooks as Behavioral Guardrails

The coordinator's 8-hook system enforces workflow discipline at the tool level — the `validate-commit.sh` pre-hook fires before every Bash call and can block git operations on main; the `plan-persistence-check.sh` fires after `ExitPlanMode` to verify plan artifacts were written. superpowers has one hook (SessionStart). This is a real gap: superpowers can guide behavior through skill content, but it cannot block specific tool calls.

### 6b. Formal Review Output Structure

Patrik's JSON output format (typed severity strings, mandatory field names, coverage declaration) makes review outputs machine-parseable and enables the `review-integrator` agent to apply findings systematically. superpowers' generic code-reviewer emits free-form prose. For a team using coordinator-claude, Patrik's REQUIRES_CHANGES verdict is actionable in a way that "Category: Important" in prose is not.

### 6c. Session State Persistence

The handoff system's cascade obligations (unresolved items carry forward until completed or PM-dismissed), anti-amnesia chain (each handoff opens with a synthesis of its predecessor), and git-tracked artifact model solve a real problem: long-running work across sessions. superpowers has no equivalent — context pressure is unmanaged.

### 6d. Research Pipeline Depth

The 4-pipeline research system with Haiku scouts → Sonnet specialists (with adversarial messaging) → Opus synthesis is well-designed. Pipeline B (`/deep-research repo`) supports `--deeper` and `--deepest` modes (dependency-weighted repomap, architecture atlas). This is sophisticated multi-agent infrastructure with no superpowers equivalent.

### 6e. Domain Specialization Router

The routing table system — where domain plugins register via `routing.md` fragments merged at dispatch time — is a clean extension interface. Adding a new domain (e.g., `mobile-dev`) is a matter of creating a plugin directory with `routing.md`, `agents/*.md`, and optionally `skills/`. superpowers has no extensibility mechanism beyond "add skills to ~/.claude/skills/".

---

## 7. Open Questions and Uncertainties

Several areas I could not fully assess from file inspection alone:

- **superpowers brainstorming server reliability:** The visual companion requires a running Node.js server. I did not trace the full server lifecycle to assess whether it handles crashes, port conflicts, or multiple concurrent sessions gracefully.

- **coordinator-claude's `project-orientation.sh` content:** I read `coordinator-reminder.sh` and `context-pressure-advisory.sh` but not `project-orientation.sh`. This is likely the hook that loads project context (tracker, handoffs, git state) — a significant part of the session startup story.

- **Remember plugin's Haiku API call:** `remember/lib/haiku.js` calls the Claude API directly to compress session logs. I did not trace the API key management, error handling, or cost implications. This is a dependency that coordinator-claude users need to understand.

- **superpowers' skill invocation enforcement rate:** The `using-superpowers` skill uses strong language ("1% chance... YOU ABSOLUTELY MUST invoke the skill") but I have not seen eval data on how reliably this is followed. The coordinator-claude README cites research for several design decisions; superpowers does not.

- **Routing merge algorithm correctness:** The coordinator's routing discovery "scans all enabled plugins for root-level `routing.md` files" — but I did not trace the `/review-dispatch` command implementation to verify this merge is actually implemented, or whether it's aspirational documentation. (The routing.md itself notes: "Implementation: /review-dispatch command.")

---

## 8. Summary Table

| Dimension | superpowers | coordinator-claude |
|---|---|---|
| **Primary audience** | Individual developers, broad adoption | Power user / professional PM+EM partnership |
| **Complexity** | Low (one plugin, one hook) | High (7 plugins, 22+ agents, 25 skills, 8 hooks) |
| **Setup friction** | Near zero | Moderate (install.sh, coordinator.local.md) |
| **Platform support** | 6 platforms | Claude Code (primarily) |
| **Dependencies** | None | Node.js (remember plugin) |
| **Core skills quality** | Excellent | Excellent (forked + extended) |
| **Agent review depth** | Generic | Deep (6 named reviewers, typed output) |
| **Session lifecycle** | Not managed | Fully managed |
| **Context pressure** | Not managed | Fully managed |
| **Research pipelines** | None | 4 pipelines (internet, repo, structured, NotebookLM) |
| **Extensibility** | Fork/personal skills | Plugin routing table fragments |
| **Stars / adoption** | 131k | Private/professional |
| **Visual tools** | Yes (brainstorming companion) | No |
| **Research-backed design** | No citations | Multiple research docs |

---

## Conclusion

These two systems represent different points on the complexity-accessibility tradeoff. superpowers wins on accessibility, platform breadth, and zero-friction installation. Its brainstorming skill (with visual companion) and skill-writing methodology are the strongest features in their class.

coordinator-claude wins on structural enforcement depth — the hook system, named reviewer profiles, session lifecycle management, and research pipelines address problems that superpowers doesn't attempt to solve. The context pressure management system is particularly sophisticated and addresses a genuine pain point in long-running Claude Code sessions.

The most actionable insight for coordinator-claude: the visual brainstorming companion and cross-platform tool reference tables are worth adopting, and the CSO description discipline should be audited across all existing skill descriptions. The most actionable insight for superpowers: the PostToolUse hook for plan persistence enforcement and the pre-commit validation hook are behavioral guardrails that could meaningfully reduce the workflow violations the skills currently try to prevent through prose alone.
