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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white border-2 border-black hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal Content */}
        <div className="p-5">
          <div className="h-40 overflow-hidden rounded-md mb-4 relative border-2 border-black">
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
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full px-3 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#99BC85]"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Special Requests
              </label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full px-3 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#99BC85]"
                rows="3"
              ></textarea>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#99BC85] text-white rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full sm:w-auto"
              >
                Add to Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}