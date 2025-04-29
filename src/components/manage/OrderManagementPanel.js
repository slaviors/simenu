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
      <div className="bg-white rounded-2xl p-4 mb-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="mb-4 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex space-x-2 overflow-x-auto pb-2 w-full sm:w-auto">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap border-2 border-black ${
                statusFilter === "all"
                  ? "bg-[#99BC85] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-gray-700 hover:bg-gray-100 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap border-2 border-black ${
                statusFilter === "pending"
                  ? "bg-yellow-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-gray-700 hover:bg-gray-100 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("preparing")}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap border-2 border-black ${
                statusFilter === "preparing"
                  ? "bg-blue-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-gray-700 hover:bg-gray-100 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              Preparing
            </button>
            <button
              onClick={() => setStatusFilter("ready")}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap border-2 border-black ${
                statusFilter === "ready"
                  ? "bg-green-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-gray-700 hover:bg-gray-100 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              Ready
            </button>
            <button
              onClick={() => setStatusFilter("delivered")}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap border-2 border-black ${
                statusFilter === "delivered"
                  ? "bg-purple-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-gray-700 hover:bg-gray-100 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
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
              className="w-full px-4 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#99BC85] focus:border-transparent"
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
      </div>

      <div className="space-y-6">
        {Object.keys(ordersByTable).length > 0 ? (
          Object.entries(ordersByTable).map(([tableNumber, tableOrders]) => (
            <div
              key={tableNumber}
              className="bg-white rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <div className="bg-[#E4EFE7] px-6 py-4 border-b-2 border-black">
                <h3 className="text-lg font-medium text-[#99BC85]">
                  Table #{tableNumber}
                </h3>
              </div>

              <div className="divide-y divide-gray-200">
                {tableOrders.map((order) => (
                  <div key={order.id} className="p-6">
                    <div className="flex justify-between mb-4">
                      <span className="text-sm text-gray-500">
                        Order #{order.id} •{" "}
                        {new Date(order.order_time).toLocaleString()}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border border-black ${getStatusBadgeClass(
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
                            <div className="h-10 w-10 flex-shrink-0 relative border-2 border-black rounded-full overflow-hidden">
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
                          <p className="text-sm font-medium text-[#99BC85]">
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
                        <div className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm border border-red-300">
                          Bill Requested
                        </div>
                      )}

                      <div className="flex space-x-3 ml-auto">
                        {order.status !== "completed" &&
                          order.status !== "cancelled" && (
                            <button
                              onClick={() =>
                                onUpdateStatus(order.items[0].id, "cancelled")
                              }
                              className="px-4 py-2 bg-red-500 text-white rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                            >
                              Cancel Order
                            </button>
                          )}

                        {order.status === "pending" && (
                          <button
                            onClick={() =>
                              onUpdateStatus(order.items[0].id, "preparing")
                            }
                            className="px-4 py-2 bg-blue-500 text-white rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                          >
                            Start Preparing
                          </button>
                        )}
                        {order.status === "preparing" && (
                          <button
                            onClick={() =>
                              onUpdateStatus(order.items[0].id, "ready")
                            }
                            className="px-4 py-2 bg-green-500 text-white rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                          >
                            Mark as Ready
                          </button>
                        )}
                        {order.status === "ready" && (
                          <button
                            onClick={() =>
                              onUpdateStatus(order.items[0].id, "delivered")
                            }
                            className="px-4 py-2 bg-purple-500 text-white rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                          >
                            Mark as Delivered
                          </button>
                        )}
                        {order.status === "delivered" && (
                          <button
                            onClick={() =>
                              onUpdateStatus(order.items[0].id, "completed")
                            }
                            className="px-4 py-2 bg-gray-500 text-white rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
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
          <div className="text-center p-12 bg-white rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
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
