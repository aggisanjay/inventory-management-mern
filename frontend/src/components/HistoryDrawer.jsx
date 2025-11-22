import React, { useEffect, useState } from 'react';
import API from '../api';

export default function HistoryDrawer({ productId, onClose }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!productId) return;
    API.get(`/products/${productId}/history`).then(r => setLogs(r.data)).catch(()=>setLogs([]));
  }, [productId]);

  if (!productId) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white border-l p-4">
      <div className="flex justify-between items-center mb-4">
        <h3>Inventory History</h3>
        <button onClick={onClose} className="px-2 py-1 border rounded">Close</button>
      </div>

      {logs.length === 0 ? <p>No history found</p> : (
        <div className="space-y-3">
          {logs.map(l => (
            <div className="p-3 border rounded" key={l.id}>
              <div className="text-sm text-slate-500">{new Date(l.change_date).toLocaleString()}</div>
              <div className="mt-1">Old: <strong>{l.old_quantity}</strong> → New: <strong>{l.new_quantity}</strong></div>
              <div className="text-xs text-slate-500 mt-1">User: {l.user_info || '—'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
