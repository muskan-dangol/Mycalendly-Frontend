```
# Mycalendly-Frontend

Simple integration to build a Calendly-like scheduling service (development).

## Features

- User authentication with login, signup, and password reset flows
- Email verification and confirmation workflows
- Protected routes for authenticated access
- Modern UI built with React, TypeScript, and Vite
- API-driven frontend for scheduling and account-related services

## Getting Started

These are the essential steps to run the project locally.

### Prerequisites
- Node.js v18 or newer (recommended)
- npm, yarn, or pnpm installed

### Install dependencies
Use your package manager of choice. Examples:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Run the development server

```bash
npm run dev
```

The app will run with Vite (default port: 5173). Open http://localhost:5173 in your browser.

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Tests

Run unit tests with Vitest:

```bash
npm run test
# watch mode
npm run test:watch
# UI runner
npm run test:ui
```

### Linting

```bash
npm run lint
```

### Environment variables
create a `.env` file at the project root and add Vite-prefixed variables (example names):

- `VITE_API_URL`
- `VITE_OAUTH_CLIENT_ID`

Restart the dev server after changing env vars.

### Useful files
- Package scripts: [package.json](package.json)
- App entry: [src/main.tsx](src/main.tsx)


