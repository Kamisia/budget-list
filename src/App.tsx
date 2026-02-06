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

export default function App() {
  const [budget, setBudget] = useState<number>(200);
  const [items, setItems] = useState<Item[]>([]);

  function addItem(): void{
    const newItem:Item ={
      id:makeId(),
      name:"Mleko",
      price:4.99,
      qty:2,
      bought:false,
    };
    setItems(prev =>[newItem, ...prev])
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
  return (
    <div className="min-h-screen bg-stone-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Budget Grocery Planner</h1>
      <div className = "bg-stone-900 p-4 rounded-xl border border-slate-800 space-y-4">
        <div className="flex gap-3 items-center">
          <span className="text-lg"> Budżet: <b> {budget} PLN</b></span>
          <button onClick={()=> setBudget(b => b+10)} className="px-3 py-1 bg-blue-600 rounded-lg hover:bg-blue-500">
            +10 PLN
          </button>
          <button onClick={addItem} className="px-3 py-1 bg-green-600 rounded-lg hover:bg-green-500">
            Dodaj produkt
          </button>
        </div>
<pre className="bg-black p-3 rounded-lg text-sm overflow-auto">{JSON.stringify({budget, items}, null, 2)}</pre>

      </div>

      </div>
    </div>
  )
}


