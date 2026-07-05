import { BarChart3, ShoppingCart, User, DollarSign } from "lucide-react";
import { useStore } from "../../context/StoreContext";

const Dashboard = ({ allOrders = [], totalCustomers = 0 }) => {
  const { products } = useStore();
  const revenue = allOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Dashboard Overview</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card icon={<ShoppingCart />} title="Total Orders" value={allOrders.length} />
        <Card icon={<DollarSign />} title="Revenue" value={`Rs. ${revenue.toLocaleString()}`} />
        <Card icon={<User />} title="Customers" value={totalCustomers} />
        <Card icon={<BarChart3 />} title="Products" value={products.length} />
      </div>
    </div>
  );
};

const Card = ({ icon, title, value }) => (
  <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-md transition hover:shadow-lg">
    <div className="text-amber-600">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);

export default Dashboard;
