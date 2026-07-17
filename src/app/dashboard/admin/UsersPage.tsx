import { useState } from "react";
import { Search, Eye, Edit2, Ban, Trash2, CheckCircle } from "lucide-react";
import { ADMIN_USERS } from "./adminData";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(ADMIN_USERS.map(u => [u.id, u.status]))
  );

  const filtered = ADMIN_USERS.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: string) =>
    setStatuses(prev => ({ ...prev, [id]: prev[id] === "Active" ? "Blocked" : "Active" }));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Manage</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Users</h2>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={13} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e9e9e]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…" className="w-full border border-[#ececec] pl-8 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#d4145a] bg-white" />
        </div>
      </div>

      <div className="bg-white border border-[#ececec] overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-[#ececec]">
              {["User", "Email", "Phone", "Orders", "Joined", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const status = statuses[u.id];
              return (
                <tr key={u.id} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                      <span className="text-xs font-medium text-[#1a1a1a]">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6e6e6e]">{u.email}</td>
                  <td className="px-4 py-3 text-xs text-[#6e6e6e]">{u.phone}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-[#1a1a1a]">{u.orders}</td>
                  <td className="px-4 py-3 text-xs text-[#6e6e6e]">{u.joined}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${status === "Active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>{status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button className="p-1.5 text-[#6e6e6e] hover:text-blue-600 transition-colors" title="View"><Eye size={13} strokeWidth={1.5} /></button>
                      <button className="p-1.5 text-[#6e6e6e] hover:text-[#d4145a] transition-colors" title="Edit"><Edit2 size={13} strokeWidth={1.5} /></button>
                      <button onClick={() => toggle(u.id)} className={`p-1.5 transition-colors ${status === "Active" ? "text-[#6e6e6e] hover:text-amber-500" : "text-[#6e6e6e] hover:text-green-600"}`} title={status === "Active" ? "Block" : "Activate"}>
                        {status === "Active" ? <Ban size={13} strokeWidth={1.5} /> : <CheckCircle size={13} strokeWidth={1.5} />}
                      </button>
                      <button className="p-1.5 text-[#6e6e6e] hover:text-red-500 transition-colors" title="Delete"><Trash2 size={13} strokeWidth={1.5} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-12 text-center text-xs text-[#9e9e9e]">No users found.</div>}
      </div>
    </div>
  );
}
