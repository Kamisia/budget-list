import { calculateTotals } from "./totals";
import type { Item } from "../types/budget";

function item(overrides: Partial<Item> = {}): Item {
  return {
    id: "1",
    name: "Czynsz",
    category: "Rachunki",
    price: 100,
    qty: 1,
    bought: false,
    ...overrides,
  };
}

describe("calculateTotals", () => {
  it("returns zeros for empty items", () => {
    const t = calculateTotals(500, []);
    expect(t.plannedTotal).toBe(0);
    expect(t.spentTotal).toBe(0);
    expect(t.plannedRemaining).toBe(500);
    expect(t.actualRemaining).toBe(500);
    expect(t.plannedOver).toBe(false);
    expect(t.actualOver).toBe(false);
  });

  it("plannedTotal sums all items", () => {
    const items = [
      item({ price: 10, qty: 2, bought: false }),
      item({ id: "2", price: 5, qty: 3, bought: true }),
    ];
    const t = calculateTotals(100, items);
    expect(t.plannedTotal).toBe(10 * 2 + 5 * 3);
  });

  it("spentTotal sums only bought items", () => {
    const items = [
      item({ price: 10, qty: 2, bought: false }),
      item({ id: "2", price: 5, qty: 3, bought: true }),
    ];
    const t = calculateTotals(100, items);
    expect(t.spentTotal).toBe(5 * 3);
  });

  it("sets plannedOver and actualOver when remaining < 0", () => {
    const items = [item({ price: 600, qty: 1, bought: false })];
    const t1 = calculateTotals(500, items);
    expect(t1.plannedOver).toBe(true);
    expect(t1.actualOver).toBe(false); 

    const items2 = [item({ price: 600, qty: 1, bought: true })];
    const t2 = calculateTotals(500, items2);
    expect(t2.plannedOver).toBe(true);
    expect(t2.actualOver).toBe(true);
  });

  it("does not set over flags when totals are exactly equal to budget", () => {
    const items = [
      item({ id: "1", price: 250, qty: 2, bought: true }),
      item({ id: "2", price: 500, qty: 1, bought: false }),
    ];

    const t = calculateTotals(1000, items);
    expect(t.plannedTotal).toBe(1000);
    expect(t.spentTotal).toBe(500);
    expect(t.plannedRemaining).toBe(0);
    expect(t.actualRemaining).toBe(500);
    expect(t.plannedOver).toBe(false);
    expect(t.actualOver).toBe(false);
  });
});
