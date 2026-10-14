# Paseo Plugins

A collection of plugins for [Paseo](https://paseo.sh), designed to enhance the agent orchestration experience with custom workspace panels, telemetry monitors, and workflow tools.

## Plugins

| Plugin | Type | Description |
|---|---|---|
| **`dashboard`** | Workspace Panel / Sidebar | Real-time ambient telemetry and agent dashboard displaying token velocity, context usage, agent radar activity, subagent statuses, and session turn minimaps. |

## Development & Installation

### Prerequisites

* [Paseo](https://paseo.sh) >= 0.11.0
* Node.js >= 18
* npm or pnpm

### Adding a Plugin to Paseo

To install a local plugin into your Paseo daemon:

```bash
# Install the plugin
paseo plugin install /absolute/path/to/PaseoPlugins/<plugin-name>

# Verify status
paseo plugin ls

# Reload after making changes
paseo plugin reload <plugin-id>
```

## Structure

```text
PaseoPlugins/
├── dashboard/         # Ambient context & telemetry dashboard sidebar panel
├── ...
└── README.md
```
