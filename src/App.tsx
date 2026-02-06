import { useState, useMemo, useEffect } from "react"
import type { Category, Item, ItemId,  } from "./types/budget";
import { CATEGORIES } from "./types/budget";
import { moneyPLN } from "./utils/money";
import { clampMin } from "./utils/number";
import { loadBudgetState, saveBudgetState } from "./utils/storage";
import { Header } from "./components/Header";
import { BudgetSummary } from "./components/BudgetSummary";

function makeId(): ItemId{
  return crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
}





export default function App() {

  const initial = loadBudgetState();

  const [budget, setBudget] = useState<number>(initial?.budget ?? 5000);
  const [items, setItems] = useState<Item[]>(initial?.items ?? []);

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [qty, setQty] = useState<number>(1);
  const [category, setCategory] = useState<Category>("Rachunki");



  useEffect(() => {
    saveBudgetState({ budget, items });
  }, [budget, items]);

    const totals = useMemo(() => {
    const plannedTotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
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
  }, [items, budget]);

  function addItem(newItem: Item): void {
    setItems(prev => [newItem, ...prev]);
  }
  function removeItem(id:ItemId):void{
    setItems(prev=> prev.filter(it=>it.id !== id));
  }
   function toggleBought(id: ItemId): void {
    setItems(prev =>
      prev.map(it =>
        it.id === id ? { ...it, bought: !it.bought } : it
      )
    );
  }
   function updateQty(id: ItemId, nextQty: number): void {
    const q = clampMin(nextQty, 1);
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: q } : it))
    );
  }
function resetAll(): void {
    saveBudgetState({ budget: 5000, items: [] });
    setBudget(5000);
    setItems([]);
    setName("");
    setCategory("Rachunki");
    setPrice("");
    setQty(1);
  }
 function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedName = name.trim();
    const numericPrice = Number(price);


    if (!trimmedName) return;
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) return;
    if (qty < 1) return;

    const item: Item = {
      id: makeId(),
      name: trimmedName,
      category,
      price: Number(numericPrice.toFixed(2)),
      qty,
      bought: false,
    };

    addItem(item);

    setName("");
    setPrice("");
    setQty(1);
  }


   return (
    <div className="min-h-screen bg-stone-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Header onReset={resetAll} />

        <BudgetSummary
            budget={budget}
            onBudgetChange={setBudget}
            totals={totals}/>

        <div className="p-4 rounded-xl border border-slate-800 bg-stone-900 space-y-3">
          <h2 className="text-xl font-semibold">Dodaj planowany wydatek</h2>

          <form onSubmit={handleSubmit} className="flex gap-3 flex-wrap">
            <input
              className="px-3 py-2 rounded bg-black border border-slate-700"
              placeholder="Nazwa (np. Czynsz)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />


            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="px-3 py-2 rounded bg-black border border-slate-700"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <input
              type="number"
              step="0.01"
              className="px-3 py-2 rounded bg-black border border-slate-700"
              placeholder="Kwota"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <input
              type="number"
              min={1}
              className="px-3 py-2 rounded bg-black border border-slate-700 w-24"
              value={qty}
              onChange={(e) => setQty(clampMin(Number(e.target.value), 1))}
            />

            <button
              type="submit"
              className="px-3 py-2 bg-green-600 rounded-lg hover:bg-green-500"
            >
              Dodaj
            </button>
          </form>
        </div>

     
        <div className="p-4 rounded-xl border border-slate-800 bg-stone-900 space-y-3">
          <h2 className="text-xl font-semibold">Wydatki</h2>

          {items.length === 0 ? (
            <p className="text-slate-300">Brak wpisów - dodaj wydatki powyżej.</p>
          ) : (
            <ul className="space-y-2">
              {items.map((it) => {
                const rowTotal = it.price * it.qty;

                return (
                  <li
                    key={it.id}
                    className={`flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-800 bg-black/30 ${
                      it.bought ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={it.bought}
                        onChange={() => toggleBought(it.id)}
                        className="h-4 w-4"
                        title="Opłacone / kupione"
                      />

                      <div className="min-w-0">
                        <div className="font-semibold truncate">
                          {it.name}{" "}
                          <span className="text-xs text-slate-400 font-normal">
                            • {it.category}
                          </span>
                        </div>

                        <div className="text-sm text-slate-300 flex items-center gap-2 flex-wrap">
                          <span>{moneyPLN(it.price)}</span>
                          <span>×</span>

                          <input
                            type="number"
                            min={1}
                            className="px-2 py-1 rounded bg-black border border-slate-700 w-20"
                            value={it.qty}
                            disabled={it.bought}
                            onChange={(e) => updateQty(it.id, Number(e.target.value))}
                          />

                          <span>=</span>
                          <span>
                            <b>{moneyPLN(rowTotal)}</b>
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(it.id)}
                      className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500"
                    >
                      Usuń
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}


