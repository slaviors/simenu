"use client";

import { useState, useEffect } from "react";
import MenuModal from "@/components/modals/manage/MenuModal";
import OrderManagementPanel from "@/components/manage/OrderManagementPanel";
import MenuManagementPanel from "@/components/manage/MenuManagementPanel";
import BillManagementPanel from "@/components/manage/BillManagementPanel";
import Navbar from "@/components/shared/Navbar";
import Image from "next/image";

export default function ManageDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [hasNewOrders, setHasNewOrders] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [billRequests, setBillRequests] = useState([]);
  const [hasPendingBills, setHasPendingBills] = useState(false);

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const response = await fetch("/api/getMenu");
        if (response.ok) {
          const data = await response.json();
          setMenuItems(data);
        } else {
          showNotification("Error loading menu items", "error");
        }
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
        showNotification("Failed to load menu items", "error");
      }
    }

    fetchMenuItems();
  }, []);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("/api/getOrder?all=true");
        if (response.ok) {
          const data = await response.json();

          const hasNew = data.some((order) => order.status === "pending");
          setHasNewOrders(hasNew);

          setOrders(data);
        } else {
          console.error("Error fetching orders:", await response.text());
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    }

    fetchOrders();

    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleAddMenu = () => {
    setEditingMenuItem(null);
    setIsMenuModalOpen(true);
  };

  const handleEditMenu = (menuItem) => {
    setEditingMenuItem(menuItem);
    setIsMenuModalOpen(true);
  };

  const handleMenuSubmit = async (menuData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.keys(menuData).forEach((key) => {
        if (key !== "image" || (key === "image" && menuData.image)) {
          formData.append(key, menuData[key]);
        }
      });

      const response = await fetch("/api/makeMenu", {
        method: editingMenuItem ? "PUT" : "POST",
        body: formData,
      });

      if (response.ok) {
        const menuResponse = await fetch("/api/getMenu");
        if (menuResponse.ok) {
          const data = await menuResponse.json();
          setMenuItems(data);
        }
        setIsMenuModalOpen(false);
        showNotification(
          editingMenuItem
            ? "Menu item updated successfully"
            : "New menu item added successfully"
        );
      } else {
        const errorData = await response.json();
        showNotification(
          errorData.error || "Failed to save menu item",
          "error"
        );
      }
    } catch (error) {
      console.error("Error saving menu item:", error);
      showNotification("An error occurred while saving the menu item", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    setIsLoading(true);
    try {
      console.log("Updating order:", orderId, "to status:", status);
      const response = await fetch("/api/manageOrder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });

      if (response.ok) {
        const orderResponse = await fetch("/api/getOrder?all=true");
        if (orderResponse.ok) {
          const data = await orderResponse.json();
          setOrders(data);
        }

        showNotification(`Order updated to ${status}`);
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || "Failed to update order", "error");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      showNotification("An error occurred while updating the order", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function fetchBillRequests() {
      try {
        const response = await fetch("/api/billingRequest");
        if (response.ok) {
          const data = await response.json();
          setBillRequests(data);

          const pendingBills = data.some((bill) => bill.status === "pending");
          setHasPendingBills(pendingBills);
        }
      } catch (error) {
        console.error("Failed to fetch bill requests:", error);
      }
    }

    fetchBillRequests();

    const interval = setInterval(fetchBillRequests, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleProcessBill = async (billId) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/billingRequest", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billId,
          status: "completed",
        }),
      });

      if (response.ok) {
        const billResponse = await fetch("/api/billingRequest");
        if (billResponse.ok) {
          const data = await billResponse.json();
          setBillRequests(data);

          const pendingBills = data.some((bill) => bill.status === "pending");
          setHasPendingBills(pendingBills);
        }

        showNotification("Bill marked as processed");
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || "Failed to process bill", "error");
      }
    } catch (error) {
      console.error("Error processing bill:", error);
      showNotification("An error occurred while processing the bill", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMenu = async (menuItemId) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/makeMenu", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: menuItemId }),
      });

      if (response.ok) {
        setMenuItems((prevItems) =>
          prevItems.filter((item) => item.id !== menuItemId)
        );
        showNotification("Menu item deleted successfully");
      } else {
        const errorData = await response.json();
        showNotification(
          errorData.error || "Failed to delete menu item",
          "error"
        );
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
      showNotification(
        "An error occurred while deleting the menu item",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF1E6]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {notification && (
          <div
            className={`mb-6 p-3 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
              notification.type === "error"
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {notification.message}
          </div>
        )}
        
        <div className="flex flex-wrap border-2 border-black rounded-md bg-white p-2 mb-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <button
            className={`py-2 px-4 font-medium mr-2 mb-2 rounded-md border-2 border-black transition-all ${
              activeTab === "orders"
                ? "bg-[#99BC85] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white text-gray-700 hover:bg-gray-100 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            Orders{" "}
            {hasNewOrders && (
              <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                New
              </span>
            )}
          </button>
          <button
            className={`py-2 px-4 font-medium mr-2 mb-2 rounded-md border-2 border-black transition-all ${
              activeTab === "menu"
                ? "bg-[#99BC85] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white text-gray-700 hover:bg-gray-100 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            }`}
            onClick={() => setActiveTab("menu")}
          >
            Menu Management
          </button>
          <button
            className={`py-2 px-4 font-medium mb-2 rounded-md border-2 border-black transition-all ${
              activeTab === "bills"
                ? "bg-[#99BC85] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white text-gray-700 hover:bg-gray-100 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            }`}
            onClick={() => setActiveTab("bills")}
          >
            Bill Requests{" "}
            {hasPendingBills && (
              <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                New
              </span>
            )}
          </button>
        </div>

        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white p-4 rounded-md border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Processing...</div>
          </div>
        )}

        {activeTab === "orders" ? (
          <OrderManagementPanel
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
          />
        ) : activeTab === "menu" ? (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={handleAddMenu}
                className="px-4 py-2 bg-[#99BC85] text-white rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Add Menu Item
              </button>
            </div>
            <MenuManagementPanel
              menuItems={menuItems}
              onEditItem={handleEditMenu}
              onDeleteItem={handleDeleteMenu}
            />
          </div>
        ) : (
          <BillManagementPanel
            billRequests={billRequests}
            onProcessBill={handleProcessBill}
          />
        )}

        {isMenuModalOpen && (
          <MenuModal
            menuItem={editingMenuItem}
            onClose={() => setIsMenuModalOpen(false)}
            onSubmit={handleMenuSubmit}
          />
        )}
      </div>
    </div>
  );
}
