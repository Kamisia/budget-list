import type { Item, ItemId } from "../types/budget";
import { moneyPLN } from "../utils/money";

type ExpenseRowProps = {
  item: Item;
  onToggleBought: (id: ItemId) => void;
  onRemove: (id: ItemId) => void;
  onUpdateQty: (id: ItemId, nextQty: number) => void;
};

export function ExpenseRow({ item, onToggleBought, onRemove, onUpdateQty }: ExpenseRowProps) {
  const rowTotal = item.price * item.qty;

  return (
    <li
      className={`flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-800 bg-black/30 ${
        item.bought ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <input
          type="checkbox"
          checked={item.bought}
          onChange={() => onToggleBought(item.id)}
          className="h-4 w-4"
          title="Opłacone / kupione"
        />

        <div className="min-w-0">
          <div className="font-semibold truncate">
            {item.name}{" "}
            <span className="text-xs text-slate-400 font-normal">
              • {item.category}
            </span>
          </div>

          <div className="text-sm text-slate-300 flex items-center gap-2 flex-wrap">
            <span>{moneyPLN(item.price)}</span>
            <span>×</span>

            <input
              type="number"
              min={1}
              className="px-2 py-1 rounded bg-black border border-slate-700 w-20"
              value={item.qty}
              disabled={item.bought}
              onChange={(e) => onUpdateQty(item.id, Number(e.target.value))}
            />

            <span>=</span>
            <span>
              <b>{moneyPLN(rowTotal)}</b>
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500"
      >
        Usuń
      </button>
    </li>
  );
}
