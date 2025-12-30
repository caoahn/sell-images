import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { LogOut, User, Camera, ShoppingCart } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-blue-700 transition">
          <Camera className="w-8 h-8" />
          <span className="font-bold text-xl">スクールフォト</span>
        </Link>

        <div className="flex gap-4 items-center">
          <Link to="/cart" className="flex items-center gap-1 text-gray-700 hover:text-primary transition font-bold mr-2">
            <ShoppingCart size={24} />
            <span className="hidden sm:inline">カート</span>
          </Link>

          {isAuthenticated ? (
            <>
              <span className="hidden md:inline text-gray-700 font-medium">こんにちは、{user?.fullName || 'ユーザー'}様</span>

              {user?.role === 'PHOTOGRAPHER' && (
                <Link to="/dashboard" className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-bold transition">
                  ダッシュボード
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-bold transition"
              >
                <LogOut size={18} />
                <span className="font-bold">ログアウト</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-5 py-2 text-gray-600 font-bold hover:text-primary transition">
                ログイン
              </Link>
              <Link to="/register" className="px-5 py-2 bg-primary text-white rounded-lg font-bold shadow hover:bg-blue-700 transition transform hover:-translate-y-0.5">
                新規登録
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
