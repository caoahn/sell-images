import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    role: 'PHOTOGRAPHER' // Defaulting to Photographer for this demo flow
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/auth/register', formData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">新規登録</h2>

        {error && <p className="text-red-500 mb-4 bg-red-50 p-2 rounded text-sm">{error}</p>}
        {success && <p className="text-green-500 mb-4 bg-green-50 p-2 rounded text-sm">{success}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">氏名</label>
          <input
            type="text" name="fullName" required
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.fullName} onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">メールアドレス</label>
          <input
            type="email" name="email" required
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.email} onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">電話番号</label>
          <input
            type="text" name="phone"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.phone} onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">パスワード</label>
          <input
            type="password" name="password" required
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.password} onChange={handleChange}
          />
        </div>

        <button className="w-full bg-primary hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-lg shadow transition-colors duration-200">
          登録する
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">すでにアカウントをお持ちですか？ <Link to="/login" className="text-primary font-bold hover:underline">ログインはこちら</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Register;
