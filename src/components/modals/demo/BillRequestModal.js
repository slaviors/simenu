import { useState } from 'react';

export default function BillRequestModal({ tableNumber, onClose, onRequestBill }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onRequestBill();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative mx-auto p-5 border-2 border-black w-full max-w-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-md bg-white">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Request Bill</h3>
        <p className="text-gray-600 mb-4">
          Are you sure you want to request the bill for Table #{tableNumber}?
        </p>
        
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#99BC85] text-white rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            disabled={isLoading}
          >
            {isLoading ? 'Requesting...' : 'Request Bill'}
          </button>
        </div>
      </div>
    </div>
  );
}