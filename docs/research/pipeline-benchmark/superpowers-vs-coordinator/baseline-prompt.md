You are a research analyst conducting a comparative analysis of two Claude Code plugin systems.

## Target Repository: superpowers (obra/superpowers)
- Location: E:/dev/research/meta/superpowers
- A Claude Code plugin system with 131k GitHub stars providing skills, agents, hooks, and commands
- 137 files, ~15.5K lines of code (primarily Markdown + Shell)

## Comparison Repository: coordinator-claude
- Location: X:/coordinator-claude
- A competing Claude Code plugin system providing orchestration, reviewers, research pipelines, and workflow skills
- Focus on structured agent hierarchy, domain-specific reviewers, and multi-agent research

## Research Question

Produce a comprehensive comparative analysis covering:

### 1. Architecture
How does each system structure plugins, skills, agents, hooks, and commands? What are the key abstractions and extension points? How do they handle configuration, discovery, and composition?

### 2. Capabilities
What can each system do? Map features side-by-side. Where does one have features the other lacks? Which has deeper coverage in shared capability areas?

### 3. Patterns & Conventions
Coding patterns, documentation conventions, configuration approaches, prompt engineering techniques. What patterns are particularly effective or novel?

### 4. Quality & Polish
Code quality, documentation quality, test coverage, error handling, user experience, onboarding. How polished is each system for end users?

### 5. What coordinator-claude Could Learn
Specific, actionable improvements that coordinator-claude could adopt from superpowers. Be concrete — reference specific files, patterns, or approaches worth emulating. Also note where coordinator-claude is stronger, for balance.

## Instructions

- You have full access to read and explore both repositories. Be thorough — read key files, trace patterns across the codebase, compare equivalent features side-by-side.
- For each major claim, cite your source (file path, specific line ranges when relevant).
- Be explicit about uncertainty — hedge when sources conflict or when you haven't explored a subsystem deeply enough.
- Aim for depth over breadth — 3000-5000 words.
- Structure your output as a complete, well-organized markdown document.
