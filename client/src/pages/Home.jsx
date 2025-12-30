import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Camera } from 'lucide-react';

import { MOCK_EVENTS } from '../data/mockData';

const Home = () => {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAccess = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/access-event', { accessCode });
      localStorage.setItem('eventToken', res.data.eventToken);
      navigate(`/gallery/${res.data.eventId}`);
    } catch (err) {
      // Mock logic for demo if server fails
      const mockEvent = MOCK_EVENTS.find(e => e.accessCode === accessCode);
      if (mockEvent || accessCode.startsWith('MOCK')) {
        navigate(`/gallery/${mockEvent ? mockEvent.id : '1'}`);
        return;
      }
      setError(err.response?.data?.message || 'Invalid Access Code');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10">
        <Camera className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">写真を探す</h1>
        <p className="text-gray-600">学校から配布されたアクセスコードを入力してください。</p>
      </div>

      <form onSubmit={handleAccess} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg mb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">アクセスコード</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="例: SCHOOL-123"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button className="w-full bg-primary text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition">
          写真を見る
        </button>
      </form>

      {/* Mock Data Helper */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-sm text-yellow-800 max-w-md w-full">
        <p className="font-bold mb-2 text-center">🔐 デモ用アクセスコード (お試しください):</p>
        <div className="grid grid-cols-2 gap-2">
          {MOCK_EVENTS.map(ev => (
            <div key={ev.id} className="bg-white px-2 py-1 rounded border text-center font-mono cursor-pointer hover:bg-yellow-100"
              onClick={() => setAccessCode(ev.accessCode)}>
              {ev.accessCode}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
