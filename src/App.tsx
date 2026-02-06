import { useState, useMemo, useEffect } from "react"
import type { Category, Item, ItemId,  } from "./types/budget";
import { CATEGORIES } from "./types/budget";
import { clampMin } from "./utils/number";
import { loadBudgetState, saveBudgetState } from "./utils/storage";
import { Header } from "./components/Header";
import { BudgetSummary } from "./components/BudgetSummary";
import { ExpenseForm } from "./components/ExpenseForm";
import { ExpenseList } from "./components/ExpenseList";

function makeId(): ItemId{
  return crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
}

const DEFAULT_BUDGET = 5000;



export default function App() {
//żeby localStorage czytany tylko raz (na mount)
 const [budget, setBudget] = useState<number>(() => {
    const initial = loadBudgetState();
    return initial?.budget ?? DEFAULT_BUDGET;
  });

  const [items, setItems] = useState<Item[]>(() => {
    const initial = loadBudgetState();
    return initial?.items ?? [];
  });
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
    const nextBudget = DEFAULT_BUDGET;
    setBudget(nextBudget);
    setItems([]);
    setName("");
    setCategory("Rachunki");
    setPrice("");
    setQty(1);
    saveBudgetState({ budget: nextBudget, items: [] });
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

        <ExpenseForm
  name={name}
  setName={setName}
  price={price}
  setPrice={setPrice}
  qty={qty}
  setQty={setQty}
  category={category}
  setCategory={setCategory}
  onSubmit={handleSubmit}
  categories={CATEGORIES}
/>
<ExpenseList
  items={items}
  onToggleBought={toggleBought}
  onRemove={removeItem}
  onUpdateQty={updateQty}
/>

      </div>
    </div>
  );
}


