# Household Budget Planner (React + TypeScript)

Mini narzędzie do planowania budżetu domowego stworzone w React + TypeScript. Aplikacja pozwala planować wydatki, oznaczać je jako opłacone oraz kontrolować zarówno planowany, jak i rzeczywisty stan budżetu.

---

## Cel projektu

Projekt powstał jako aplikacja pokazująca:

- poprawne użycie React hooks (`useState`, `useMemo`, `useEffect`)
- unikanie overengineeringu
- czysty podział logiki (domain logic vs UI)
- typowanie TypeScript
- myślenie produktowe przy projektowaniu narzędzia

---

## Funkcje (MVP)

- Ustawienie budżetu
- Dodawanie planowanych wydatków:
  - nazwa
  - kategoria
  - cena
  - ilość
- Oznaczanie wydatków jako opłacone/kupione
- Automatyczne obliczanie:
  - **Po planowanych wydatkach** = budżet − suma wszystkich wpisów
  - **Rzeczywiście zostało** = budżet − suma opłaconych wpisów
- Zapisywanie danych w `localStorage`
- Działanie jako realne narzędzie (stan zachowany po odświeżeniu)

---

## Decyzje techniczne

### State management

- `App.tsx` jest source of truth (`budget`, `items`)
- Domain actions są trzymane blisko state — bez niepotrzebnych abstrakcji

### Hook usage

- `useMemo` — użyty do derived state (totals)
- `useEffect` — tylko do side-effect (persist do localStorage)

### Separation of concerns

- Pure functions (np. obliczenia totals) → `utils/`
- Typy domenowe → `types/`
- Komponenty prezentacyjne → `components/`

Uniknięto premature optimization i nadmiernej architektury (context/reducer/store), ponieważ skala aplikacji tego nie wymaga.

---

## Stack technologiczny

- React
- TypeScript
- Vite
- TailwindCSS

---

## Struktura projektu

```
src/
  components/
    Header.tsx
    BudgetSummary.tsx
    ExpenseForm.tsx
    ExpenseList.tsx
    ExpenseRow.tsx
  types/
    budget.ts
  utils/
    storage.ts
    totals.ts
    money.ts
    number.ts
  App.tsx
```

---

## Uruchomienie lokalnie

```bash
npm install
npm run dev
```

---

## Pomysły na dalszy rozwój

- Priorytety wydatków (1–4) i analiza wpływu na budżet
- Filtry po kategorii
- Podsumowania per kategoria
- Historia miesięcy
- Eksport/import danych

---

## Autor

 [Kamila Samczuk](https://github.com/Kamisia).


