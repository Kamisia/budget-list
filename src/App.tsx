import { useState, useMemo, useEffect } from "react"
import { CATEGORIES, type Item} from "./types/budget";
import { clampMin } from "./utils/number";
import { loadBudgetState, saveBudgetState } from "./utils/storage";
import { Header } from "./components/Header";
import { BudgetSummary } from "./components/BudgetSummary";
import  ExpenseForm  from "./components/ExpenseForm.tsx";
import { ExpenseList } from "./components/ExpenseList";

function makeId(): string {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());
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

   function addItem(data: {
    name: string;
    category: Item["category"];
    price: number;
    qty: number;
  }) {
    const newItem: Item = {
      id: makeId(),
      bought: false,
      ...data,
    };

    setItems((prev) => [newItem, ...prev]);
  }
   function removeItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  function toggleBought(id: string) {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, bought: !it.bought } : it
      )
    );
  }
   function updateQty(id: string, nextQty: number) {
    const q = clampMin(nextQty, 1);

    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, qty: q } : it
      )
    );
  }

  function resetAll() {
    localStorage.removeItem("household_budget_v1");

    setBudget(DEFAULT_BUDGET);
    setItems([]);
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
          categories={CATEGORIES}
          onAdd={addItem}
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


