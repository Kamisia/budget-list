

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

export type Totals = {
  plannedTotal: number;
  spentTotal: number;
  plannedRemaining: number;
  actualRemaining: number;
  plannedOver: boolean;
  actualOver: boolean;
};