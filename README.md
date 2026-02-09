![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![React](https://img.shields.io/badge/React-18+-61dafb)
![Tailwind](https://img.shields.io/badge/TailwindCSS-Enabled-38bdf8)

# Household Budget Planner

A small React application for planning and tracking household expenses against a monthly budget.

The app helps visualize the difference between:

- planned expenses (what you expect to spend)
- actual spending (what has already been paid)

The goal of this project was to build a realistic, cleanly structured application focusing on correct React patterns, simplicity, and maintainable architecture rather than feature complexity.

---

## Features

- Monthly budget tracking
- Planned vs actual spending overview
- Expense categories
- Mark expenses as paid
- Automatic budget calculations
- Persistent data using localStorage
- Responsive UI with TailwindCSS

---

## Technical Highlights

- TypeScript-first approach with clear domain types
- Separation between UI and business logic
- useMemo used only where computation benefits from memoization
- Minimal state management — no unnecessary abstraction
- Clean component structure
- Testing pyramid applied:
  - Unit tests for business logic
  - Integration tests for user interactions
  - E2E tests for main user flow

---

## Tech Stack

- React
- TypeScript
- TailwindCSS
- Jest + React Testing Library
- Playwright (E2E)

---

## Testing Strategy

The project demonstrates a layered testing approach:

- **Unit tests** — budget calculation logic
- **Integration tests** — form interactions and state updates
- **E2E tests** — main user flow including persistence after reload

---

## Getting Started

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Run unit and integration tests:

```bash
npm test
```

Run E2E tests:

```bash
npm run test:e2e
```

---

## Future Improvements

- Expense prioritization
- Category summaries
- Data export/import
- Improved accessibility

---

## Author

 [Kamila Samczuk](https://github.com/Kamisia).


