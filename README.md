# MediClick — Frontend

A single-page application for booking doctor appointments online, built with Next.js (App Router), React, and TypeScript. Consumes the [MediClick backend API](#).

## Features

- User registration, login, forgot/reset password
- Browse and search doctors by specialty
- Book, view, and cancel appointments with real-time slot availability
- Favorites (save doctors for quick access)
- Payments and payment history
- Profile management (details, password, photo)
- Admin panel (manage doctors, users, appointments, payments)
- Light/dark theme toggle
- **AI Chatbot** — floating assistant that helps users navigate the platform (booking, cancelling, finding doctors)
- **AI Symptom Checker** — describe symptoms in plain English and get a suggested specialist to book with, powered by Google Gemini

## Tech Stack

- **Framework:** Next.js (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS
- **Forms/validation:** React Hook Form, Zod
- **HTTP:** Axios
- **AI:** Google Gemini API
- **Testing:** Jest + React Testing Library (unit), Playwright (end-to-end)

## Getting Started

### Prerequisites

- Node.js 18+
- The [MediClick backend](#) running (default: `http://localhost:8089`)

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.local.example` to `.env.local` and fill in your own values:
   ```bash
   cp .env.local.example .env.local
   ```

3. Run the dev server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

### Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the backend API |
| `SMTP_USER` / `SMTP_PASS` | SMTP credentials, used for the OTP email routes in `app/api/` |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Google Gemini API key, used by the chatbot and symptom checker |

**Never commit `.env.local`.** Only `.env.local.example` (with placeholder values) should be tracked in git. If you're setting up the AI features, get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests (Jest) |
| `npm run test:e2e` | Run end-to-end tests (Playwright) |

## Testing

**Unit tests** (components, hooks, schema validation):
```bash
npm test
```

**End-to-end tests** (full user flows: login, register, booking, cancelling, dashboard, navigation, profile, logout):
```bash
npm run test:e2e
```
Playwright automatically starts the dev server before running, using the config in `playwright.config.ts`. Make sure the backend is running first, since the e2e flows hit real API calls.

## AI Features

Both AI features call the Google Gemini API directly from the client using a `NEXT_PUBLIC_` API key, via `lib/api/ai/gemini.ts`. Server actions in `lib/actions/ai/` wrap the calls and handle errors/retries:

- `lib/actions/ai/chatbot-action.ts` — powers the floating assistant (`components/ChatbotWidget.tsx`)
- `lib/actions/ai/symptom-checker-action.ts` — powers `/symptom-checker`, returns a structured JSON specialist recommendation

> Note: exposing the API key client-side is a known limitation of this approach — acceptable for a coursework project, but in production this call should be proxied through a backend route to keep the key private.

## Project Structure

```
app/
├── (auth)/                 # Authenticated routes (dashboard, appointments, profile, symptom-checker, etc.)
│   └── _components/         # Shared shell/layout components for this route group
├── (admin)/                # Admin-only routes
├── api/                     # Next.js route handlers (OTP, password verification)
├── _components/              # Shared marketing/landing components
components/                    # Shared UI components (modals, chatbot, theme toggle)
lib/
├── api/                       # Axios calls to the backend + Gemini
├── actions/                    # Server actions wrapping the api/ calls
├── contexts/                    # React context (auth)
└── cookies.ts, utils.ts          # Shared helpers
hooks/                            # Custom React hooks
__tests__/                         # Jest unit tests
e2e/                                 # Playwright end-to-end tests
```

## License

Created as part of a university coursework assignment.
