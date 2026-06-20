# AGENTS.md

## Commands

- `npm start` — dev server on `http://localhost:4200` with proxy to backend (uses `proxy.conf.json`)
- `npm run build` — production build to `dist/interview-coaching-ui`
- `ng generate component <name>` — generates standalone component with SCSS

## Architecture

- Angular 19 standalone app (no NgModules). All components use `standalone: true`.
- Single route: `/` → `InterviewComponent`
- Backend: Spring Boot on `http://localhost:8080`. Must be running for the app to function.
- `proxy.conf.json` proxies `/api/*` to backend, but `InterviewService` calls `http://localhost:8080` directly (not through proxy).

### Components

| Component | Path | Purpose |
|---|---|---|
| `InterviewComponent` | `components/interview/` | Main container — orchestrates both session modes |
| `WelcomeComponent` | `components/welcome/` | Welcome screen with two session cards |
| `ChatMessageComponent` | `components/chat-message/` | Reusable chat bubble — driven by `RoleConfig` |
| `TracePanelComponent` | `components/trace-panel/` | Collapsible execution trace for ask mode |

### Models

All shared interfaces live in `src/app/models/chat.model.ts`:
- `ChatMessage`, `TraceResponse`, `NodeTrace`
- `RoleConfig` — drives label, icon, alignment, and variant per role
- `INTERVIEW_ROLES` / `ASK_ROLES` — role config maps for each session type

### Services

`InterviewService` (`src/app/services/interview.service.ts`):
- `BehaviorSubject`-based state for `messages$` and `askMessages$`
- Uses RxJS `pipe(tap(...))` for side effects
- Two session flows: interview (`startSession` → `submitAnswer`) and ask (`askQuestionWithTrace`)

## Conventions

- Component prefix: `app` (enforced in `angular.json`)
- Styles: SCSS with BEM naming
- TypeScript strict mode enabled with `noPropertyAccessFromIndexSignature` and `strictTemplates`
- Fonts: Plus Jakarta Sans (body) + JetBrains Mono (code blocks)
- All components are standalone — import directly, no NgModules
