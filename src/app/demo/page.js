"use client";

import { useState, useEffect } from "react";
import MenuList from "@/components/main/demo/MenuList";
import OrderList from "@/components/main/demo/OrderList";
import MenuOrderModal from "@/components/modals/demo/MenuOrderModal";
import BillRequestModal from "@/components/modals/demo/BillRequestModal";
import OrderListModal from "@/components/modals/demo/OrderListModal";
import Navbar from "@/components/shared/Navbar";
import Image from "next/image";

export default function Demo() {
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isOrderListModalOpen, setIsOrderListModalOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState(1);

  useEffect(() => {
    async function fetchMenuItems() {
      const response = await fetch("/api/getMenu");
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      }
    }

    fetchMenuItems();
  }, []);

  useEffect(() => {
    async function fetchOrders() {
      const response = await fetch(`/api/getOrder?table=${tableNumber}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    }

    fetchOrders();

    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [tableNumber]);

  const handleMenuItemClick = (item) => {
    setSelectedItem(item);
    setIsOrderModalOpen(true);
  };

  const handleOrderSubmit = async (orderDetails) => {
    // Add to pending orders instead of directly placing the order
    const newPendingOrder = {
      id: Date.now(), // Temporary ID
      menuItem: selectedItem,
      quantity: orderDetails.quantity,
      specialRequests: orderDetails.specialRequests,
    };
    
    setPendingOrders([...pendingOrders, newPendingOrder]);
    setIsOrderModalOpen(false);
  };

  const handleConfirmOrders = async () => {
    // Place all pending orders
    for (const order of pendingOrders) {
      await fetch("/api/menuOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableNumber,
          menuItemId: order.menuItem.id,
          quantity: order.quantity,
          specialRequests: order.specialRequests,
        }),
      });
    }

    // Clear pending orders and refresh the orders list
    setPendingOrders([]);
    const response = await fetch(`/api/getOrder?table=${tableNumber}`);
    if (response.ok) {
      const data = await response.json();
      setOrders(data);
    }
    setIsOrderListModalOpen(false);
  };

  const handleRequestBill = async () => {
    await fetch("/api/billingRequest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableNumber }),
    });
    setIsBillModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF1E6]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold text-highlight border-2 border-black bg-white px-4 py-2 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] w-full sm:w-auto text-center sm:text-left">Table #{tableNumber}</h2>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={() => setIsOrderListModalOpen(true)}
              className="px-4 py-2 bg-[#99BC85] text-white rounded-md hover:bg-opacity-90 transition-colors border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full sm:w-auto text-sm sm:text-base"
            >
              Your Orders ({pendingOrders.length})
            </button>
            <button
              onClick={() => setIsBillModalOpen(true)}
              className="px-4 py-2 bg-[#99BC85] text-white rounded-md hover:bg-opacity-90 transition-colors border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full sm:w-auto text-sm sm:text-base"
            >
              Request Bill
            </button>
          </div>
        </div>

        <MenuList items={menuItems} onItemClick={handleMenuItemClick} />

        {orders.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-center mb-4">
              <h2 className="text-xl font-semibold text-highlight border-2 border-black bg-white px-4 py-2 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block">Confirmed Orders</h2>
            </div>
            <OrderList orders={orders} />
          </div>
        )}

        {isOrderModalOpen && selectedItem && (
          <MenuOrderModal
            item={selectedItem}
            onClose={() => setIsOrderModalOpen(false)}
            onSubmit={handleOrderSubmit}
          />
        )}

        {isBillModalOpen && (
          <BillRequestModal
            tableNumber={tableNumber}
            onClose={() => setIsBillModalOpen(false)}
            onRequestBill={handleRequestBill}
          />
        )}

        {isOrderListModalOpen && (
          <OrderListModal
            pendingOrders={pendingOrders}
            onClose={() => setIsOrderListModalOpen(false)}
            onConfirmOrders={handleConfirmOrders}
            onRequestBill={() => {
              setIsOrderListModalOpen(false);
              setIsBillModalOpen(true);
            }}
          />
        )}
      </div>
    </div>
  );
}
