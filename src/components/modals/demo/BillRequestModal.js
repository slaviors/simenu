import { useState } from 'react';

export default function BillRequestModal({ tableNumber, onClose, onRequestBill }) {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/billingRequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableNumber, note })
      });
      
      if (response.ok) {
        onRequestBill(note);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to request bill. Please try again.');
      }
    } catch (error) {
      console.error('Error requesting bill:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Request Bill</h3>
          <p className="text-gray-600">You are about to request the bill for Table #{tableNumber}.</p>
          
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Special Notes (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                rows="3"
                placeholder="Any additional requests for the waiter?"
              ></textarea>
            </div>
            
            <div className="flex justify-between mt-6">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-[#99BC85] text-white rounded-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Confirm Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}