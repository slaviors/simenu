import { useState } from 'react';
import Image from 'next/image';

export default function OrderListModal({ 
  pendingOrders, 
  onClose, 
  onConfirmOrders,
  onRequestBill 
}) {
  const [isConfirming, setIsConfirming] = useState(false);

  const getTotalPrice = () => {
    return pendingOrders.reduce((total, order) => {
      return total + (parseFloat(order.menuItem.price) * order.quantity);
    }, 0);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Pending Orders</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {pendingOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 relative">
                  <Image
                    src={order.menuItem.imageUrl}
                    alt={order.menuItem.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{order.menuItem.name}</h3>
                  <p className="text-sm text-gray-500">Qty: {order.quantity}</p>
                  {order.specialRequests && (
                    <p className="text-sm text-gray-500">Note: {order.specialRequests}</p>
                  )}
                </div>
              </div>
              <p className="font-medium">
                ${(parseFloat(order.menuItem.price) * order.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Total:</span>
            <span className="font-bold">${getTotalPrice().toFixed(2)}</span>
          </div>

          <div className="flex justify-end space-x-4">
            {!isConfirming ? (
              <>
                <button
                  onClick={() => setIsConfirming(true)}
                  className="px-4 py-2 bg-[#99BC85] text-white rounded-md hover:bg-opacity-90 transition-colors border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  Confirm Orders
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsConfirming(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirmOrders}
                  className="px-4 py-2 bg-[#99BC85] text-white rounded-md hover:bg-opacity-90 transition-colors border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  Confirm & Place Orders
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
