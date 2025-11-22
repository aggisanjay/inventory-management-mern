import React from 'react';
import { Search } from 'lucide-react';

export default function Navbar({ user, query, setQuery }) {
  const onSearch = (e) => {
    setQuery({ ...query, search: e.target.value, page: 1 });
  };

  return (
    <header className="bg-white border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="text-lg font-semibold">Inventory Manager</div>
        <div className="flex items-center bg-slate-100 rounded px-3 py-1 gap-2">
          <Search size={16} />
          <input className="bg-transparent outline-none" placeholder="Search products..." onChange={onSearch} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-sm text-slate-600">Hello, {user?.name || 'Admin'}</div>
      </div>
    </header>
  );
}
