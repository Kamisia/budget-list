import type { Item } from "../types/budget";

export function calculateTotals(budget: number, items: Item[]) {
  const plannedTotal = items.reduce(
    (sum, it) => sum + it.price * it.qty,
    0
  );

  const spentTotal = items
    .filter((it) => it.bought)
    .reduce((sum, it) => sum + it.price * it.qty, 0);

  const plannedRemaining = budget - plannedTotal;
  const actualRemaining = budget - spentTotal;

  return {
    plannedTotal,
    spentTotal,
    plannedRemaining,
    actualRemaining,
    plannedOver: plannedRemaining < 0,
    actualOver: actualRemaining < 0,
  };
}
