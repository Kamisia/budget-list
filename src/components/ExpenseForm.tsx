import type { Category } from "../types/budget";
import { clampMin } from "../utils/number";

type ExpenseFormProps = {
  name: string;
  setName: (v: string) => void;

  price: string;
  setPrice: (v: string) => void;

  qty: number;
  setQty: (v: number) => void;

  category: Category;
  setCategory: (v: Category) => void;

  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  categories: Category[];
};

export function ExpenseForm({
  name,
  setName,
  price,
  setPrice,
  qty,
  setQty,
  category,
  setCategory,
  onSubmit,
  categories,
}: ExpenseFormProps) {
  return (
    <div className="p-4 rounded-xl border border-slate-800 bg-stone-900 space-y-3">
      <h2 className="text-xl font-semibold">Dodaj planowany wydatek</h2>

      <form onSubmit={onSubmit} className="flex gap-3 flex-wrap">
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
