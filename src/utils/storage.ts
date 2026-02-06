// src/utils/storage.ts

import type { StoredState, Category } from "../types/budget";
import { CATEGORIES } from "../types/budget";

export const STORAGE_KEY = "household_budget_v1";

function isStoredState(x: unknown): x is StoredState {
  if (!x || typeof x !== "object") return false;

  const obj = x as Record<string, unknown>;

  if (typeof obj.budget !== "number") return false;
  if (!Array.isArray(obj.items)) return false;

  for (const it of obj.items) {
    if (!it || typeof it !== "object") return false;

    const item = it as Record<string, unknown>;

    if (typeof item.id !== "string") return false;
    if (typeof item.name !== "string") return false;
    if (!CATEGORIES.includes(item.category as Category)) return false;
    if (typeof item.price !== "number") return false;
    if (typeof item.qty !== "number") return false;
    if (typeof item.bought !== "boolean") return false;
  }

  return true;
}



export function loadBudgetState(): StoredState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isStoredState(parsed)) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function saveBudgetState(state: StoredState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
