import { useState } from 'react';
import Image from 'next/image';

export default function MenuOrderModal({ item, onClose, onSubmit }) {
  const [quantity, setQuantity] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ quantity, specialRequests });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="h-40 overflow-hidden rounded-t-md -mx-5 -mt-5 mb-4 relative">
          <Image 
            src={item.imageUrl} 
            alt={item.name} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
        <p className="text-gray-600 mt-2">{item.description}</p>
        <p className="font-bold text-lg mt-2">${(parseFloat(item.price) || 0).toFixed(2)}</p>
        
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Quantity
            </label>
            <div className="flex items-center">
              <button 
                type="button"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="px-3 py-1 border rounded-l-md"
              >
                -
              </button>
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                min="1"
                className="w-16 text-center py-1 border-t border-b"
              />
              <button 
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 border rounded-r-md"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Special Requests (optional)
            </label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              rows="3"
              placeholder="E.g., No onions, extra spicy, etc."
            ></textarea>
          </div>
          
          <div className="flex justify-between mt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-[#99BC85] text-white rounded-md"
            >
              Add to Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}