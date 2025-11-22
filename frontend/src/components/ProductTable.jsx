// import React, { useState, useEffect } from 'react';
// import ProductRow from './ProductRow';
// import API from '../api';

// export default function ProductTable({ products, pageInfo, onPageChange, onSort, onViewHistory, onRefresh }) {
//   const [local, setLocal] = useState(products || []);
//   const [sortField, setSortField] = useState('id');
//   const [sortOrder, setSortOrder] = useState('ASC');

//   useEffect(()=>setLocal(products), [products]);

//   const toggleSort = (field) => {
//     const order = (sortField === field && sortOrder === 'ASC') ? 'DESC' : 'ASC';
//     setSortField(field); setSortOrder(order);
//     onSort(field, order);
//   };

//   const handleDelete = async (id) => {
//     if (!confirm('Delete product?')) return;
//     await API.delete(`/products/${id}`);
//     onRefresh();
//   };

//   return (
//     <div className="bg-white shadow rounded">
//       <table className="w-full table-auto">
//         <thead className="text-sm text-slate-600 bg-slate-50">
//           <tr>
//             <th className="p-3 text-left cursor-pointer" onClick={()=>toggleSort('name')}>Name</th>
//             <th className="p-3 text-left cursor-pointer" onClick={()=>toggleSort('category')}>Category</th>
//             <th className="p-3 text-left cursor-pointer" onClick={()=>toggleSort('brand')}>Brand</th>
//             <th className="p-3 text-left cursor-pointer" onClick={()=>toggleSort('stock')}>Stock</th>
//             <th className="p-3">Status</th>
//             <th className="p-3">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {local.map(p => (
//             <ProductRow key={p.id} product={p} onDelete={()=>handleDelete(p.id)} onSaved={onRefresh} onViewHistory={()=>onViewHistory(p.id)} />
//           ))}
//         </tbody>
//       </table>

//       <div className="p-3 flex items-center justify-between">
//         <div>Showing {local.length} items</div>
//         <div className="flex items-center gap-2">
//           <button onClick={()=>onPageChange(Math.max(1, pageInfo.page-1))} className="px-3 py-1 border rounded">Prev</button>
//           <div>Page {pageInfo.page}</div>
//           <button onClick={()=>onPageChange(pageInfo.page+1)} className="px-3 py-1 border rounded">Next</button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import ProductRow from './ProductRow';
import API from '../api';

export default function ProductTable({ products, pageInfo, onPageChange, onSort, onViewHistory, onRefresh }) {
  const [local, setLocal] = useState(products || []);
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('ASC');

  useEffect(() => setLocal(products), [products]);

  const toggleSort = (field) => {
    const order = (sortField === field && sortOrder === 'ASC') ? 'DESC' : 'ASC';
    setSortField(field);
    setSortOrder(order);
    onSort(field, order);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete product?')) return;
    await API.delete(`/products/${id}`);
    onRefresh();
  };

  return (
    <div className="bg-white shadow rounded">
      <table className="w-full table-fixed">
        <thead className="text-sm text-slate-600 bg-slate-50">
          <tr>
            <th className="p-3 text-left w-[25%] cursor-pointer" onClick={() => toggleSort('name')}>
              Name
            </th>
            <th className="p-3 text-left w-[15%] cursor-pointer" onClick={() => toggleSort('category')}>
              Category
            </th>
            <th className="p-3 text-left w-[15%] cursor-pointer" onClick={() => toggleSort('brand')}>
              Brand
            </th>
            <th className="p-3 text-left w-[10%] cursor-pointer" onClick={() => toggleSort('stock')}>
              Stock
            </th>
            <th className="p-3 text-left w-[10%]">Status</th>
            <th className="p-3 text-left w-[25%]">Actions</th>
          </tr>
        </thead>

        <tbody>
          {local.map((p) => (
            <ProductRow
              key={p.id}
              product={p}
              onDelete={() => handleDelete(p.id)}
              onSaved={onRefresh}
              onViewHistory={() => onViewHistory(p.id)}
            />
          ))}
        </tbody>
      </table>

      <div className="p-3 flex items-center justify-between">
        <div>Showing {local.length} items</div>
        <div className="flex items-center gap-2">
          <button onClick={() => onPageChange(Math.max(1, pageInfo.page - 1))} className="px-3 py-1 border rounded">
            Prev
          </button>
          <div>Page {pageInfo.page}</div>
          <button onClick={() => onPageChange(pageInfo.page + 1)} className="px-3 py-1 border rounded">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
