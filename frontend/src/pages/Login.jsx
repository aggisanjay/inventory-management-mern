import React, { useState } from 'react';
import API from '../api';
import { saveAuth } from '../auth';
import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      saveAuth(res.data.token, res.data.user);
      window.location.href = '/';
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed';

      if (msg === 'Invalid credentials') {
        alert('User not found. Please register.');
        window.location.href = '/register';
        return;
      }

      alert(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-100 to-white">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded bg-indigo-50 text-indigo-600"><LogIn /></div>
          <h1 className="text-2xl font-semibold">Login</h1>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600">Email</label>
            <input className="w-full px-3 py-2 border rounded mt-1" 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600">Password</label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border rounded mt-1" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" disabled={loading} 
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{' '}
          <Link className="text-indigo-600 hover:underline" to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
