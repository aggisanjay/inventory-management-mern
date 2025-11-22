import React, { useRef, useState } from 'react';
import API from '../api';
import { Upload } from 'lucide-react';

export default function ImportModal({ open, onClose }) {
  const fileRef = useRef();
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const onFile = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const fd = new FormData(); fd.append('csvFile', file);
    setLoading(true);
    try {
      const res = await API.post('/products/import', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
      alert(`Added ${res.data.addedCount} skipped ${res.data.skippedCount}`);
      onClose();
    } catch (err) {
      alert('Import failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30">
      <div className="bg-white p-6 rounded shadow w-96">
        <h3 className="mb-2 flex items-center gap-2"><Upload /> Import products (CSV)</h3>
        <p className="text-sm text-slate-600 mb-3">CSV headers: name,unit,category,brand,stock,status,image</p>
        <input ref={fileRef} type="file" accept=".csv" onChange={onFile} />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">Close</button>
        </div>
      </div>
    </div>
  );
}
