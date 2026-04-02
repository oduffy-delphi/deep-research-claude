# Architecture Atlas — File Index
**Repository:** superpowers (obra/superpowers)
**Generated:** 2026-04-02
**Run ID:** 2026-04-02-12h01
**Total files:** 62

---

## System A — Workflow Skills

| File | Lines | Purpose |
|------|-------|---------|
| `skills/brainstorming/SKILL.md` | 165 | Gate-based collaborative design; HARD-GATE before implementation |
| `skills/brainstorming/spec-document-reviewer-prompt.md` | 50 | Subagent template for deep spec review |
| `skills/brainstorming/visual-companion.md` | 100+ | Guide for browser-based visual brainstorming companion |
| `skills/brainstorming/scripts/start-server.sh` | — | Launch brainstorm server with persistence |
| `skills/brainstorming/scripts/stop-server.sh` | — | Reliable server shutdown |
| `skills/brainstorming/scripts/server.cjs` | — | Zero-dependency WebSocket/HTTP server (Node.js, no Express/Chokidar/ws) |
| `skills/writing-plans/SKILL.md` | 153 | Blueprint construction with zero-placeholder guarantee |
| `skills/executing-plans/SKILL.md` | 71 | Minimal sequential plan executor for separate session execution |
| `skills/subagent-driven-development/SKILL.md` | 278 | Controller-executor pattern with two-stage review gates per task |
| `skills/subagent-driven-development/implementer-prompt.md` | — | Full implementer subagent prompt template |
| `skills/subagent-driven-development/spec-reviewer-prompt.md` | — | Adversarial spec compliance reviewer prompt |
| `skills/subagent-driven-development/code-quality-reviewer-prompt.md` | — | Code quality reviewer prompt |
| `skills/test-driven-development/SKILL.md` | 371 | Ritual red-green-refactor enforcement with rationalization resistance |
| `skills/test-driven-development/testing-anti-patterns.md` | — | Mocking anti-patterns reference |

---

## System B — Operational Skills

| File | Lines | Purpose |
|------|-------|---------|
| `skills/systematic-debugging/SKILL.md` | 296 | 4-phase gate system; Iron Law: no fixes without root cause |
| `skills/systematic-debugging/root-cause-tracing.md` | — | Backward data tracing technique supplement |
| `skills/systematic-debugging/defense-in-depth.md` | — | Multi-layer debugging supplement |
| `skills/systematic-debugging/condition-based-waiting.md` | — | Async condition waiting supplement |
| `skills/systematic-debugging/test-academic.md` | — | Academic test debugging supplement |
| `skills/systematic-debugging/test-pressure-1.md` | — | Pressure test scenario 1 |
| `skills/systematic-debugging/test-pressure-2.md` | — | Pressure test scenario 2 |
| `skills/systematic-debugging/test-pressure-3.md` | — | Pressure test scenario 3 |
| `skills/systematic-debugging/CREATION-LOG.md` | — | Creation-time pressure testing documentation |
| `skills/using-git-worktrees/SKILL.md` | 218 | Isolated workspace creation with gitignore safety gate |
| `skills/using-superpowers/SKILL.md` | 117 | Mandatory pre-cognition interrupt; fires before ANY response |
| `skills/using-superpowers/references/copilot-tools.md` | — | Copilot CLI tool name mappings |
| `skills/using-superpowers/references/codex-tools.md` | — | Codex tool name mappings |
| `skills/using-superpowers/references/gemini-tools.md` | — | Gemini CLI tool name mappings (auto-loaded) |
| `skills/writing-skills/SKILL.md` | 655 | TDD-as-documentation process for creating new skills |
| `skills/writing-skills/anthropic-best-practices.md` | — | Official Anthropic skill guidelines reference |
| `skills/writing-skills/testing-skills-with-subagents.md` | — | How to pressure-test skills with subagents |
| `skills/writing-skills/persuasion-principles.md` | — | Technique for skill effectiveness |
| `skills/writing-skills/examples/CLAUDE_MD_TESTING.md` | — | Example skill testing |
| `skills/verification-before-completion/SKILL.md` | 139 | Evidence-before-claims gate; Iron Law before any success claim |
| `skills/finishing-a-development-branch/SKILL.md` | 200 | 4-option structured branch integration with worktree cleanup |
| `skills/receiving-code-review/SKILL.md` | 213 | Anti-performative review reception; YAGNI check |
| `skills/requesting-code-review/SKILL.md` | 105 | Isolated subagent review dispatch with BASE_SHA/HEAD_SHA |
| `skills/dispatching-parallel-agents/SKILL.md` | 182 | Parallelism decision logic: independent domains only |

---

## System C — Infrastructure & Platform

| File | Lines | Purpose |
|------|-------|---------|
| `package.json` | 6 | Node.js package manifest; entry point = `.opencode/plugins/superpowers.js` |
| `CLAUDE.md` | 85 | Contributor governance; 94% PR rejection rate; anti-slop firewall |
| `AGENTS.md` | 1 | Agent index stub/placeholder |
| `GEMINI.md` | — | Gemini CLI context file with `@` includes for passive bootstrap |
| `gemini-extension.json` | — | Gemini CLI extension registration |
| `.claude-plugin/plugin.json` | 20 | Claude Code marketplace plugin manifest (v5.0.7) |
| `.claude-plugin/marketplace.json` | 19 | Development marketplace metadata |
| `.cursor-plugin/plugin.json` | 25 | Cursor IDE plugin manifest; maps skills/, agents/, commands/, hooks/ |
| `.opencode/plugins/superpowers.js` | 113 | OpenCode platform adapter; injects bootstrap via chat message transform |
| `.opencode/INSTALL.md` | — | OpenCode installation instructions |
| `.codex/INSTALL.md` | — | Codex CLI installation instructions |
| `hooks/hooks.json` | 16 | Platform-neutral SessionStart hook config (Claude Code + Copilot) |
| `hooks/hooks-cursor.json` | — | Cursor-specific SessionStart hook config (camelCase schema variant) |
| `hooks/session-start` | — | Canonical session-start script; platform-branching via env vars |
| `hooks/run-hook.cmd` | — | bash/cmd polyglot wrapper for Windows compatibility |
| `agents/code-reviewer.md` | 49 | Code reviewer agent definition; model: inherit, no tool restrictions |
| `commands/brainstorm.md` | 6 | Deprecated command stub → brainstorming skill |
| `commands/write-plan.md` | 6 | Deprecated command stub → writing-plans skill |
| `commands/execute-plan.md` | 6 | Deprecated command stub → executing-plans skill |
| `.version-bump.json` | — | Coordinates version numbers across all platform manifests |
| `.github/FUNDING.yml` | — | Sponsorship metadata |
| `.github/PULL_REQUEST_TEMPLATE.md` | — | PR checklist (referenced by CLAUDE.md) |
| `.github/ISSUE_TEMPLATE/` | — | Bug, feature, platform support, configuration templates |

---

## System D — Docs, Tests & Releases

| File | Lines | Purpose |
|------|-------|---------|
| `README.md` | 100+ | Main project docs; 7-platform installation matrix; workflow overview |
| `RELEASE-NOTES.md` | 100+ | Versioned release history v4.3.1–v5.0.7 |
| `CHANGELOG.md` | 14+ | Detailed change log (v5.0.5 partial) |
| `CODE_OF_CONDUCT.md` | 100+ | Contributor Covenant v2.0 |
| `docs/testing.md` | 60 | Testing methodology guide; integration test approach |
| `docs/README.codex.md` | 60 | Codex CLI installation and usage guide |
| `docs/README.opencode.md` | 60 | OpenCode installation and usage guide |
| `docs/windows/polyglot-hooks.md` | — | Windows-specific hook troubleshooting |
| `docs/superpowers/specs/2026-03-23-codex-app-compatibility-design.md` | 80 | Codex App worktree adaptation design spec |
| `docs/superpowers/specs/2026-03-11-zero-dep-brainstorm-server-design.md` | — | Zero-dependency server design spec |
| `docs/superpowers/specs/2026-02-19-visual-brainstorming-refactor-design.md` | — | Visual brainstorming workflow redesign spec |
| `docs/superpowers/specs/2026-01-22-document-review-system-design.md` | — | Code review document design spec |
| `docs/superpowers/plans/2026-03-23-codex-app-compatibility.md` | — | Implementation plan for Codex App worktree adaptation |
| `docs/superpowers/plans/2026-03-11-zero-dep-brainstorm-server.md` | — | Implementation plan for zero-dep server |
| `docs/superpowers/plans/2026-02-19-visual-brainstorming-refactor.md` | — | Implementation plan for visual brainstorming refactor |
| `docs/superpowers/plans/2026-01-22-document-review-system.md` | — | Implementation plan for document review system |
| `tests/claude-code/test-helpers.sh` | — | Shared test utilities (run_claude, assert_contains, assert_count) |
| `tests/claude-code/test-subagent-driven-development-integration.sh` | — | Integration test for SDD skill (headless Claude sessions) |
| `tests/claude-code/analyze-token-usage.py` | — | Token consumption analysis tool |
| `tests/claude-code/run-skill-tests.sh` | — | Test runner for Claude Code skill tests |
| `tests/claude-code/README.md` | — | Test documentation |
| `tests/brainstorm-server/server.test.js` | 80 | Node.js integration tests for brainstorm HTTP/WS server |
| `tests/brainstorm-server/ws-protocol.test.js` | — | WebSocket protocol unit tests (RFC 6455) |
| `tests/brainstorm-server/windows-lifecycle.test.sh` | — | Windows-specific PID lifecycle tests |
| `tests/brainstorm-server/package.json` | — | Test dependencies (ws) |
| `tests/brainstorm-server/package-lock.json` | — | Locked test dependency versions |
| `tests/opencode/run-tests.sh` | — | OpenCode plugin test suite runner |
| `tests/opencode/test-plugin-loading.sh` | — | Plugin structure/symlink/JS syntax validation |
| `tests/skill-triggering/run-test.sh` | — | Naive-prompt → skill-trigger verification tests |
| `tests/explicit-skill-requests/run-all.sh` | — | Explicit invocation pattern tests (4 patterns) |
