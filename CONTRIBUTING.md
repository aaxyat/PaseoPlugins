# Contributing to PaseoPlugins

This monorepo houses standalone plugins for [Paseo](https://paseo.sh).

## Prerequisites

* Node.js >= 20.0
* Paseo >= 0.11.0
* `paseo` CLI on your `PATH`

## Architecture & Layout

Each plugin is self-contained in its own directory named after its plugin ID:

```text
ambient/
  paseo-plugin.json
  package.json
  tsconfig.json
  index.client.tsx
  index.server.ts
  client/
  server/
  shared/
  specs/
```

## Adding a Plugin

1. Create directory `<plugin-id>/` with `paseo-plugin.json` and requirements:
   ```json
   {
     "id": "<plugin-id>",
     "description": "...",
     "requirements": {
       "paseo": ">=0.11.0"
     }
   }
   ```
2. Add spec documentation in `specs/001-.../spec.md`.
3. Implement `shared/` contracts first, followed by `server/` handlers and `client/` UI.
4. Typecheck: `npm run typecheck`.
5. Test: `npm test`.

## Commit Messages

Use Conventional Commits: `<type>(<scope>): <description>`.
* `feat(ambient): add minimap visualizer`
* `fix(ambient): correct token counter format`
