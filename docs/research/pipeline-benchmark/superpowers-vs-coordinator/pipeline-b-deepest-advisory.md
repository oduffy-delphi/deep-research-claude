# Advisory: superpowers as a Design Reference

> **Date:** 2026-04-02 | **Context:** Pipeline B --deepest assessment of obra/superpowers v5.0.7

## The Core Insight Worth Carrying Forward

superpowers' most important contribution is not any individual skill -- it's the discovery that **agent compliance degrades predictably under pressure, and that degradation can be modeled and preempted.**

The Iron Law architecture (absolute prohibition + rationalization table + red flags + spirit-over-letter clause) is not prompt engineering. It's a behavioral security model. The rationalization tables are not documentation -- they're threat models for motivated reasoning. The red flags are not guidelines -- they're intrusion detection signatures. The spirit-over-letter clause is not emphasis -- it's a patch for the specific failure mode where agents find technical compliance paths that violate intent.

This framing -- agent-as-system-to-be-hardened rather than agent-as-reader-of-instructions -- is the philosophical contribution that coordinator-claude should internalize, regardless of how many specific skills are ported.

## The Brainstorming Gap Is Bigger Than It Looks

The absence of a brainstorming/design gate in coordinator-claude is not a missing feature -- it's a missing phase in the development lifecycle. Every other phase has coverage: planning (writing-plans), execution (delegate-execution, execute-plan), review (review-dispatch, code-health), verification (verification-before-completion). But the ideation-to-specification phase is a void.

In practice, this means: the PM must arrive with a specification, or the EM must improvise one. The writing-plans skill's scope check ("is this over-scoped?") partially compensates, but it fires after the decision to plan has been made. superpowers' HARD-GATE fires before any implementation consideration begins. The difference is temporal: gate-before-planning vs. check-during-planning.

For coordinator-claude's open-source audience (who may not be experienced PMs), this gap is material. A brainstorming skill would serve as the on-ramp that converts "I want to build X" into a specification that writing-plans can consume.

## The Testing Question

superpowers' headless-session behavioral tests are the right idea executed at significant cost ($4.67/run, 10-30 minutes). coordinator-claude's structural validators are the complementary approach: cheap, fast, CI-integrated, but blind to behavioral regression.

The pragmatic path for coordinator-claude is not to replicate superpowers' full behavioral test suite. It's to identify the 3-5 behavioral invariants that, if violated, would cause the most user harm -- and test only those. Candidates:

1. **Session-start injects expected coordinator context** (if this breaks, every session is degraded)
2. **Writing-plans produces a plan with write-ahead status field** (if this breaks, crash recovery fails)
3. **Delegate-execution respects the 3-attempt budget** (if this breaks, infinite loops)
4. **Review-dispatch routes to a real reviewer** (if this breaks, reviews are skipped)

Four tests. Run weekly or before release. Total cost: ~$20/run. That's the minimum viable behavioral safety net.

## A Note on Convergent Evolution

Several patterns appear independently in both projects:

- **Plan-as-cold-start-artifact** (plan header carries execution instructions)
- **Adversarial review posture** ("Do Not Trust the Report")
- **Anti-performative code review** (forbid "You're absolutely right!")
- **Evidence-over-intuition** in feature decisions

This convergence suggests these patterns are not idiosyncratic preferences but structural necessities for agent orchestration at scale. When two independent projects arrive at the same solutions, the solutions are likely load-bearing. coordinator-claude should treat these shared patterns as validated primitives, not coincidences.
