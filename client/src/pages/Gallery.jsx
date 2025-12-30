import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { ShoppingCart } from 'lucide-react';
import { MOCK_PHOTOS } from '../data/mockData';

const Gallery = () => {
  const { eventId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await api.get(`/gallery/${eventId}`);
        setPhotos(res.data);
      } catch {
        console.warn('Failed to fetch photos, using mock data');
        setPhotos(MOCK_PHOTOS);
      }
    };
    fetchPhotos();
  }, [eventId]);

  const addToCart = (photo) => {
    setCart([...cart, photo]);
    alert(`Added ${photo.filename} to cart`);
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Event Gallery</h1>
        <button className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded">
          <ShoppingCart />
          <span>Cart ({cart.length})</span>
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="border rounded shadow hover:shadow-lg transition">
            <div className="relative aspect-w-4 aspect-h-3">
              {/* Use full URL for local dev. In real app, might need base URL */}
              <img
                src={`http://localhost:5000/${photo.watermarkUrl}`}
                alt={photo.filename}
                className="object-cover w-full h-full"
                onContextMenu={(e) => e.preventDefault()} // Disable right click
              />
            </div>
            <div className="p-4">
              <p className="font-semibold text-gray-700 truncate text-lg mb-1">{photo.filename}</p>
              <p className="text-primary font-bold mb-3">${photo.price || '5.00'}</p>
              <button
                onClick={() => addToCart(photo)}
                className="mt-2 w-full bg-primary hover:bg-blue-700 text-white py-2 rounded-lg font-bold shadow-md transition-all active:scale-95"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
