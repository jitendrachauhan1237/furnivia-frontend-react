import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import { useStore } from "../../context/StoreContext";
import { db, collection, getDocs, doc, updateDoc } from "../../Firebase/firebase.config";

const AdminPanel = () => {
  const { products } = useStore();
  const [allOrders, setAllOrders] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const ordersSnap = await getDocs(collection(db, "orders"));
        const ordersData = ordersSnap.docs.map(d => d.data());
        ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAllOrders(ordersData);

        const usersSnap = await getDocs(collection(db, "users"));
        setTotalCustomers(usersSnap.docs.length);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };
    fetchAdminData();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      setAllOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 pt-20">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <section id="overview">
          <Dashboard allOrders={allOrders} totalCustomers={totalCustomers} />
        </section>

        <section id="catalog" className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800">Catalog Snapshot</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.slice(0, 6).map((product) => (
              <div key={product._id} className="rounded-xl border p-4">
                <img src={product.image} alt={product.title} className="h-40 w-full rounded-lg object-cover" />
                <h4 className="mt-3 font-semibold">{product.title}</h4>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className="mt-2 font-semibold text-amber-600">Rs. {product.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="orders" className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800">All Orders & Delivery Management</h3>
          <div className="mt-4 space-y-4">
            {allOrders.map((order) => (
              <div key={order._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl border p-4 gap-4">
                <div>
                  <p className="font-semibold">{order.firstName} {order.lastName}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mt-1">ID: {order._id}</p>
                </div>
                <div className="text-left sm:text-right flex flex-col sm:items-end gap-2">
                  <p className="font-semibold text-amber-600">Rs. {order.total.toLocaleString()}</p>
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="rounded border border-gray-300 p-1 text-sm text-gray-700 bg-white"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
            {allOrders.length === 0 && <p className="text-gray-500">No orders found.</p>}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminPanel;
