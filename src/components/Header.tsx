type HeaderProps = {
  onReset: () => void;
};

export function Header({ onReset }: HeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-3xl font-bold">Planer budżetu domowego</h1>
        <p className="text-slate-400 text-sm mt-1">
          Planowane wydatki vs. faktycznie opłacone — z zapisem w localStorage.
        </p>
      </div>

      <button
        onClick={onReset}
        className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700"
      >
        Reset danych
      </button>
    </header>
  );
}
