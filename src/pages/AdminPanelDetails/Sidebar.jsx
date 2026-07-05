import { LayoutDashboard, ShoppingBag, Users, BarChart3, Settings } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-64 space-y-6 bg-white p-6 ">
      <h1 className="mb-4 text-xl font-bold text-amber-600">Admin Panel</h1>
      <nav className="space-y-4 text-gray-800">
        <a href="#overview" className="flex items-center gap-2 hover:text-amber-600">
          <LayoutDashboard size={20} /> Dashboard
        </a>
        <a href="#catalog" className="flex items-center gap-2 hover:text-amber-600">
          <ShoppingBag size={20} /> Products
        </a>
        <a href="#orders" className="flex items-center gap-2 hover:text-amber-600">
          <BarChart3 size={20} /> Orders
        </a>
        <a href="#users" className="flex items-center gap-2 hover:text-amber-600">
          <Users size={20} /> Users
        </a>
        <a href="#settings" className="flex items-center gap-2 hover:text-amber-600">
          <Settings size={20} /> Settings
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;
