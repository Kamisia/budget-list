import type { Item, ItemId } from "../types/budget";
import  ExpenseRow  from "./ExpenseRow";

type ExpenseListProps = {
  items: Item[];
  onToggleBought: (id: ItemId) => void;
  onRemove: (id: ItemId) => void;
  onUpdateQty: (id: ItemId, nextQty: number) => void;
};

export function ExpenseList({ items, onToggleBought, onRemove, onUpdateQty }: ExpenseListProps) {
  return (
    <div className="p-4 rounded-xl border border-slate-800 bg-stone-900 space-y-3">
      <h2 className="text-xl font-semibold">Wydatki</h2>

      {items.length === 0 ? (
        <p className="text-slate-300">Brak wpisów - dodaj wydatki powyżej.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((it) => (
            <ExpenseRow
              key={it.id}
              item={it}
              onToggleBought={onToggleBought}
              onRemove={onRemove}
              onUpdateQty={onUpdateQty}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
