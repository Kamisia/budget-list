![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![Tailwind](https://img.shields.io/badge/TailwindCSS-4-38bdf8)

# Household Budget Planner

A React + TypeScript application for planning and tracking household expenses against a monthly budget.

The app presents two budget perspectives:
- planned spending (all added expenses)
- actual spending (only items marked as paid)

UI language is Polish (`pl-PL`), and money values are formatted in PLN.

---

## Project Goals

- Build a realistic MVP with clean architecture and strong basics
- Keep business logic explicit and testable
- Use simple React patterns without unnecessary abstractions

---

## Features

- Monthly budget management
- Planned vs actual remaining budget
- Expense categories
- Mark items as paid/unpaid
- Quantity updates and item removal
- Persistent state in `localStorage`
- Reset to default state
- Responsive UI with Tailwind CSS

---

## Tech Stack

- React 19
- TypeScript 5
- Vite (Rolldown)
- Tailwind CSS 4
- Jest + React Testing Library
- Playwright (E2E)
- ESLint 9

---

## Project Structure

```text
src/
  components/    UI components
  utils/         Pure helpers (totals, storage, number, money)
  types/         Domain types
  App.tsx        Main state orchestration
e2e/             End-to-end Playwright tests
```

Core separation:
- `src/utils/totals.ts` contains budget calculations
- `src/utils/storage.ts` isolates persistence and validation
- React components focus on presentation and interactions

---

## Testing

The repository includes three test layers:

- Unit tests for utility logic (`src/utils/*.test.ts`)
- Integration tests for app flows and component interactions (`src/App.test.tsx`, component tests)
- One E2E happy-path scenario with persistence after reload (`e2e/budget-flow.spec.ts`)

Run tests:

```bash
npm test
npm run test:e2e
```

---

## Requirements

- Node.js 20+
- npm 10+

---

## Getting Started

Install dependencies:

```bash
npm install
```

Start dev server:

```bash
npm run dev
```

Build production bundle:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Lint code:

```bash
npm run lint
```

Watch tests:

```bash
npm run test:watch
```

Run Playwright UI mode:

```bash
npm run test:e2e:ui
```

---

## Future Improvements

- Category-level summaries and charts
- Export/import (JSON/CSV)
- Better accessibility coverage and keyboard flows
- Filtering and sorting expenses

---

## Author

[Kamila Samczuk](https://github.com/Kamisia)
