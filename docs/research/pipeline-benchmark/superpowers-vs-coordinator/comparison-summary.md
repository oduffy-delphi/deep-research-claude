# Depth Tier Comparison: Solo Models vs. Pipeline B --deepest

**Date:** 2026-04-02
**Assessor:** Claude Opus 4.6 (fresh evaluation, no prior context on pipeline execution)
**Subject:** Architectural analysis of obra/superpowers vs. coordinator-claude
**Methodology:** See [methodology.md](methodology.md) for rubric, fairness controls, and limitations

---

## 1. Executive Summary

Three conditions analyzed the same codebase pair (superpowers vs. coordinator-claude) with identical research questions but increasing levels of orchestration.

**Condition 1 -- Naked Sonnet** produced a competent feature comparison organized around architecture, capabilities, patterns, and quality. It reads like a well-structured technical blog post: broad coverage, clear tables, specific file references, and a balanced "what each could learn" section. At 30KB, it covers the territory efficiently. Its primary limitation is analytical flatness -- it describes what each system does but rarely explains why a design choice matters or traces execution paths to reveal emergent behavior.

**Condition 2 -- Naked Opus** produced a more architecturally literate analysis at 28KB. It identifies the same features as Sonnet but goes further: it traces the session-start hook through platform detection to JSON output formatting, counts files per plugin, distinguishes behavioral testing from structural validation, and frames the comparison around "skill library vs. orchestration system." It reads like a senior engineer's assessment rather than a feature matrix. Its limitation is that it stays within the frame of direct observation -- it catalogs what exists but doesn't synthesize cross-cutting insights that emerge from combining observations.

**Condition 3 -- Pipeline B --deepest** produced 225KB of artifacts across 8 files: a 22KB synthesized assessment, a 16KB gap analysis, a 4KB advisory document, and a 4-file architecture atlas (file index, system map, connectivity matrix, architecture summary). The synthesis identifies design primitives (the "Iron Law architecture," gate-based workflow progression, cold-start resumption via externalized state) that neither baseline named explicitly. The gap analysis provides a tiered action plan with bug fixes, sprint items, and strategic capabilities -- structured for direct execution rather than further discussion. The atlas provides a structural map of the repository that would take a human architect hours to produce. Its limitation is volume: 225KB demands significant reader investment, and some specialist findings overlap.

---

## 2. Scoring

Scored on the methodology rubric (1 = Surface, 2 = Solid, 3 = Deep) across four dimensions.

### Coverage Breadth

| Condition | Score | Reasoning |
|-----------|-------|-----------|
| Sonnet | 2 | Covers architecture, capabilities (feature table with 22 rows), patterns, quality, and bidirectional "what to learn" sections. Misses the testing infrastructure almost entirely -- no mention of superpowers' 5-layer test methodology or its adversarial prompt tests. Does not cover release history or evidence-driven iteration. |
| Opus | 2.5 | Covers the same ground as Sonnet plus testing (47 test files across 4 categories, noted adversarial prompt testing), CI validation (11 Python scripts), autonomous operation modes, and MCP integration. The only major gap: it doesn't trace the workflow chain as a connected pipeline -- skills are cataloged individually rather than as a directed graph. |
| Pipeline | 3 | Covers all major subsystems organized into four named systems (Workflow Skills, Operational Skills, Infrastructure & Platform, Docs/Tests/Releases). The architecture atlas provides a cross-system connectivity matrix with 26 documented connections and centrality scores. The gap analysis covers subsystems the baselines didn't examine: version management coordination, contributor governance as a security concern, and the absence of crash recovery in plan execution. |

**Key evidence:** The pipeline identified superpowers' `DONE_WITH_CONCERNS` status code as a noteworthy design choice ("an unusually honest status that creates a channel for flagging doubts without blocking progress"). Neither baseline mentioned this. The pipeline also identified the blocking `async: false` session-start hook with no timeout as a reliability concern -- a specific finding at the level of `hooks.json` configuration that requires cross-referencing the hook definition with runtime behavior.

### Analytical Depth

| Condition | Score | Reasoning |
|-----------|-------|-----------|
| Sonnet | 1.5 | Describes structure accurately with file path citations but rarely traces execution. States that the session-start hook "reads the skill file, escapes it for JSON, emits platform-appropriate JSON" but doesn't examine the escaping mechanism, the platform detection logic, or why the hook uses `async: false`. The context-pressure-advisory analysis is the deepest section -- it traces the phased logic, model detection, and cross-compaction bridge -- but this depth is not sustained across the document. |
| Opus | 2 | Traces several execution paths: session-start hook through platform detection and JSON output, OpenCode adapter through chat message transform, the full SDD controller-executor cycle. Provides line-number references (e.g., "hooks/session-start lines 18-55"). Notes that superpowers' OpenCode adapter "ships its own YAML frontmatter parser to maintain zero-dependency integrity" -- a design choice, not just a fact. But it does not synthesize these individual traces into higher-order patterns. |
| Pipeline | 3 | Traces execution paths AND names the design patterns they instantiate. The "Iron Law Architecture" analysis identifies a 4-layer behavioral hardening pattern (Iron Law block, rationalization table, red flags, spirit-over-letter clause) and traces it across all 14 skills with specific line citations (TDD `SKILL.md:258-271` has 11 rationalization entries; systematic-debugging has 13 red flags). The `[SYNTHESIS INSIGHT]` markers throughout the assessment flag where the synthesizer is drawing conclusions that go beyond individual specialist findings -- for example, that the asymmetric skill/agent coupling in review dispatch is "pragmatic for a single-agent system but would not scale to multiple specialized reviewers without becoming a routing table." |

**Key evidence:** Compare how each condition handles the `using-superpowers` meta-skill:
- *Sonnet:* "One SessionStart hook that reads `skills/using-superpowers/SKILL.md` into context on every session start."
- *Opus:* "This skill establishes the behavioral imperative: 'If you think there is even a 1% chance a skill might apply, you ABSOLUTELY MUST invoke the skill.' The hook reads the file, JSON-escapes it, and injects the full content into `additionalContext`."
- *Pipeline:* "The meta-skill fires before ANY response, including clarifying questions, with a 1% applicability threshold. This inverts the natural pattern where agents gather context first and consult references second. The skill effectively gates all agent cognition through a skill-check mechanism, with two priority axes: temporal (process skills before implementation) and intent ('build X' -> brainstorming; 'fix this' -> debugging)."

The progression from description to mechanism to architectural implication is the clearest illustration of the depth tiers.

### Strategic Insight

| Condition | Score | Reasoning |
|-----------|-------|-----------|
| Sonnet | 2 | Identifies the CSO (Claude Search Optimization) finding from superpowers' writing-skills skill -- that descriptions summarizing workflow cause Claude to shortcut the skill body. This is non-obvious and specific. Also correctly identifies the visual brainstorming companion as a genuinely novel feature. However, the "what coordinator-claude could learn" section stays at feature level (port the visual companion, add cross-platform docs) rather than pattern level. |
| Opus | 2 | Frames the comparison as "skill library vs. orchestration system" -- a useful structural insight. Identifies the "your human partner" vs. "the PM" language framing difference and connects it to behavioral incentives. Notes that adversarial skill testing is superpowers' most transferable contribution. But strategic recommendations remain feature-oriented (add platform support, add behavioral tests). |
| Pipeline | 3 | Elevates from features to principles. The advisory document distills the core insight: "agent compliance degrades predictably under pressure, and that degradation can be modeled and preempted." It frames rationalization tables as "threat models for motivated reasoning" and red flags as "intrusion detection signatures" -- a security-model framing that recontextualizes the entire skill library. The gap analysis identifies the brainstorming gap as "not a missing feature but a missing phase in the development lifecycle" -- a structural diagnosis, not a feature request. The synthesis insight that "when two independent projects arrive at the same solutions, the solutions are likely load-bearing" (convergent evolution of anti-performative review, plan-as-cold-start-artifact, evidence-over-intuition) is the kind of meta-observation that informs design philosophy, not just feature planning. |

**Key evidence:** The pipeline's "hardening-vs-trust spectrum" observation -- that superpowers takes "a fundamentally pessimistic view of agent compliance" and places guardrails "inside the agent's reasoning process itself" -- is a philosophical characterization that neither baseline produced. It reframes the entire comparison from "which features are better" to "which model of agent behavior is correct."

### Actionable Value

| Condition | Score | Reasoning |
|-----------|-------|-----------|
| Sonnet | 2 | Provides 6 specific recommendations (5a-5f) with file references for what to port. Each links to a specific superpowers file. However, recommendations lack priority ordering or implementation sizing. |
| Opus | 2 | Provides 6 recommendations (5.1-5.6) with similar specificity to Sonnet, plus explicit impact assessments (High/Medium/Low). The adversarial skill testing recommendation includes a concrete starting point (superpowers' `docs/testing.md` as methodology reference). |
| Pipeline | 3 | The gap analysis provides 15 items across 4 priority tiers (Tier 0: bug fixes, Tier 1: high-impact sprint items, Tier 2: fidelity improvements, Tier 3: strategic capabilities). Each item includes: source (which specialist chunk identified it), finding with specific file references, action with implementation guidance, and confidence level. The advisory distills this to 4 behavioral test candidates with a cost estimate ($20/run for the minimal viable safety net). This is structured as a work intake document, not a report. |

**Key evidence:** Compare the brainstorming-gap recommendation across conditions:
- *Sonnet (5a):* "superpowers' visual companion is a genuinely novel feature. coordinator-claude's brainstorming skill is purely textual. The visual companion could be added as an optional extension."
- *Opus (5.3):* "Adding visual companion support would improve design discussions for UI-heavy projects. The superpowers implementation is instructive -- it uses a simple HTML template, a Node.js WebSocket server, and shell scripts."
- *Pipeline (Gap 1.1):* "coordinator-claude has no upstream design phase. The writing-plans skill assumes a spec exists. Key elements to preserve: HARD-GATE, one-question-at-a-time discipline, spec output to committed file, terminal state = writing-plans only. Adaptation needed: `docs/superpowers/specs/` -> `docs/specs/`, 'human partner' -> 'PM', skill references to coordinator namespace."

The pipeline separates the visual companion (nice-to-have) from the design gate (structural gap) and provides the specific adaptation steps needed for porting. The baselines conflate the two.

### Score Summary

| Dimension | Sonnet | Opus | Pipeline |
|-----------|--------|------|----------|
| Coverage breadth | 2.0 | 2.5 | 3.0 |
| Analytical depth | 1.5 | 2.0 | 3.0 |
| Strategic insight | 2.0 | 2.0 | 3.0 |
| Actionable value | 2.0 | 2.0 | 3.0 |
| **Average** | **1.9** | **2.1** | **3.0** |

---

## 3. What Each Tier Adds

### Sonnet -> Opus: Pattern Recognition and Mechanistic Tracing

Opus produces the same coverage as Sonnet but with two additions: it traces mechanisms (how hooks work, not just that they exist) and it frames the comparison structurally ("skill library vs. orchestration system" vs. Sonnet's feature-by-feature treatment).

Specific findings Opus caught that Sonnet missed:
- **Adversarial prompt testing:** Opus identified superpowers' 47 test files across 4 categories, including the `tests/explicit-skill-requests/` and `tests/skill-triggering/` adversarial tests. Sonnet mentioned testing only in passing ("limited" with a reference to `docs/testing.md`).
- **CI validation infrastructure:** Opus counted 11 Python validation scripts in coordinator-claude's `.github/scripts/`. Sonnet didn't examine CI.
- **Autonomous operation modes:** Opus identified `/autonomous`, `/mise-en-place`, `/code-health`, `/bug-sweep` as a category of capability (unattended overnight workflows). Sonnet listed some commands but didn't identify this as a distinct operational mode.
- **OpenCode adapter architecture:** Opus noted the adapter's custom YAML parser and message transform pattern. Sonnet described the hook output but not the platform-specific injection vectors.

However, the Sonnet-to-Opus delta is modest. Both produce feature inventories with file references. The primary difference is precision (Opus cites line numbers) and structural framing (Opus names the paradigm difference). A developer reading only the Sonnet output would reach substantially similar conclusions.

### Opus -> Pipeline: Named Patterns, Cross-Pollination, and Structural Diagnosis

The pipeline adds three categories of insight that neither baseline produces:

**1. Named design patterns that emerge from specialist cross-pollination.**

The pipeline names and traces the "Iron Law Architecture" as a consistent 4-layer pattern across all skills. Neither baseline identifies this as a pattern -- Sonnet mentions rationalization tables in `systematic-debugging` specifically; Opus mentions them as a "shared technique." The pipeline's treatment is qualitatively different: it names the pattern, documents its four layers, traces it across 14 skills with per-skill line citations, and then characterizes it philosophically as "a behavioral security model" rather than prompt engineering.

This pattern-naming likely emerges from the specialist structure: when four specialists each analyze different skill subsets, the synthesizer can observe that the same structure repeats across all of them. A single model reading skills sequentially is less likely to recognize the pattern because it processes each skill in the context of the previous one, rather than receiving four parallel characterizations of the same underlying structure.

**2. Structural gaps invisible to feature-level analysis.**

The pipeline identifies that coordinator-claude's missing brainstorming skill is not a feature gap but a lifecycle phase gap -- the ideation-to-specification phase is absent from an otherwise complete pipeline. The baselines both recommend porting the visual companion (a feature), but the pipeline separates the design-gate function (structural) from the visual companion (optional enhancement) and argues that the gate is the high-priority item.

Similarly, the pipeline identifies "no crash recovery in plan execution" as a specific reliability concern: `executing-plans` has no write-ahead status update, so if a session dies after Task 3 of 10, there's no record of progress. Neither baseline examines this scenario because neither traces the failure path -- only the happy path.

**3. The architecture atlas as a standalone deliverable.**

The atlas (file index + system map + connectivity matrix + architecture summary) is a structural artifact that neither baseline attempts. The connectivity matrix assigns centrality scores to the four subsystems (Workflow Skills: +3 net outbound, Operational Skills: -3 net, Infrastructure: +2, Docs/Tests: -2), revealing that the Operational Skills layer is the primary consumer/coordinator while Workflow Skills is the primary producer. The system map visualizes the full bootstrap chain from platform adapters through the pre-cognition interrupt to the workflow pipeline.

This atlas would take a human architect several hours to produce from scratch. It is the kind of artifact that justifies pipeline overhead for large or unfamiliar codebases.

---

## 4. Where Baselines Won

Honesty requires acknowledging where the baselines outperform the pipeline.

**Narrative coherence.** Both Sonnet and Opus produce a single, readable document that a developer can consume in 15-20 minutes. The pipeline produces 225KB across 8 files. A developer evaluating tooling wants a recommendation, not a library. The baselines are better suited to "should I adopt this?" decisions; the pipeline is better suited to "how should I integrate this into my system?" implementation work.

**Proportional depth.** Sonnet's 30KB treatment of a 15.5K-LoC repository with 14 skills is proportional. The pipeline's 225KB is arguably disproportionate -- a 14.5:1 artifact-to-source ratio. Some of this volume is structural (the atlas is a reusable reference), but the assessment itself overlaps with the gap analysis in several places. The pipeline would benefit from a more aggressive deduplication pass.

**The visual companion analysis.** Both baselines correctly identify the visual brainstorming companion as a genuinely novel feature and describe its architecture (zero-dependency WebSocket server, consent-gated, browser-rendered SVGs). The pipeline mentions it in the file index and architecture summary but gives it less focused attention -- the specialists were chunk-scoped and the visual companion fell within a chunk that had many other skills competing for analysis depth. This is a structural limitation of chunked analysis: no specialist "owned" the visual companion as their primary finding.

**Opus's "your human partner" observation.** Opus's note that superpowers' deliberate use of "your human partner" (vs. coordinator-claude's "the PM") creates different behavioral incentives is a subtle prompt-engineering insight that the pipeline didn't surface. This is the kind of observation that emerges from reading both systems comparatively in a single context window, rather than through decomposed specialist analysis.

**Speed of insight.** A solo Opus run completes in minutes. The pipeline requires team creation, scout runs, specialist deep-reads, and synthesis -- significantly more wall-clock time and token spend. For time-sensitive decisions, the Opus baseline provides 80% of the strategic value in 20% of the time.

---

## 5. Resource Efficiency

### Raw Numbers

| Metric | Sonnet | Opus | Pipeline |
|--------|--------|------|----------|
| Output volume | 30KB (1 file) | 28KB (1 file) | 225KB (8 files) |
| Model(s) used | Sonnet 4.6 | Opus 4.6 | 2 Haiku + 4 Sonnet + 1 Opus + 1 Sonnet |
| Agent count | 1 | 1 | 8 |
| Artifact:source ratio | 1.9:1 | 1.8:1 | 14.5:1 |

### Is the 7.5x Artifact Volume Justified?

Partially. The volume breaks down roughly as:

- **Assessment (22KB):** Directly comparable to the baselines. Denser, more structured, with named patterns and synthesis insights. Justifies its volume.
- **Gap analysis (16KB):** Unique deliverable with no baseline equivalent. Tiered action plan with confidence levels. High standalone value.
- **Advisory (4KB):** Distilled strategic guidance. High value-per-byte.
- **Atlas (4 files, ~75KB):** Structural reference document. High standalone value for implementation but not needed for the comparison question itself.

The atlas accounts for roughly one-third of total volume and serves a different purpose (structural reference vs. analytical comparison). If you subtract the atlas, the pipeline produces ~150KB of analytical content vs. ~30KB for the baselines -- a 5:1 ratio that better reflects the actual depth delta.

The gap analysis is the artifact that most clearly justifies the pipeline overhead. Neither baseline produces anything comparable: a priority-tiered, confidence-rated, source-attributed action plan with specific implementation guidance. This is the difference between "here's what we found" and "here's what to do about it."

### Cost-Quality Tradeoff

Without exact token counts (see methodology limitations), a rough estimate based on model pricing and document volumes:

- **Sonnet baseline:** ~$0.10-0.30 (single Sonnet pass with tool use)
- **Opus baseline:** ~$0.50-1.50 (single Opus pass with tool use)
- **Pipeline:** ~$3-8 (2 Haiku scouts + 4 Sonnet specialists + 1 Opus synthesizer + 1 Sonnet atlas agent)

The pipeline costs roughly 5-10x the Opus baseline. The quality delta (average 2.1 vs. 3.0 on the rubric) represents a full tier improvement across all four dimensions. Whether that delta justifies the cost depends on the use case -- see the next section.

---

## 6. Implications for Pipeline Design

### When to Use Each Tier

**Solo Sonnet** is the right choice when you need a quick orientation to an unfamiliar codebase or a feature comparison for a "build vs. buy" decision. It produces a clean, readable document in minutes at minimal cost. Think of it as the equivalent of a 30-minute code walkthrough with a competent colleague.

**Solo Opus** is the right choice when you need mechanistic understanding -- how things work, not just what they are. The Opus-over-Sonnet delta is modest for this particular task (codebase comparison is more breadth-sensitive than depth-sensitive), but for tasks requiring tracing execution paths or understanding failure modes, Opus's superior reasoning produces meaningfully better results. It's the senior engineer's assessment: same facts, better framing.

**Pipeline B --deepest** is the right choice when you need actionable implementation guidance, not just understanding. The pipeline's unique value is in artifacts the baselines cannot produce: the tiered gap analysis, the architecture atlas, and the cross-pollination insights that emerge from parallel specialist analysis. Use it when the research output will directly drive engineering work -- when the question is "what should we build next?" rather than "what does this system do?"

### The Sweet Spot

The data suggests a natural segmentation:

| Research Need | Recommended Tier | Reasoning |
|---------------|-----------------|-----------|
| Quick orientation / "what is this?" | Solo Sonnet | 80% coverage at 10% cost |
| Technical evaluation / "should we adopt this?" | Solo Opus | Better framing and mechanism tracing; single-document output is easier to share |
| Implementation planning / "what should we change?" | Pipeline B | Gap analysis and atlas justify the overhead; output is structured for execution |
| Architectural audit / "how does this really work?" | Pipeline B --deepest | Atlas and connectivity matrix provide structural understanding unavailable at lower tiers |

### What This Reveals About Pipeline Design

**Specialist cross-pollination produces pattern recognition that single-model passes miss.** The "Iron Law Architecture" finding -- that the same 4-layer pattern recurs across all 14 skills -- is the clearest example. This isn't because Opus can't recognize patterns (it can), but because a single model processing skills sequentially tends to describe each incrementally ("this one also has a rationalization table") rather than naming the cross-cutting pattern. The pipeline's parallel specialist structure, where four agents independently characterize different skill subsets and a synthesizer observes the commonalities, is architecturally better suited to this kind of structural pattern recognition.

**The gap analysis is the pipeline's highest-value unique deliverable.** Baselines produce findings; the pipeline produces a work intake document. The difference is structural: the gap analysis has tiers, confidence ratings, source attribution, and implementation guidance because the pipeline's multi-agent structure naturally produces these -- specialists identify gaps with confidence levels, the synthesizer prioritizes across specialists, and the advisory distills to strategic recommendations. A single model can be prompted to produce this format, but the pipeline produces it naturally.

**Atlas generation is a separable concern.** The architecture atlas (file index, system map, connectivity matrix) could be generated independently of the comparative analysis. For large repositories, generating the atlas first and feeding it to a solo model might capture 80% of the pipeline's structural insight at 30% of the cost. This suggests a "Pipeline B --map" tier between `--deeper` and `--deepest` that generates only the atlas.

**Volume management is the pipeline's primary weakness.** 225KB is too much for most readers. The pipeline would benefit from a final compression pass: a 2-page executive brief that references the detailed artifacts for readers who want depth. The current advisory document partially serves this role but at 4KB it's too brief to substitute for reading the full assessment. A 5-10KB "decision document" that synthesizes assessment + gap analysis + advisory into a single actionable artifact would make the pipeline's output more accessible without losing the detailed backing.

---

## Methodology Notes

- **N=1 per condition.** This is a qualitative showcase, not a statistical study. Results illustrate typical pipeline behavior.
- **Author-adjacent assessment.** This comparison was written by the same model family (Opus 4.6) that produced the Opus baseline and the pipeline synthesis. Potential bias toward recognizing pipeline-style reasoning as "deeper."
- **Context bloat asymmetry.** Baselines inherited ~47K tokens of irrelevant system prompt. Pipeline agents received purpose-built prompts. This may slightly disadvantage baselines.
- **Single research question.** The comparison covers one task type (codebase comparison). Pipeline advantages may vary for other research types (literature survey, competitive analysis, technical investigation).

See [methodology.md](methodology.md) for full experimental design, fairness controls, and limitations.
