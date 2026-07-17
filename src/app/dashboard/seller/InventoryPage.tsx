import { useState } from "react";
import { SELLER_PRODUCTS, INVENTORY_HISTORY, fmt } from "./sellerData";

export default function InventoryPage() {
  const [stocks, setStocks] = useState<Record<string, number>>(
    Object.fromEntries(SELLER_PRODUCTS.map(p => [p.id, p.stock]))
  );
  const [editing, setEditing] = useState<string | null>(null);
  const [editVal, setEditVal] = useState(0);

  const startEdit = (id: string) => {
    setEditing(id);
    setEditVal(stocks[id]);
  };
  const saveEdit = (id: string) => {
    setStocks(prev => ({ ...prev, [id]: editVal }));
    setEditing(null);
  };

  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Stock</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Inventory</h2>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-[#ececec] overflow-x-auto mb-6">
        <div className="px-5 py-4 border-b border-[#ececec]">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">Current Stock Levels</p>
        </div>
        <table className="w-full min-w-[650px]">
          <thead>
            <tr className="border-b border-[#ececec]">
              {["Product", "SKU", "Category", "Current Stock", "Low Stock Alert", "Status", "Action"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SELLER_PRODUCTS.map(p => (
              <tr key={p.id} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.img} alt={p.name} className="w-9 h-11 object-cover bg-[#faf7f4] flex-shrink-0" />
                    <span className="text-xs font-medium text-[#1a1a1a]">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[10px] text-[#9e9e9e] tracking-wide font-mono">{p.sku}</td>
                <td className="px-4 py-3 text-xs text-[#6e6e6e]">{p.category}</td>
                <td className="px-4 py-3">
                  {editing === p.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editVal}
                        onChange={e => setEditVal(Number(e.target.value))}
                        className="w-20 border border-[#d4145a] px-2 py-1 text-xs text-[#1a1a1a] focus:outline-none"
                        min={0}
                        autoFocus
                      />
                      <button onClick={() => saveEdit(p.id)} className="text-[9px] tracking-[0.1em] uppercase text-green-600 hover:underline font-semibold">Save</button>
                      <button onClick={() => setEditing(null)} className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e] hover:underline">Cancel</button>
                    </div>
                  ) : (
                    <span className={`text-sm font-bold ${stocks[p.id] === 0 ? "text-red-600" : stocks[p.id] <= 10 ? "text-amber-600" : "text-green-700"}`}>
                      {stocks[p.id]}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-[#6e6e6e]">10</td>
                <td className="px-4 py-3">
                  <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${
                    stocks[p.id] === 0 ? "bg-red-50 text-red-600" :
                    stocks[p.id] <= 10 ? "bg-amber-50 text-amber-700" :
                    "bg-green-50 text-green-700"
                  }`}>
                    {stocks[p.id] === 0 ? "Out of Stock" : stocks[p.id] <= 10 ? "Low Stock" : "In Stock"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => startEdit(p.id)} className="text-[10px] tracking-[0.1em] uppercase text-[#d4145a] hover:underline font-semibold">
                    Update Stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inventory History */}
      <div className="bg-white border border-[#ececec]">
        <div className="px-5 py-4 border-b border-[#ececec]">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">Recent</p>
          <p className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Inventory History</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-[#ececec]">
                {["Date", "Product", "SKU", "Type", "Change", "Balance"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INVENTORY_HISTORY.map((row, i) => (
                <tr key={i} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                  <td className="px-4 py-3 text-xs text-[#6e6e6e]">{row.date}</td>
                  <td className="px-4 py-3 text-xs font-medium text-[#1a1a1a]">{row.product}</td>
                  <td className="px-4 py-3 text-[10px] text-[#9e9e9e] tracking-wide font-mono">{row.sku}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${
                      row.type === "Restock" ? "bg-green-50 text-green-700" :
                      row.type === "Return"  ? "bg-blue-50 text-blue-700"  :
                      "bg-[#faf7f4] text-[#6e6e6e]"
                    }`}>{row.type}</span>
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold">
                    <span className={row.qty > 0 ? "text-green-600" : "text-red-600"}>
                      {row.qty > 0 ? `+${row.qty}` : row.qty}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-[#1a1a1a]">{row.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
