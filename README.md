# Interview Coach UI

Angular frontend for an AI-powered interview coaching application. Practice technical interviews and receive instant feedback with scoring.

## Tech Stack

- Angular 19
- TypeScript
- RxJS
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

## Project Structure

```
src/
├── app/
│   ├── components/interview/   # Main interview chat UI
│   ├── services/               # InterviewService (API client)
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── index.html
├── main.ts
└── styles.scss
```
