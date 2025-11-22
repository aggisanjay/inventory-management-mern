import React, { useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post('/auth/register', form);
      alert('Account created! Please log in.');
      window.location.href = '/login';
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-100 to-white">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded bg-indigo-50 text-indigo-600"><UserPlus /></div>
          <h1 className="text-2xl font-semibold">Register</h1>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm text-slate-600">Name</label>
            <input 
              className="w-full px-3 py-2 border rounded mt-1"
              value={form.name}
              onChange={e=>setForm({ ...form, name:e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600">Email</label>
            <input 
              className="w-full px-3 py-2 border rounded mt-1"
              value={form.email}
              onChange={e=>setForm({ ...form, email:e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600">Password</label>
            <input 
              type="password"
              className="w-full px-3 py-2 border rounded mt-1"
              value={form.password}
              onChange={e=>setForm({ ...form, password:e.target.value })}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
          >
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{' '}
          <Link className="text-indigo-600 hover:underline" to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
