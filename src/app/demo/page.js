"use client";

import { useState, useEffect } from "react";
import MenuList from "@/components/main/demo/MenuList";
import OrderList from "@/components/main/demo/OrderList";
import MenuOrderModal from "@/components/modals/demo/MenuOrderModal";
import BillRequestModal from "@/components/modals/demo/BillRequestModal";
import Image from "next/image";

export default function Demo() {
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
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
    const response = await fetch("/api/menuOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tableNumber,
        menuItemId: selectedItem.id,
        quantity: orderDetails.quantity,
        specialRequests: orderDetails.specialRequests,
      }),
    });

    if (response.ok) {
      const orderResponse = await fetch(`/api/getOrder?table=${tableNumber}`);
      if (orderResponse.ok) {
        const data = await orderResponse.json();
        setOrders(data);
      }
      setIsOrderModalOpen(false);
    }
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
    <div className="container mx-auto px-4 py-8 bg-[#FAF1E6]">
      <div className="flex items-center justify-center mb-8">
        <Image
          src="/image/logo.png"
          alt="Restaurant Logo"
          width={200}
          height={200}
          className="mb-4"
        />
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-highlight">Table #{tableNumber}</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setIsBillModalOpen(true)}
            className="px-4 py-2 bg-[#99BC85] text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            Request Bill
          </button>
        </div>
      </div>

      <MenuList items={menuItems} onItemClick={handleMenuItemClick} />

      {orders.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-highlight">Your Orders</h2>
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
    </div>
  );
}
