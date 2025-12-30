import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';

import { MOCK_CREDENTIALS } from '../data/mockData';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      // Mock Login Logic
      if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
        login({ id: 999, email, role: 'PHOTOGRAPHER', fullName: 'Demo User' }, 'mock-token');
        navigate('/dashboard');
        return;
      }
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">ログイン</h2>
        {error && <p className="text-red-500 mb-4 bg-red-50 p-2 rounded text-sm">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">メールアドレス</label>
          <input
            type="email" placeholder="example@email.com"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-secondary"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">パスワード</label>
          <input
            type="password" placeholder="********"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-secondary"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="w-full bg-secondary hover:bg-yellow-600 text-white py-3 rounded-lg font-bold text-lg shadow transition-colors duration-200">
          ログイン
        </button>
      </form>

      {/* Demo Credentials Helper */}
      <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded text-sm text-blue-900 max-w-sm w-full shadow-sm">
        <p className="font-bold mb-2 text-center">🔑 デモ用アカウント:</p>
        <div className="flex justify-between border-b border-blue-200 py-1">
          <span>Email:</span>
          <span className="font-mono cursor-pointer" onClick={() => setEmail(MOCK_CREDENTIALS.email)}>{MOCK_CREDENTIALS.email}</span>
        </div>
        <div className="flex justify-between py-1">
          <span>Pass:</span>
          <span className="font-mono cursor-pointer" onClick={() => setPassword(MOCK_CREDENTIALS.password)}>{MOCK_CREDENTIALS.password}</span>
        </div>
        <p className="text-xs text-center mt-2 text-blue-500">(クリックで自動入力)</p>
      </div>
    </div>
  );
};

export default Login;
