import React from 'react';
import { Box, Archive, UploadCloud } from 'lucide-react';

export default function Sidebar({ onImport, onLogout }) {
  return (
    <aside className="w-72 bg-white border-r min-h-screen p-4">
      <div className="mb-8">
        <div className="text-xl font-bold">Inventory</div>
        <div className="text-sm text-slate-500">Admin Dashboard</div>
      </div>

      <nav className="space-y-1">
        <button className="w-full text-left px-3 py-2 rounded hover:bg-slate-50 flex items-center gap-2">
          <Box size={16} /> Dashboard
        </button>

        <button onClick={onImport} className="w-full text-left px-3 py-2 rounded hover:bg-slate-50 flex items-center gap-2">
          <UploadCloud size={16} /> Import
        </button>

        <button onClick={onLogout} className="w-full text-left px-3 py-2 rounded hover:bg-slate-50 flex items-center gap-2">
          <Archive size={16} /> Logout
        </button>
      </nav>
    </aside>
  );
}
