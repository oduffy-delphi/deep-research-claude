# Pipeline B Benchmark: superpowers vs coordinator-claude

## Purpose

Triple-duty benchmark comparing research pipeline output quality:
1. **Showcase** — demonstrate Pipeline B depth tiers to coordinator-claude users
2. **Pipeline data** — empirical comparison of solo models vs orchestrated multi-agent research
3. **Competitive intelligence** — learn from superpowers (131k-star best-in-class Claude Code plugin) to improve coordinator-claude

## Target Repository

**superpowers** (obra/superpowers) — v5.0.7
- 137 files, 15.5K LoC (primarily Markdown + Shell)
- Zero-dependency Claude Code plugin providing skills, agents, hooks, and commands
- Flat skill-based architecture: 13 skills that trigger automatically via context matching

## Comparison Repository

**coordinator-claude** — structured agent hierarchy plugin
- Orchestration layer with domain-specific reviewers, research pipelines, workflow skills
- Deeper abstraction: Agent Teams, multi-model dispatch, review personas

## Conditions

| # | Condition | Model(s) | Method | What It Tests |
|---|-----------|----------|--------|---------------|
| 1 | Naked Sonnet | Sonnet 4.6 | `claude --print` with free tool access (Read, Glob, Grep, Bash, Write), no pipeline | Baseline: what does a capable-but-smaller model produce in a single pass? |
| 2 | Naked Opus | Opus 4.6 | `claude --print` with free tool access, no pipeline | Baseline: what does the strongest model produce in a single pass? |
| 3 | Pipeline B `--deepest` | 2 Haiku + 4 Sonnet + 1 Opus | Agent Teams pipeline: scouts → specialists → synthesizer → atlas agent | Full pipeline: does multi-agent orchestration add measurable depth? |

### Shared Research Question

All three conditions receive the same core research question:
> Analyze the superpowers repository and compare it against coordinator-claude. Cover architecture, capabilities, patterns, quality, and what coordinator-claude could learn.

### Fairness Controls

- **Same tool access:** All conditions can Read, Glob, Grep, Bash, Write across both repos
- **Same research question:** Identical core prompt (minor framing differences for pipeline context)
- **No pipeline skills for baselines:** `--disable-slash-commands` prevents baselines from invoking pipeline infrastructure
- **Free exploration:** Baselines choose their own investigation strategy (no prescribed order)

### Known Asymmetries (Documented, Not Eliminated)

- **Context bloat:** Baselines inherit CLAUDE.md and plugin system prompts (~47K tokens of context they don't need). Pipeline agents get purpose-built prompts.
- **Model asymmetry:** Pipeline B uses 3 model tiers (Haiku, Sonnet, Opus) while baselines are single-model. The pipeline's Opus synthesizer sees pre-digested specialist findings; baseline Opus sees raw files.
- **Time budget:** Baselines run until they self-terminate. Pipeline specialists have a 3-10 minute window with 3-file minimum deep-read.

## Metrics

### Primary: Output Quality (Qualitative)

Assessed by the pipeline author (acknowledged limitation — see Limitations). Single-run per condition; this is a qualitative showcase comparison, not a statistical study.

Each condition scored 1-3 on four dimensions:

| Dimension | 1 (Surface) | 2 (Solid) | 3 (Deep) |
|-----------|-------------|-----------|----------|
| **Coverage breadth** | Covers <3 major subsystems | Covers most subsystems, misses some | Covers all major subsystems + cross-cutting concerns |
| **Analytical depth** | Describes structure only | Traces some execution paths, has file references | Traces execution paths with file:line citations, explains *why* not just *what* |
| **Strategic insight** | Generic observations any developer could make | Some non-obvious findings, specific to these repos | Surfaces competitive insights the maintainer didn't already know |
| **Actionable value** | Vague suggestions ("could improve X") | Specific suggestions with file references | Concrete recommendations with implementation paths and priority |

The comparison summary will contextualize cost against output quality to assess whether pipeline overhead is justified.

### Secondary: Resource Efficiency (Quantitative)

| Metric | Baselines | Pipeline B |
|--------|-----------|------------|
| Output document size (bytes) | Direct measurement | Direct measurement |
| Total artifact volume | Single document | Scout inventories + specialist assessments + comparisons + synthesis + gap analysis + atlas |
| Token usage | `--output-format json` on re-run (not captured in this run) | Estimated from transcript length / agent count |
| Wall-clock time | Background task duration | Team creation → synthesizer completion |
| Estimated cost | From JSON usage data or model pricing × estimated tokens | Sum across all 7 agents |

### Token Estimation Approach

For this initial run, exact token counts were not captured (baselines ran without `--output-format json`). Proxies:
- **Output tokens:** Document size ÷ 4 chars/token ≈ output token count
- **Input tokens:** System prompt (~47K) + files read (estimated from document citations) + tool overhead
- **Pipeline agents:** Total scratch directory artifact volume as proxy for aggregate I/O

Future runs should use `--output-format json` for baselines and capture per-agent transcript lengths for pipeline conditions.

## Output Structure

Final deliverable: restructured comparison showing what each depth tier adds.

```
superpowers-vs-coordinator/
├── methodology.md          ← this file
├── baseline-prompt.md      ← shared research question
├── baseline-sonnet.md      ← Condition 1 output
├── baseline-opus.md        ← Condition 2 output
├── pipeline-b-deepest.md   ← Condition 3: synthesized assessment
├── pipeline-b-deepest-gap-analysis.md  ← Condition 3: gap analysis
├── pipeline-b-deepest-advisory.md      ← Condition 3: advisory (if any)
├── pipeline-b-deepest-{atlas files}.md ← Condition 3: architecture atlas
└── comparison-summary.md   ← Cross-condition analysis + depth tier showcase
```

## Limitations

- **N=1 per condition.** This is a single-run qualitative comparison, not a statistical study. Results illustrate pipeline behavior, not statistical significance. The handoff-vs-compaction experiment (same repo) uses 3 reps × 3 conditions for statistical work.
- **Author-assessed.** The pipeline author scores all conditions. No blinding, no independent rater. Findings should be read as an informed but biased perspective.
- **Token capture incomplete.** Baselines ran without `--output-format json`; exact token counts unavailable for this run. Future runs will capture exact usage.
- **Context bloat asymmetry.** Baselines inherit ~47K tokens of irrelevant system prompt that pipeline agents don't. This may slightly disadvantage baselines.

## Date

2026-04-02
