# Spec 001: Ambient Panel

## Status
In Progress

## Summary
Build the Ambient telemetry panel for Paseo as an Explorer and Workspace panel. The panel displays real-time agent execution telemetry, context token usage, cost approximations, throughput sparkline, tool radar over the last 60 seconds, active subagents tracker, engine/extension status, and an interactive session minimap.

## Goals
1. Docks as an Explorer panel (`locations: ["explorer", "workspace"]`) with title `ambient`.
2. Telemetry Card:
   - Circular arc gauge showing percentage of context window used (e.g. 9.0%).
   - Context token stats (e.g. 94.0k / 1.05M).
   - Cost and velocity readout (`cost $0.73 · 92 t/s`).
   - Throughput sparkline graph with live tokens/sec.
3. Agent Radar:
   - Rolling 60-second activity bar graph.
   - Categorized by tool type: `read` (cyan), `find` (purple), `edit` (green), `bash` (orange).
4. Subagents Monitor:
   - State badge (`idle`, `running`, etc.).
   - Child task tracker.
   - Manager action button (`open manager`).
5. Engine & Extension Status:
   - Status badge, magic-context tier info (`mc: 94K (9%) · idle`), and session ticker counter.
6. Session Minimap:
   - 10-column grid of colored tiles representing session turns, actions, and milestones.

## Acceptance Criteria
- Matches the visual styling, card layout, colors, and typography from the design spec.
- Fully compatible with React Native primitives and Paseo `theme.colors`.
- Responsive in both wide panels and compact explorer sidebars.
- Typechecks cleanly without DOM dependencies.
- Successfully installs and runs on Paseo daemon (`paseo plugin ls` shows `running`).
