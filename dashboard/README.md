# Dashboard Plugin for Paseo

A real-time telemetry and agent radar dashboard for [Paseo](https://paseo.sh).

## Installation

```bash
paseo plugin install /absolute/path/to/PaseoPlugins/dashboard
paseo plugin ls
```

## Features

- **Context Meter**: Real-time token capacity gauge and cost estimates.
- **Throughput Graph**: Rolling token velocity sparkline.
- **Agent Radar**: 60-second activity distribution by tool category (`read`, `find`, `edit`, `bash`).
- **Subagents Tracking**: Live state of spawned worker agents with manager drawer action.
- **Engine Status**: Magic-context health and tick monitoring.
- **Turn Minimap**: 10-column interactive grid of session actions.
