import { useState } from "react"
type ItemId = string;
interface Item {
  id:ItemId;
  name:string;
  price:number;
  qty:number;
  bought:boolean;
}
function makeId():ItemId{
  return crypto.randomUUID ? crypto.randomUUID() : String(Data.now() + Math.random());
}
function clampMin(n: number, min: number): number {
  return n < min ? min : n;
}
export default function App() {
  const [budget, setBudget] = useState<number>(200);
  const [items, setItems] = useState<Item[]>([]);

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [qty, setQty] = useState<number>(1);


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
  function updateQty(id: ItemId, qty: number): void {
  setItems(prev =>
    prev.map(it =>
      it.id === id ? { ...it, qty } : it
    )
  );
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
        <h1 className="text-3xl font-bold">Budget Grocery Planner</h1>
      <div className = "bg-stone-900 p-4 rounded-xl border border-slate-800 space-y-4 ">
        <div className="flex flex-col gap-3 items-center">
          <span className="text-lg"> Budżet: <b> {budget} PLN</b></span>
          <button onClick={()=> setBudget(b => b+10)} className="px-3 py-1 bg-blue-600 rounded-lg hover:bg-blue-500">
            +10 PLN
          </button>
          <form onSubmit = {handleSubmit} className="flex gap-3 flex-wrap ">
             <input
              className="px-3 py-2 rounded bg-black border border-slate-700"
              placeholder="Nazwa"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            />
            <input type="number" step= "0.01" className="px-3 py-2 rounded bg-black border border-slate-700" placeholder="Cena" value={price} onChange={(e:React.ChangeEvent<HTMLInputElement>)=> setPrice(e.target.value)}/>
            <input
              type="number"
              min={1}
              className="px-3 py-2 rounded bg-black border border-slate-700 w-24"
              value={qty}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQty(Number(e.target.value))
              }
            />


            <button
              type="submit"
              className="px-3 py-2 bg-green-600 rounded-lg hover:bg-green-500"
            >
              Dodaj
            </button>

          </form>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Lista produktów</h2>
            {items.length === 0 ? (
              <p> Brak produktów na liście - dodaj za pomocą formularza</p>
            ): (<ul className="space-y-2">
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
                        />

                        <div className="min-w-0">
                          <div className="font-semibold truncate">{it.name}</div>

                          <div className="text-sm text-slate-300 flex items-center gap-2 flex-wrap">
                            <span>Cena: {it.price.toFixed(2)} PLN</span>
                            <span>•</span>

                            <label className="flex items-center gap-2">
                              Ilość:
                              <input
                                type="number"
                                min={1}
                                className="px-2 py-1 rounded bg-black border border-slate-700 w-20"
                                value={it.qty}
                                disabled={it.bought}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => updateQty(it.id, Number(e.target.value))}
                              />
                            </label>

                            <span>•</span>
                            <span>
                              Razem: <b>{rowTotal.toFixed(2)} PLN</b>
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
              </ul>) }
          </div>

        </div>
<pre className="bg-black p-3 rounded-lg text-sm overflow-auto">{JSON.stringify({budget, items}, null, 2)}</pre>

      </div>

      </div>
    </div>
  )
}


