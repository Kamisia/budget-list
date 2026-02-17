import { loadBudgetState, saveBudgetState, STORAGE_KEY } from "./storage";
import type { StoredState } from "../types/budget";

function validState(overrides: Partial<StoredState> = {}): StoredState {
  return {
    budget: 3000,
    items: [
      {
        id: "1",
        name: "Czynsz",
        category: "Rachunki",
        price: 1200,
        qty: 1,
        bought: true,
      },
    ],
    ...overrides,
  };
}

describe("storage utils", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("loadBudgetState", () => {
    it("returns null when no data exists", () => {
      expect(loadBudgetState()).toBeNull();
    });

    it("returns parsed state for valid data", () => {
      const state = validState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

      expect(loadBudgetState()).toEqual(state);
    });

    it("returns null for invalid JSON", () => {
      localStorage.setItem(STORAGE_KEY, "{invalid-json");
      expect(loadBudgetState()).toBeNull();
    });

    it("returns null for invalid state shape", () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          budget: "3000",
          items: [],
        })
      );

      expect(loadBudgetState()).toBeNull();
    });

    it("returns null when item category is outside allowed categories", () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          budget: 3000,
          items: [
            {
              id: "1",
              name: "Test",
              category: "NotAllowed",
              price: 100,
              qty: 1,
              bought: false,
            },
          ],
        })
      );

      expect(loadBudgetState()).toBeNull();
    });
  });

  describe("saveBudgetState", () => {
    it("writes serialized state to localStorage", () => {
      const state = validState({ budget: 4500 });
      saveBudgetState(state);

      expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(state));
    });
  });
});
