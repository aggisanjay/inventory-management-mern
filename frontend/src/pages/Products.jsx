import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ProductTable from '../components/ProductTable';
import HistoryDrawer from '../components/HistoryDrawer';
import ImportModal from '../components/ImportModal';
import API from '../api';
import { LogOut } from 'lucide-react';
import { clearAuth, getUser } from '../auth';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page:1, limit:10, total:0 });
  const [query, setQuery] = useState({ search:'', category:'', sort:'id', order:'ASC', page:1 });
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [showImport, setShowImport] = useState(false);

  const fetchProducts = async (overrides = {}) => {
    const q = { ...query, ...overrides };
    setQuery(q);
    const params = new URLSearchParams({
      page: q.page, limit: q.limit, sort: q.sort, order: q.order,
      ...(q.category ? { category: q.category } : {}),
      ...(q.search ? { search: q.search } : {})
    }).toString();

    try {
      const res = await API.get(`/products?${params}`);
      setProducts(res.data.data || res.data);
      setPageInfo({ page: res.data.page || q.page, limit: res.data.limit || q.limit, total: res.data.total || (res.data.data?.length || 0) });
    } catch (err) {
      console.error(err);
      alert('Failed to fetch products');
    }
  };

  useEffect(()=>{ fetchProducts(); /* eslint-disable-next-line */ }, []);

  const onLogout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar onImport={() => setShowImport(true)} onLogout={onLogout} />
      <div className="flex-1">
        <Navbar user={getUser()} query={query} setQuery={q=>fetchProducts(q)} />
        <main className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Products</h2>
            <div className="flex gap-2">
              <button onClick={() => fetchProducts({ page:1 })} className="px-3 py-1 border rounded">Refresh</button>
              <button onClick={()=>onLogout()} className="px-3 py-1 border rounded flex items-center gap-2"><LogOut size={16}/> Logout</button>
            </div>
          </div>

          <ProductTable
            products={products}
            pageInfo={pageInfo}
            onPageChange={(p)=>fetchProducts({ page: p })}
            onSort={(sort, order)=>fetchProducts({ sort, order })}
            onViewHistory={(id)=>setSelectedHistory(id)}
            onRefresh={()=>fetchProducts()}
          />
        </main>
      </div>

      <HistoryDrawer productId={selectedHistory} onClose={()=>setSelectedHistory(null)} />
      <ImportModal open={showImport} onClose={()=>{ setShowImport(false); fetchProducts(); }} />
    </div>
  );
}
