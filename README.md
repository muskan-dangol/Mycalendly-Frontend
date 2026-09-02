# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
# Mycalendly-Frontend

Simple integration to build a Calendly-like scheduling service (development).

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


