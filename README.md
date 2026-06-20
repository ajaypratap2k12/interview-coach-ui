# Interview Coach UI

Angular frontend for an AI-powered interview coaching application. Practice technical interviews and receive instant feedback with scoring, or ask questions and get expert answers with execution traces.

## Tech Stack

- Angular 19 (standalone components)
- TypeScript (strict mode)
- RxJS
- Plus Jakarta Sans / JetBrains Mono fonts
- Spring Boot backend (port 8080)

## Prerequisites

- Node.js (v18+)
- npm
- Spring Boot backend running on `http://localhost:8080`

## Getting Started

```bash
npm install
npm start
```

The app runs at `http://localhost:4200` and proxies API requests to the backend.

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/session/start` | POST | Start a new interview session |
| `/session/answer` | POST | Submit answer and get feedback |
| `/interview/trace` | GET | Ask a question with full execution trace |

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── chat-message/        # Reusable chat bubble (role-based layout)
│   │   ├── interview/           # Main interview/ask chat container
│   │   ├── trace-panel/         # Collapsible execution trace panel
│   │   └── welcome/             # Welcome screen with session cards
│   ├── models/
│   │   └── chat.model.ts        # Shared interfaces and role configs
│   ├── pipes/
│   │   └── markdown.pipe.ts     # Markdown-to-HTML pipe
│   ├── services/
│   │   └── interview.service.ts # API client and state management
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── index.html
├── main.ts
└── styles.scss
```

## Architecture

The app has two session modes:

- **Interview Session** — Mock interview with question/answer/feedback loop and scoring
- **Ask a Question** — Free-form Q&A with execution trace showing agent pipeline timing

Components are standalone (no NgModules) and use role-based configuration (`INTERVIEW_ROLES` / `ASK_ROLES`) to drive chat layout, alignment, and styling from a single `<app-chat-message>` component.
