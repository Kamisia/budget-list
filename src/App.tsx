import { useState, useMemo, useEffect } from "react"
import { CATEGORIES, type Item, type NewExpense} from "./types/budget";
import { clampMin } from "./utils/number";
import { loadBudgetState, saveBudgetState, STORAGE_KEY } from "./utils/storage";
import { Header } from "./components/Header";
import { BudgetSummary } from "./components/BudgetSummary";
import ExpenseForm from "./components/ExpenseForm.tsx";
import { ExpenseList } from "./components/ExpenseList";
import { calculateTotals } from "./utils/totals";

function makeId(): string {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());
}

const DEFAULT_BUDGET = 5000;



export default function App() {

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

   const totals = useMemo(
  () => calculateTotals(budget, items),
  [budget, items]
);

const actions = {
  addItem(data: NewExpense) {
     const newItem: Item = {
    id: makeId(),
    bought: false,
    ...data,
  };

  setItems(prev => [newItem, ...prev]);
  },

  removeItem(id: string) {
    setItems(prev => prev.filter(it => it.id !== id));
  },

  toggleBought(id: string) {
    setItems(prev =>
      prev.map(it =>
        it.id === id ? { ...it, bought: !it.bought } : it
      )
    );
  },

  updateQty(id: string, nextQty: number) {
    const q = clampMin(nextQty, 1);
    setItems(prev =>
      prev.map(it =>
        it.id === id ? { ...it, qty: q } : it
      )
    );
  },

  resetAll() {
    localStorage.removeItem(STORAGE_KEY);
    setBudget(DEFAULT_BUDGET);
    setItems([]);
  },
};

   return (
    <div className="min-h-screen bg-stone-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Header onReset={actions.resetAll} />

        <BudgetSummary
            budget={budget}
             onBudgetChange={(next) => setBudget(clampMin(next, 0))}
            totals={totals}/>

        <ExpenseForm
          categories={CATEGORIES}
          onAdd={actions.addItem}
        />
        <ExpenseList
          items={items}
          onToggleBought={actions.toggleBought}
          onRemove={actions.removeItem}
          onUpdateQty={actions.updateQty}
        />

      </div>
    </div>
  );
}


