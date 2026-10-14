# PaseoPlugins

Repository for custom Paseo plugins.

## Active Plugins

* **Ambient** (`ambient/`): Real-time ambient telemetry and agent radar panel for Paseo workspace and explorer.

## Development Workflow

1. Spec-driven development: every feature begins in `specs/00N-<feature-name>/` with `spec.md`, `plan.md`, and `tasks.md`.
2. Clean runtime boundaries:
   - `client/`: React Native primitives (`View`, `Text`, `Pressable`, `ScrollView`), `@getpaseo/plugin/client`, design tokens. No DOM libraries.
   - `server/`: Node.js daemon subprocess, SQLite storage in `~/.paseo/plugin-data/<plugin-id>/`.
   - `shared/`: Zod RPC contracts and pure schemas.
3. Conventional Commits: `<type>(<scope>): <description>` (e.g. `feat(ambient): add agent radar widget`).
4. Typecheck before install/reload: `npm run typecheck`.
5. Testing: `npm test`.
