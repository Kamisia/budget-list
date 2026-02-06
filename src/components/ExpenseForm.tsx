import { useState } from "react";
import type { Category, NewExpense } from "../types/budget";



type Props = {
  categories: readonly Category[];
  defaultCategory?: Category;
  onAdd: (expense: NewExpense) => void;
};

function clampMin(n: number, min: number) {
  return n < min ? min : n;
}

export default function ExpenseForm({
  categories,
  defaultCategory = "Rachunki",
  onAdd,
}: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>(defaultCategory);
  const [price, setPrice] = useState(""); 
  const [qty, setQty] = useState(1);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedName = name.trim();
    const numericPrice = Number(price);

    if (!trimmedName) return;
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) return;
    if (qty < 1) return;

    onAdd({
      name: trimmedName,
      category,
      price: Number(numericPrice.toFixed(2)),
      qty,
    });

   
    setName("");
    setPrice("");
    setQty(1);
  }

  return (
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
          {categories.map((c) => (
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
  );
}
