import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
  // Mock Data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      photoUrl: 'https://via.placeholder.com/150?text=Watermarked+Photo',
      eventName: '2024年 卒業式',
      photoCode: 'IMG_001',
      type: 'digital', // 'digital', 'print_1015', 'print_1318'
      price: 500,
      quantity: 1,
    },
    {
      id: 2,
      photoUrl: 'https://via.placeholder.com/150?text=Watermarked+Photo+2',
      eventName: '運動会',
      photoCode: 'IMG_002',
      type: 'print_1318',
      price: 300,
      quantity: 2,
    },
  ]);

  const [coupon, setCoupon] = useState('');

  const handleRemove = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, newQty) => {
    if (newQty < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleTypeChange = (id, newType) => {
    // Logic to update price based on type would go here
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, type: newType } : item
      )
    );
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 0; // Logic for coupon
  const total = subtotal - discount;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">ショッピングカート</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Cart Items */}
        <div className="lg:w-2/3 space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-500">カートは空です。<Link to="/" className="text-blue-600 underline">買い物を続ける</Link></p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow flex gap-4 items-center">
                <img src={item.photoUrl} alt="Photo" className="w-24 h-24 object-cover rounded border border-gray-200" />

                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.eventName}</h3>
                  <p className="text-sm text-gray-500">写真コード: {item.photoCode}</p>

                  <div className="mt-2 flex gap-4">
                    <select
                      value={item.type}
                      onChange={(e) => handleTypeChange(item.id, e.target.value)}
                      className="border rounded p-1 text-sm bg-gray-50"
                    >
                      <option value="digital">デジタルデータ (¥500)</option>
                      <option value="print_1015">プリント 10x15cm (¥150)</option>
                      <option value="print_1318">プリント 13x18cm (¥300)</option>
                    </select>

                    {item.type !== 'digital' && (
                      <div className="flex items-center gap-2">
                        <label className="text-sm">数量:</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                          className="border rounded p-1 w-16 text-center"
                          min="1"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-blue-600 ml-4">¥{(item.price * item.quantity).toLocaleString()}</p>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 text-sm mt-2 hover:underline"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow sticky top-4">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">注文概要</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>小計:</span>
                <span>¥{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>割引:</span>
                <span>-¥{discount.toLocaleString()}</span>
              </div>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="クーポンコードを入力"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="w-full border rounded p-2 text-sm"
              />
            </div>

            <div className="flex justify-between text-xl font-bold border-t pt-4 mb-6">
              <span>合計:</span>
              <span className="text-red-600">¥{total.toLocaleString()}</span>
            </div>

            <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg shadow-lg transition duration-200">
              レジに進む
            </button>

            {/* Upsell */}
            <div className="mt-6 bg-blue-50 p-3 rounded border border-blue-100 text-sm text-blue-800">
              <span className="font-bold">✨ ヒント:</span> あと1枚購入すると、注文合計から10%OFFになります！
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
