import React, { useRef, useState } from 'react';
import API from '../api';

export default function ImageUploader({ onDone, onClose }) {
  const inputRef = useRef();
  const [uploading, setUploading] = useState(false);

  const onFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    setUploading(true);
    try {
      const res = await API.post('/products/upload-image', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
      onDone(res.data.imageUrl);
    } catch (err) {
      alert('Upload failed');
    } finally { setUploading(false); }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="mb-2">Upload Image</h3>
        <input ref={inputRef} type="file" accept="image/*" onChange={onFile} />
        <div className="mt-3 flex gap-2">
          <button onClick={()=>inputRef.current?.click()} className="px-3 py-1 border rounded">{uploading ? 'Uploading...' : 'Choose File'}</button>
          <button onClick={onClose} className="px-3 py-1 border rounded">Close</button>
        </div>
      </div>
    </div>
  );
}
