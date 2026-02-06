import { useState, useMemo, useEffect } from "react"
type ItemId = string;
type Category = "Rachunki" | "Edukacja" | "Wyżywienie" | "Rozrywka" | "Oszczędności" | "Inne";

interface Item {
  id:ItemId;
  category: Category;
  name:string;
  price:number;
  qty:number;
  bought:boolean;
}
const CATEGORIES: Category[] = [
  "Rachunki",
  "Edukacja",
  "Wyżywienie",
  "Rozrywka",
  "Oszczędności",
  "Inne",
];
const STORAGE_KEY = "household_budget_v1";
function makeId():ItemId{
  return crypto.randomUUID ? crypto.randomUUID() : String(Data.now() + Math.random());
}
function clampMin(n: number, min: number): number {
  return n < min ? min : n;
}
function moneyPLN(n: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(n);
}
type StoredState = {
  budget: number;
  items: Item[];
};

function loadStoredState(): StoredState | null {
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
function isStoredState(x: unknown): x is StoredState {
  if (!x || typeof x !== "object") return false;

  const obj = x as Record<string, unknown>;
  if (typeof obj.budget !== "number") return false;
  if (!Array.isArray(obj.items)) return false;

  // Minimalna walidacja elementów listy (żeby nie wywalić UI na złym storage)
  for (const it of obj.items) {
    if (!it || typeof it !== "object") return false;
    const item = it as Record<string, unknown>;

    if (typeof item.id !== "string") return false;
    if (typeof item.name !== "string") return false;
    if (typeof item.category !== "string") return false;
    if (typeof item.price !== "number") return false;
    if (typeof item.qty !== "number") return false;
    if (typeof item.bought !== "boolean") return false;
  }

  return true;
}

export default function App() {
  const [budget, setBudget] = useState<number>(() => {
  const stored = loadStoredState();
  return stored?.budget ?? 5000;
});

const [items, setItems] = useState<Item[]>(() => {
  const stored = loadStoredState();
  return stored?.items ?? [];
});

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [qty, setQty] = useState<number>(1);
  const [category, setCategory] = useState<Category>("Rachunki");

  

  useEffect(() => {
    const payload: StoredState = { budget, items };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
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
    localStorage.removeItem(STORAGE_KEY);
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
      price: numericPrice,
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
        <header className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold">Planer budżetu domowego</h1>
            <p className="text-slate-400 text-sm mt-1">
              Planowane wydatki vs. faktycznie opłacone — z zapisem w localStorage.
            </p>
          </div>

          <button
            onClick={resetAll}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700"
          >
            Reset danych
          </button>
        </header>

        
        <div className="p-4 rounded-xl border border-slate-800 bg-stone-900 space-y-3">
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2">
              <span className="text-slate-200">Budżet miesięczny:</span>
              <input
                type="number"
                min={0}
                step={1}
                value={budget}
                onChange={(e) =>
                  setBudget(clampMin(Number(e.target.value), 0))
                }
                className="px-3 py-2 rounded bg-black border border-slate-700 w-44"
              />
              <span className="text-slate-300">PLN</span>
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div
              className={`p-3 rounded-lg border ${
                totals.plannedOver
                  ? "border-red-700 bg-red-950/30"
                  : "border-slate-800 bg-black/20"
              }`}
            >
              <div className="text-sm text-slate-300">Po planowanych wydatkach</div>
              <div className="mt-1">
                <div className="text-slate-200">
                  Plan: <b className="text-white">{moneyPLN(totals.plannedTotal)}</b>
                </div>
                <div className="text-slate-200">
                  Zostanie:{" "}
                  <b className={totals.plannedOver ? "text-red-300" : "text-green-300"}>
                    {moneyPLN(totals.plannedRemaining)}
                  </b>
                </div>
              </div>
            </div>

            <div
              className={`p-3 rounded-lg border ${
                totals.actualOver
                  ? "border-red-700 bg-red-950/30"
                  : "border-slate-800 bg-black/20"
              }`}
            >
              <div className="text-sm text-slate-300">Rzeczywiście zostało teraz</div>
              <div className="mt-1">
                <div className="text-slate-200">
                  Wydane: <b className="text-white">{moneyPLN(totals.spentTotal)}</b>
                </div>
                <div className="text-slate-200">
                  Do dyspozycji:{" "}
                  <b className={totals.actualOver ? "text-red-300" : "text-green-300"}>
                    {moneyPLN(totals.actualRemaining)}
                  </b>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            * „Po planowanych wydatkach” odejmuje wszystkie wpisy. „Rzeczywiście zostało”
            odejmuje tylko opłacone/kupione.
          </p>
        </div>

        
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


