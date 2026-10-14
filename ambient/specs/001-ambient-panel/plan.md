# Plan 001: Ambient Panel Architecture & Implementation

## Architecture

### 1. Plugin Manifest & Setup
* ID: `ambient`
* Requirements: `paseo >= 0.11.0`
* Runtime entries:
  - `index.client.tsx`: registers `addWorkspacePanel` (title: `"ambient"`, icon: `"Activity"`, locations: `["explorer", "workspace"]`), `addCommandCenterItem`.
  - `index.server.ts`: daemon-side lifecycle hooks and RPC handlers.

### 2. Shared Layer (`shared/`)
* Contracts defined via `defineRpc` using Zod schemas:
  - `ambient.telemetry`: returns `{ contextTokens, maxContextTokens, costUsd, throughputTps, throughputHistory, radarEvents, subagentCount, subagentStatus, magicContext, ticker, minimapTiles }`.
  - `ambient.openManager`: trigger for subagent manager modal/panel.

### 3. Server Layer (`server/`)
* Ingests agent lifecycle events from `server.on("agent.created")`, `server.on("agent.turn_ended")`.
* Tracks token usage, throughput timeline, tool invocations, and computes live stats.
* Stores persistent session metrics in `~/.paseo/plugin-data/ambient/ambient.db` or cached memory store with fallback default telemetry.

### 4. Client Layer (`client/`)
* `design-tokens.ts`: spacing, colors, font scale, radiuses (`RADIUS.card = 16`, `RADIUS.swatch = 4`).
* `ui.tsx`: `AmbientCard`, `Badge`, `RingProgress`, `Sparkline`, `LegendDot`, `Tile`.
* `widgets/`:
  - `ContextGauge`: circular ring progress with animated/styled stroke, token counters, throughput sparkline.
  - `AgentRadar`: 60s bar chart of `read`, `find`, `edit`, `bash` operations.
  - `SubagentsWidget`: status badge and manager action button.
  - `StatusWidget`: engine indicator, magic-context stats, ticker.
  - `MinimapWidget`: 10x12 colored matrix of past turn milestones.
