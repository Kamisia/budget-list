import { clampMin } from "../utils/number";
import { moneyPLN } from "../utils/money";
import type { Totals } from "../types/budget";


type BudgetSummaryProps = {
  budget: number;
  onBudgetChange: (next: number) => void;
  totals: Totals;
};

export function BudgetSummary({ budget, onBudgetChange, totals }: BudgetSummaryProps) {
  return (
    <div className="p-4 rounded-xl border border-slate-800 bg-stone-900 space-y-3">
      <div className="flex items-center gap-4 flex-wrap">
        <label className="flex items-center gap-2">
          <span className="text-slate-200">Budżet miesięczny:</span>
          <input
            type="number"
            min={0}
            step={1}
            value={budget}
            onChange={(e) => onBudgetChange(clampMin(Number(e.target.value), 0))}
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
  );
}
