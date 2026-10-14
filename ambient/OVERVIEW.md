# Ambient

Ambient provides a live operational telemetry sidebar for your Paseo coding agent sessions.

It visualizes real-time metrics including context window utilization, throughput velocity (tokens/sec), active tool executions over the last 60 seconds (Agent Radar), child subagent statuses, engine heartbeat, and a dense visual minimap of session actions.

## Features

- **Context & Cost Telemetry**: Circular meter showing context consumption percentage against total window capacity, token usage, and approximate session cost.
- **Throughput Sparkline**: Dynamic velocity wave charting token generation rate over time.
- **Agent Radar**: Color-coded event frequency timeline tracking tool invocations (`read`, `find`, `edit`, `bash`).
- **Subagent Fleet Monitor**: Real-time status badge and manager launcher for background child agents.
- **Engine Status & Magic-Context**: Heartbeat indicator, memory tier status, and ticker tracking.
- **Session Minimap**: Grid matrix visualizing sequential session turns and event density.

## Usage

Ambient automatically registers into the Paseo workspace and Explorer tabs. You can also open it from the Command Center (Ctrl+K / Cmd+K) by searching for "Ambient".
