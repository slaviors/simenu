import { useState } from "react";
import Image from "next/image";

export default function OrderManagementPanel({ orders, onUpdateStatus }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const ordersByTable = orders
    .filter((order) => {
      if (statusFilter !== "all" && order.status !== statusFilter) return false;

      if (searchTerm) {
        const tableMatch = order.table_number.toString().includes(searchTerm);
        const itemMatch = order.items.some((item) =>
          item.menu_item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (!tableMatch && !itemMatch) return false;
      }

      return true;
    })
    .reduce((grouped, order) => {
      (grouped[order.table_number] = grouped[order.table_number] || []).push(
        order
      );
      return grouped;
    }, {});

  const getStatusBadgeClass = (status) => {
    const classes = {
      pending: "bg-yellow-100 text-yellow-800",
      preparing: "bg-blue-100 text-blue-800",
      ready: "bg-green-100 text-green-800",
      delivered: "bg-purple-100 text-purple-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return classes[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex space-x-2 overflow-x-auto pb-2 w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              statusFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              statusFilter === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter("preparing")}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              statusFilter === "preparing"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Preparing
          </button>
          <button
            onClick={() => setStatusFilter("ready")}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              statusFilter === "ready"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Ready
          </button>
          <button
            onClick={() => setStatusFilter("delivered")}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              statusFilter === "delivered"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Delivered
          </button>
        </div>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search table or menu item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {Object.keys(ordersByTable).length > 0 ? (
          Object.entries(ordersByTable).map(([tableNumber, tableOrders]) => (
            <div
              key={tableNumber}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-800">
                  Table #{tableNumber}
                </h3>
              </div>

              <div className="divide-y">
                {tableOrders.map((order) => (
                  <div key={order.id} className="p-6">
                    <div className="flex justify-between mb-4">
                      <span className="text-sm text-gray-500">
                        Order #{order.id} •{" "}
                        {new Date(order.order_time).toLocaleString()}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 relative">
                              <Image
                                src={item.menu_item.imageUrl}
                                alt={item.menu_item.name}
                                fill
                                className="rounded-full object-cover"
                                sizes="40px"
                              />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">
                                {item.menu_item.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity}
                              </p>
                              {item.special_requests && (
                                <p className="text-xs text-gray-500">
                                  Note: {item.special_requests}
                                </p>
                              )}
                            </div>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            $
                            {(
                              parseFloat(item.menu_item.price) * item.quantity
                            ).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-between">
                      {order.bill_requested && (
                        <div className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm">
                          Bill Requested
                        </div>
                      )}

                      <div className="flex space-x-3 ml-auto">
                        {order.status !== "completed" &&
                          order.status !== "cancelled" && (
                            <button
                              onClick={() =>
                                onUpdateStatus(order.id, "cancelled")
                              }
                              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                              Cancel Order
                            </button>
                          )}

                        {order.status === "pending" && (
                          <button
                            onClick={() =>
                              onUpdateStatus(order.id, "preparing")
                            }
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          >
                            Start Preparing
                          </button>
                        )}
                        {order.status === "preparing" && (
                          <button
                            onClick={() => onUpdateStatus(order.id, "ready")}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                          >
                            Mark as Ready
                          </button>
                        )}
                        {order.status === "ready" && (
                          <button
                            onClick={() =>
                              onUpdateStatus(order.id, "delivered")
                            }
                            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                          >
                            Mark as Delivered
                          </button>
                        )}
                        {order.status === "delivered" && (
                          <button
                            onClick={() =>
                              onUpdateStatus(order.id, "completed")
                            }
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                          >
                            Complete Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "No orders match your search/filter criteria"
                : "No orders available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
