// import React, { useState } from 'react';
// import API from '../api';
// import ImageUploader from './ImageUploader';
// import { Edit2, Trash, Clock } from 'lucide-react';
// import StockBadge from './StockBadge';

// export default function ProductRow({ product, onDelete, onSaved, onViewHistory }) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [draft, setDraft] = useState({ ...product });
//   const [saving, setSaving] = useState(false);
//   const [showUploader, setShowUploader] = useState(false);

//   const status = (stock) => stock === 0 ? 'Out of Stock' : 'In Stock';

//   const onSave = async () => {
//     setSaving(true);
//     try {
//       await API.put(`/products/${product.id}`, draft);
//       setIsEditing(false);
//       onSaved();
//     } catch (err) {
//       alert(err.response?.data?.error || 'Update failed');
//     } finally { setSaving(false); }
//   };

//   const onUploadComplete = (imageUrl) => {
//     setDraft({ ...draft, image: imageUrl });
//     setShowUploader(false);
//   };

//   return (
//     <tr className="border-t">
//       <td className="p-3">
//         {isEditing ? <input className="w-full border px-2 py-1" value={draft.name} onChange={e=>setDraft({...draft, name:e.target.value})} /> : (
//           <div className="flex items-center gap-3">
//             {product.image ? <img src={product.image.startsWith('/uploads') ? product.image : product.image} alt="" className="w-10 h-10 object-cover rounded" /> : <div className="w-10 h-10 bg-slate-100 rounded" />}
//             <div>{product.name}</div>
//           </div>
//         )}
//       </td>

//       <td className="p-3">{isEditing ? <input className="w-full border px-2 py-1" value={draft.category||''} onChange={e=>setDraft({...draft, category:e.target.value})} /> : product.category}</td>
//       <td className="p-3">{isEditing ? <input className="w-full border px-2 py-1" value={draft.brand||''} onChange={e=>setDraft({...draft, brand:e.target.value})} /> : product.brand}</td>
//       <td className="p-3">{isEditing ? <input type="number" className="w-24 border px-2 py-1" value={draft.stock} onChange={e=>setDraft({...draft, stock:parseInt(e.target.value||0)})} /> : product.stock}</td>
//       <td className="p-3">
//       <StockBadge stock={product.stock} />
//       </td>

//       <td className="p-3 space-x-2">
//         {isEditing ? (
//           <>
//             <button onClick={onSave} disabled={saving} className="px-2 py-1 bg-indigo-600 text-white rounded">Save</button>
//             <button onClick={()=>{ setIsEditing(false); setDraft({...product}); }} className="px-2 py-1 border rounded">Cancel</button>
//             <button onClick={()=>setShowUploader(true)} className="px-2 py-1 border rounded">Upload Image</button>
//           </>
//         ) : (
//           <>
//             <button onClick={()=>setIsEditing(true)} className="px-2 py-1 border rounded flex items-center gap-1"><Edit2 size={14}/>Edit</button>
//             <button onClick={onDelete} className="px-2 py-1 border rounded flex items-center gap-1"><Trash size={14}/>Delete</button>
//             <button onClick={onViewHistory} className="px-2 py-1 border rounded flex items-center gap-1"><Clock size={14}/>History</button>
//           </>
//         )}

//         {showUploader && <ImageUploader onDone={onUploadComplete} onClose={()=>setShowUploader(false)} />}
//       </td>
//     </tr>
//   );
// }

import React, { useState } from 'react';
import API from '../api';
import ImageUploader from './ImageUploader';
import StockBadge from './StockBadge';
import { Edit2, Trash, Clock } from 'lucide-react';

export default function ProductRow({ product, onDelete, onSaved, onViewHistory }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({ ...product });
  const [saving, setSaving] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  const onSave = async () => {
    setSaving(true);
    try {
      await API.put(`/products/${product.id}`, draft);
      setIsEditing(false);
      onSaved();
    } catch (err) {
      alert(err.response?.data?.error || 'Update failed');
    } finally {
      setSaving(false);
    }
  };
  console.log("IMAGE PATH:", product.image);

  const onUploadComplete = (imageUrl) => {
    setDraft({ ...draft, image: imageUrl });
    setShowUploader(false);
  };

  return (
    <tr className="border-t">

      {/* NAME + IMAGE */}
      <td className="p-3">
        {isEditing ? (
          <input
            className="w-full border px-2 py-1 rounded"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
        ) : (
          <div className="flex items-center gap-3">
            {product.image ? (
              <img
  src={
    product.image.startsWith("http")
      ? product.image
      : `http://localhost:4000${product.image}`
  }
  alt=""
  className="w-10 h-10 object-cover rounded"
/>

            ) : (
              <div className="w-10 h-10 bg-slate-200 rounded" />
            )}
            <span>{product.name}</span>
          </div>
        )}
      </td>

      {/* CATEGORY */}
      <td className="p-3">
        {isEditing ? (
          <input
            className="w-full border px-2 py-1 rounded"
            value={draft.category || ''}
            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
          />
        ) : (
          product.category
        )}
      </td>

      {/* BRAND */}
      <td className="p-3">
        {isEditing ? (
          <input
            className="w-full border px-2 py-1 rounded"
            value={draft.brand || ''}
            onChange={(e) => setDraft({ ...draft, brand: e.target.value })}
          />
        ) : (
          product.brand
        )}
      </td>

      {/* STOCK */}
      <td className="p-3">
        {isEditing ? (
          <input
            type="number"
            className="w-24 border px-2 py-1 rounded"
            value={draft.stock}
            onChange={(e) =>
              setDraft({ ...draft, stock: parseInt(e.target.value || 0) })
            }
          />
        ) : (
          product.stock
        )}
      </td>

      {/* STATUS */}
      <td className="p-3">
        <div className="flex items-center justify-start">
          <StockBadge stock={product.stock} />
        </div>
      </td>

      {/* ACTIONS */}
      <td className="p-3">
        <div className="flex items-center gap-2 justify-start">

          {isEditing ? (
            <>
              <button
                onClick={onSave}
                disabled={saving}
                className="px-2 py-1 bg-indigo-600 text-white rounded"
              >
                Save
              </button>

              <button
                onClick={() => {
                  setIsEditing(false);
                  setDraft({ ...product });
                }}
                className="px-2 py-1 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => setShowUploader(true)}
                className="px-2 py-1 border rounded"
              >
                Upload Image
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 flex items-center gap-1"
              >
                <Edit2 size={14} /> Edit
              </button>

              <button
                onClick={onDelete}
                className="px-2 py-1 rounded-md bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 flex items-center gap-1"
              >
                <Trash size={14} /> Delete
              </button>

              <button
                onClick={onViewHistory}
                className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 flex items-center gap-1"
              >
                <Clock size={14} /> History
              </button>
            </>
          )}

          {showUploader && (
            <ImageUploader
              onDone={onUploadComplete}
              onClose={() => setShowUploader(false)}
            />
          )}
        </div>
      </td>
    </tr>
  );
}
