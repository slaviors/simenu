import Image from 'next/image';

export default function OrderList({ orders }) {
  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      preparing: "bg-blue-100 text-blue-800",
      ready: "bg-green-100 text-green-800",
      delivered: "bg-purple-100 text-purple-800",
      completed: "bg-gray-100 text-gray-800",
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || "bg-gray-100"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Group orders by status and calculate total
  const groupedOrders = orders.reduce((acc, order) => {
    if (!acc[order.status]) {
      acc[order.status] = {
        items: [],
        total: 0
      };
    }
    acc[order.status].items.push(order);
    acc[order.status].total += parseFloat(order.menuItem.price) * order.quantity;
    return acc;
  }, {});

  // Get the overall status (takes the most advanced status)
  const getOverallStatus = () => {
    const statusOrder = ['completed', 'delivered', 'ready', 'preparing', 'pending'];
    for (const status of statusOrder) {
      if (groupedOrders[status]) {
        return status;
      }
    }
    return 'pending';
  };

  const overallStatus = getOverallStatus();
  const totalAmount = Object.values(groupedOrders).reduce((sum, group) => sum + group.total, 0);

  return (
    <div className="bg-white rounded-lg border-2 border-black p-6 max-w-md mx-auto shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
      {/* Receipt Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#99BC85]">Order Receipt</h2>
        <p className="text-sm text-gray-500">Table #{orders[0]?.tableNumber || '1'}</p>
        <div className="mt-2">
          {getStatusBadge(overallStatus)}
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-4">
        {Object.entries(groupedOrders).map(([status, group]) => (
          <div key={status} className="border-b border-gray-200 pb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-[#99BC85]">{status.charAt(0).toUpperCase() + status.slice(1)}</h3>
              <span className="text-sm text-gray-500">${group.total.toFixed(2)}</span>
            </div>
            {group.items.map((order) => (
              <div key={order.id} className="flex justify-between items-start py-2">
                <div className="flex items-start space-x-3">
                  <div className="h-10 w-10 relative flex-shrink-0">
                    <Image
                      src={order.menuItem.imageUrl}
                      alt={order.menuItem.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{order.menuItem.name}</p>
                    <p className="text-sm text-gray-500">Qty: {order.quantity}</p>
                    {order.specialRequests && (
                      <p className="text-xs text-gray-500 italic">Note: {order.specialRequests}</p>
                    )}
                  </div>
                </div>
                <p className="text-sm font-medium">
                  ${(parseFloat(order.menuItem.price) * order.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Receipt Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Subtotal</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Tax (10%)</span>
          <span>${(totalAmount * 0.1).toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-lg font-bold text-[#99BC85]">
          <span>Total</span>
          <span>${(totalAmount * 1.1).toFixed(2)}</span>
        </div>
      </div>

      {/* Receipt Bottom */}
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>Thank you for dining with us!</p>
        <p className="mt-1">Order ID: {orders[0]?.id || 'N/A'}</p>
      </div>
    </div>
  );
}