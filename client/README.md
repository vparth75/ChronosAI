# Chronos Client

The Chronos client is a React + Vite experience for reconstructing noisy, incomplete internet fragments with a single click. It integrates directly with the FastAPI backend found under `../server`, forwards user fragments, and streams back the structured report produced by the Gemini-powered pipeline.

## Prerequisites

- Node.js 20+
- The Chronos backend running locally (default: `http://localhost:8000`)

## Environment variables

Create a `.env` file in this folder or export the variables before running Vite:

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_API_KEY=replace-with-your-shared-secret
```

- `VITE_API_BASE_URL` defaults to `http://localhost:8000/api/v1` if omitted.
- `VITE_API_KEY` is required because the backend enforces the `X-API-Key` header on `/reconstruct`.

## Getting started

```bash
npm install
npm run dev
```

Open the development server (default: <http://localhost:5173>) and paste any fragment into the launcher. The UI displays live status, reconstruction results, Gemini reasoning, and contextual citations returned by the backend.

## Production build

```bash
npm run build
npm run preview
```

The build artefacts will be emitted to `dist/`. Serve them behind the same origin as your FastAPI instance or update `VITE_API_BASE_URL` accordingly.

## Project structure

- `src/App.tsx` — main homepage with the reconstruction workflow and report viewers.
- `src/components/ui/*` — reusable UI primitives (buttons, badges, cards, textarea).
- `src/index.css` — Tailwind theme and animations tailored for the Chronos aesthetic.

## Troubleshooting

- **401 Unauthorized**: confirm that the frontend `VITE_API_KEY` matches `API_KEY_SECRET` in the backend `.env`.
- **Long-running requests**: the backend performs external Google CSE lookups. Check server logs for rate limits or networking issues.
- **Missing styling**: ensure Tailwind CSS is enabled (see `@tailwindcss/vite` plugin in `vite.config.ts`).
