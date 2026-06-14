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

## Conventions

- Component prefix: `app` (enforced in `angular.json`)
- Styles: SCSS, not CSS
- TypeScript strict mode enabled with `noPropertyAccessFromIndexSignature` and `strictTemplates`
- RxJS `BehaviorSubject` for state management in services
