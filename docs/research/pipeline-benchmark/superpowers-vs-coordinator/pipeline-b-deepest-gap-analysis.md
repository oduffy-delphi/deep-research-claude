# coordinator-claude vs superpowers -- Gap Analysis

> **Reference version:** superpowers v5.0.7 | **Comparison:** coordinator-claude v1.2.1 | **Date:** 2026-04-02

## Executive Summary

coordinator-claude is a functional superset of superpowers' skill library, with deeper workflow enforcement (write-ahead crash recovery, re-dispatch budgets, CI pipeline) and a richer agent ecosystem (7 specialized agents vs. 1). However, superpowers leads in three areas that coordinator-claude should adopt: (1) the brainstorming/design gate that prevents under-specified plans from entering execution, (2) behavioral testing via headless session transcripts, and (3) contributor governance hardened against agent-generated PRs.

The gap analysis identifies 3 bug-level fixes, 5 high-impact improvements, 4 fidelity items, and 3 strategic capabilities. The highest-impact single item is adopting superpowers' HARD-GATE brainstorming pattern -- coordinator-claude currently has no upstream design phase, meaning under-specified plans can enter the writing-plans -> execution pipeline without structured requirements elicitation.

## Tier 0: Bug Fixes (Do Now)

### 0.1 CLAUDE.md Is an Unfilled Template
**Source:** Chunk C comparison (`C-comparison.md` Section 4)
**Finding:** coordinator-claude's `CLAUDE.md` contains `{YOUR_NAME}` placeholder text. For an open-source release candidate, this is a contributor-facing document that currently communicates "not ready."
**Action:** Fill the template with coordinator-claude-specific contributor guidance. Adopt superpowers' anti-slop posture: state PR expectations, require eval evidence for skill modifications, define project voice.
**Confidence:** High -- mechanical fix, no design decision required.

### 0.2 Missing CODE_OF_CONDUCT
**Source:** Chunk D comparison (`D-comparison.md` Section 4)
**Finding:** coordinator-claude has no CODE_OF_CONDUCT.md. Standard open-source community norm; superpowers includes Contributor Covenant v2.0.
**Action:** Add CODE_OF_CONDUCT.md (Contributor Covenant v2.0 or equivalent).
**Confidence:** High -- standard practice, no design decision.

### 0.3 Ghost Caller References in Skills
**Source:** Chunk B comparison (`B-comparison.md` Section 3)
**Finding:** Patrik review comments in coordinator-claude skills reference "removed ghost callers" -- skills that list callers which don't actually invoke them. If any ghost caller references remain in coordinator-claude skills, they create false documentation.
**Action:** Audit all skill `Callers:` sections against actual invocation paths. Remove stale references.
**Confidence:** High -- requires grep audit, no design change.

## Tier 1: High-Impact (This Sprint)

### 1.1 Add Brainstorming / Design Gate Skill
**Source:** Chunk A comparison (`A-comparison.md` Section 1)
**Finding:** coordinator-claude has no upstream design phase. The writing-plans skill assumes a spec exists. superpowers' brainstorming skill provides: 9-step requirements elicitation, HARD-GATE preventing implementation before design approval, visual companion for mockups, spec self-review + optional subagent review.
**Gap:** Users arriving with vague ideas must self-decompose into specs. No structural mechanism prevents under-specified plans from entering execution.
**Action:** Port or adapt superpowers' brainstorming skill. Key elements to preserve: HARD-GATE, one-question-at-a-time discipline, spec output to committed file, terminal state = writing-plans only. The visual companion is optional but adds significant value for UI-heavy projects.
**Confidence:** High -- the skill is well-proven in superpowers (165 lines, architecturally clean). Adaptation needed: `docs/superpowers/specs/` -> `docs/specs/`, "human partner" -> "PM", skill references to coordinator namespace.

### 1.2 Add Background-Dispatch Default for Long Agents
**Source:** Chunk B comparison (`B-comparison.md` Section 5)
**Finding:** coordinator-claude's `dispatching-parallel-agents` adds guidance on background dispatch and worktree decisions that superpowers lacks. However, coordinator-claude should verify this guidance is consistently applied.
**Gap in reverse direction:** superpowers' `dispatching-parallel-agents` lacks the `run_in_background: true` default for agents >2 minutes and the worktree decision logic. For coordinator-claude, verify the guidance exists and is referenced by skills that dispatch agents (delegate-execution, staff-session).
**Action:** Audit coordinator-claude's agent-dispatching skills to confirm they reference the background-dispatch rule. If any dispatch path skips it, add the reference.
**Confidence:** Medium -- the rule exists in coordinator-claude but may not be consistently applied across all dispatch paths.

### 1.3 Add Behavioral Testing Layer
**Source:** Chunk D comparison (`D-comparison.md` Sections 1, 2, 5)
**Finding:** coordinator-claude has 10 structural validators but zero behavioral tests. superpowers tests actual LLM behavior via headless `claude -p` sessions parsing `.jsonl` transcripts. Neither project has broad behavioral coverage, but superpowers' approach is proven for SDD and skill triggering.
**Action:** Implement a minimal behavioral test suite for coordinator-claude's most critical skills. Start with: (1) session-start hook fires and injects expected content, (2) a writing-plans invocation produces a plan with required fields, (3) a delegate-execution run completes with write-ahead status updates. Use superpowers' `docs/testing.md` as methodology reference.
**Confidence:** Medium -- the approach is proven but expensive (~$4.67/run, 10-30 min). Start with 2-3 high-value tests, not comprehensive coverage.

### 1.4 Adopt Anti-Slop Contributor Governance
**Source:** Chunk C comparison (`C-comparison.md` Section 4)
**Finding:** superpowers' CLAUDE.md treats external AI agents as a threat vector with a 94% PR rejection rate, mandatory human diff review, and explicit anti-slop posture. coordinator-claude's CONTRIBUTING.md is generic open-source boilerplate with no agent-specific guidance.
**Action:** Revise CONTRIBUTING.md and populate CLAUDE.md with: PR expectations (eval data required for skill changes), skill modification rules (behavior-shaping code, not prose), anti-slop patterns to reject, and explicit human review requirement.
**Confidence:** High -- this is a documentation/policy change, not a code change.

### 1.5 Add Version Management Across Plugins
**Source:** Chunk C comparison (`C-comparison.md` Section 5)
**Finding:** superpowers uses `.version-bump.json` to coordinate versions across 5 platform manifests. coordinator-claude has 6 plugins with individual version fields and no synchronization mechanism.
**Action:** Implement a version coordination mechanism (`.version-bump.json` equivalent or unified manifest). As a multi-plugin system where plugins may be installed independently, version drift is a real risk.
**Confidence:** Medium -- requires choosing between per-plugin versioning (current) and coordinated versioning (superpowers pattern). The multi-plugin architecture may warrant independent versioning with a compatibility matrix rather than lockstep.

## Tier 2: Fidelity (Planned)

### 2.1 Add HARD-GATE Pattern to Existing Skills
**Source:** Chunk A assessment (`A-assessment.md` Section 1), Chunk B assessment (`B-assessment.md` Area 2)
**Finding:** superpowers' named `<HARD-GATE>` pattern is a reusable design primitive. coordinator-claude's skills use implicit gates (plan review gate, verification gate) but don't name them as a formal pattern.
**Action:** Consider formalizing the HARD-GATE as a named pattern in coordinator-claude's skill-writing guide. Existing gates (plan review before execution, verification before completion) could be explicitly tagged for consistency and auditability.
**Confidence:** Low-Medium -- this is a naming/documentation change with unclear behavioral benefit. The implicit gates already work.

### 2.2 Port Evidence-Driven Reversion Practice
**Source:** Chunk D comparison (`D-comparison.md` Section 3)
**Finding:** superpowers v5.0.6 documents regression testing across 5 versions x 5 trials before removing the subagent review loop. coordinator-claude's changes appear PM-driven without equivalent data validation.
**Action:** For the next significant feature removal or behavioral change in coordinator-claude, run a before/after comparison (e.g., the handoff-vs-compaction experiment pattern already exists in the experiments repo). Document the evidence in CHANGELOG.md.
**Confidence:** Medium -- this is a practice adoption, not a code change. The infrastructure for running experiments already exists.

### 2.3 Add Rationalization Resistance to Key Skills
**Source:** Chunk B assessment (`B-assessment.md` Area 2)
**Finding:** superpowers' rationalization tables are the primary mechanism for behavior shaping. coordinator-claude skills generally state rules without anticipating evasion patterns.
**Action:** For coordinator-claude's highest-pressure skills (delegate-execution, execute-plan, verification-before-completion), add rationalization resistance tables modeled on superpowers' pattern. Focus on the 3-5 most common evasion patterns per skill.
**Confidence:** Medium -- the pattern is proven in superpowers, but coordinator-claude's user model (experienced PM/EM pair) may have different evasion patterns than superpowers' general audience.

### 2.4 Separate PR Creation from Merge in finishing-a-development-branch
**Source:** Chunk B comparison (`B-comparison.md` Section 4)
**Finding:** coordinator-claude correctly separates "create PR" (Option 2) from "merge via PR" (Option 1, invokes merging-to-main). Verify this separation is maintained and that Option 1 always goes through CI-gated merging-to-main, never bare local merge.
**Action:** Audit finishing-a-development-branch to confirm Option 1 invokes merging-to-main. If any code path allows bare local merge to main, add the CI gate.
**Confidence:** High -- this is a verification task. coordinator-claude likely already handles this correctly based on specialist findings.

## Tier 3: Strategic (Requires Planning)

### 3.1 Consider Multi-Platform Support
**Source:** Chunk C comparison (`C-comparison.md` Section 1)
**Finding:** superpowers supports 7 platforms; coordinator-claude supports only Claude Code. superpowers' platform adapter pattern (same content, different delivery mechanisms) makes adding platforms mechanical.
**Action:** Evaluate whether coordinator-claude's target audience includes Cursor, OpenCode, or Gemini users. If yes, superpowers' adapter pattern provides a proven implementation reference. Key constraint: coordinator-claude relies on Claude Code-specific APIs (Agent Teams, TaskList, Skill tool) that don't exist on other platforms, so the adaptation would require graceful degradation or feature gating.
**Confidence:** Low -- this is a strategic scope decision, not a technical gap. The Claude Code dependency is deep.

### 3.2 Creation-Time Pressure Testing for Skills
**Source:** Chunk D assessment (`D-assessment.md` Section 3, updated finding)
**Finding:** superpowers' `CREATION-LOG.md` pattern documents pressure-scenario tests run at skill creation time: time pressure + obvious quick fix, complex system + uncertainty, failed first fix. Only one CREATION-LOG exists (systematic-debugging), but the pattern is valuable.
**Action:** When creating new coordinator-claude skills, adopt the creation-time pressure testing pattern: run the skill against adversarial scenarios before shipping, document results in a CREATION-LOG.md alongside the skill. Integrate with the existing writing-skills skill's requirement for failing tests.
**Confidence:** Medium -- the pattern is sound but the single example in superpowers suggests it's hard to sustain consistently.

### 3.3 Architecture Documentation from Skill Design Rationale
**Source:** Synthesis insight (assessment "Beyond the Brief")
**Finding:** superpowers lacks a dedicated architecture document; coordinator-claude has `architecture.md`. However, superpowers' scattered design rationale (in release notes, CREATION-LOGs, and spec files) contains valuable architectural reasoning that coordinator-claude's architecture.md could learn from.
**Action:** Ensure coordinator-claude's architecture.md documents the "why" behind key design decisions (not just the "what"). Specifically: why the multi-plugin architecture, why heavyweight agents vs. lightweight, why the enrichment pipeline exists, why the specific hook lifecycle coverage.
**Confidence:** Low -- this is a documentation quality improvement, not a gap fix.

## Cross-Cutting Observations

### 1. Complementary Design Philosophies

superpowers and coordinator-claude optimize for different axes:
- **superpowers:** breadth (7 platforms), accessibility (thin agent config, zero dependencies), behavioral hardening (anti-rationalization)
- **coordinator-claude:** depth (rich hook lifecycle, heavyweight specialized agents), workflow enforcement (write-ahead, CI gates, re-dispatch budgets), operational integration (named review agents, enrichment pipeline)

A merged system would take: superpowers' platform adapters, brainstorming skill, behavioral testing, and rationalization resistance patterns; coordinator-claude's hook lifecycle, agent ecosystem, crash recovery, CI pipeline, and write-ahead protocol.

### 2. The Testing Complementarity

`[SYNTHESIS INSIGHT]` Neither project achieves broad test coverage, but they test orthogonal concerns:
- superpowers: "Does the skill actually trigger and produce correct behavior when an LLM runs it?" (behavioral, expensive)
- coordinator-claude: "Is the plugin structurally valid -- correct frontmatter, valid references, consistent schemas?" (structural, cheap)

The combined approach (structural CI + selective behavioral tests) would be stronger than either alone. coordinator-claude should adopt behavioral testing for its 3-5 most critical skills while maintaining its structural validators.

### 3. The Governance Gap Is the Highest-Priority OSS Readiness Issue

For coordinator-claude's open-source release, the unfilled CLAUDE.md template, missing CODE_OF_CONDUCT, and generic CONTRIBUTING.md are the most immediately actionable gaps. superpowers' anti-slop governance is battle-tested against actual agent-generated PRs and provides a direct template.

### 4. Skill Inheritance vs. Skill Evolution

`[SYNTHESIS INSIGHT]` Several coordinator-claude skills are clearly derived from superpowers (TDD is near-identical, systematic-debugging differs only in metric softening, verification-before-completion is identical). The coordinator versions generally add: version frontmatter, coordinator-specific terminology ("PM" vs. "human partner"), and integration with the coordinator ecosystem (named review agents, merging-to-main references). This is healthy evolution -- the core behavioral content is preserved while the integration surface is adapted. Future syncs should follow this pattern: preserve behavioral core, adapt integration points.

### 5. The Iron Law Gap

`[SYNTHESIS INSIGHT]` coordinator-claude's skills generally state rules without the adversarial rationalization resistance that makes superpowers' rules sticky. The Iron Law + rationalization table + red flags + spirit-over-letter pattern is superpowers' most transferable contribution. Even without full porting, adding rationalization tables to coordinator-claude's 3 highest-pressure skills (delegate-execution, execute-plan, verification-before-completion) would materially improve compliance under pressure.

### 6. Review Dispatch Architecture: Tight Naming vs. Dynamic Routing

`[SYNTHESIS INSIGHT]` superpowers' `requesting-code-review` explicitly names `superpowers:code-reviewer` as the dispatch target (`SKILL.md:8-9,33-34`), while `receiving-code-review` is entirely agent-agnostic. This asymmetric coupling is pragmatic for a single-agent system. coordinator-claude's review dispatch uses a named pipeline (`review-dispatch`) that selects agents dynamically from a pool of 7 specialists -- more flexible, more complex. Neither approach is strictly superior: superpowers' explicit naming is simpler and debuggable; coordinator-claude's dynamic routing scales to specialized reviewers (Patrik for architecture, Camelia for data science, etc.) where explicit naming would become an unmaintainable routing table. If superpowers adds specialized reviewers, it will need to evolve toward coordinator-claude's routing pattern.
