# Privacy Policy

**deep-research** — a Claude Code plugin by [Dónal O'Duffy](https://github.com/oduffy-delphi)

Last updated: 2026-04-02

## What this plugin does

This plugin runs multi-agent research pipelines entirely within your local Claude Code session. It coordinates Claude agents (scouts, specialists, synthesizers) to perform internet research, repository analysis, structured data gathering, and media research.

## Data collection

This plugin does **not** collect, transmit, or store any user data. It has no analytics, telemetry, tracking, or external reporting of any kind.

## Where your data goes

All research output is written to local files in your project directory (typically `docs/research/`). Data flows only through services you already use:

- **Pipelines A, B, C** — use Claude Code's built-in tools (web search, file read/write). No additional services.
- **Pipeline D (NotebookLM)** — sends sources and queries to Google NotebookLM via the [notebooklm-mcp-cli](https://github.com/jacob-bd/notebooklm-mcp-cli) MCP server. This requires your own Google account and is subject to [Google's Privacy Policy](https://policies.google.com/privacy). This pipeline is optional and disabled by default.

## Third-party services

| Service | When used | Your relationship |
|---------|-----------|-------------------|
| Anthropic (Claude) | All pipelines | Your existing Claude Code subscription |
| Google (NotebookLM) | Pipeline D only (opt-in) | Your own Google account |

This plugin does not introduce any third-party service relationships beyond what you already have with Anthropic and, optionally, Google.

## Source code

This plugin is fully open source. You can audit every agent prompt, pipeline protocol, and command at [github.com/oduffy-delphi/deep-research-claude](https://github.com/oduffy-delphi/deep-research-claude).

## Contact

Questions about this policy: open an issue on the [GitHub repository](https://github.com/oduffy-delphi/deep-research-claude/issues).
