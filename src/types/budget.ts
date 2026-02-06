// src/types/budget.ts

export type ItemId = string;

export type Category =
  | "Rachunki"
  | "Edukacja"
  | "Wyżywienie"
  | "Rozrywka"
  | "Oszczędności"
  | "Inne";

export interface Item {
  id: ItemId;
  category: Category;
  name: string;
  price: number;
  qty: number;
  bought: boolean;
}

export const CATEGORIES: Category[] = [
  "Rachunki",
  "Edukacja",
  "Wyżywienie",
  "Rozrywka",
  "Oszczędności",
  "Inne",
];

export type StoredState = {
  budget: number;
  items: Item[];
};
