import React from "react";
import { Mail, ShieldCheck } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { currentUser } = useStore();

  return (
    <div className="mx-auto min-h-screen max-w-screen-2xl bg-gray-50/50 pb-16 text-gray-800">
      {/* Hero Banner Area */}
      <div className="relative h-60 w-full rounded-b-[2.5rem] bg-gradient-to-tr from-amber-700 via-orange-500 to-orange-400 shadow-sm">
        <div className="absolute inset-0 rounded-b-[2.5rem] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2),_transparent_40%)]"></div>
        
        {/* Profile Avatar Container */}
        <div className="absolute bottom-[-48px] left-1/2 -translate-x-1/2 transform">
          <div className="relative h-28 w-28 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden">
            <img
              src={currentUser?.photoURL || "/userPfp.png"}
              className="h-full w-full object-cover"
              alt="Profile"
            />
          </div>
        </div>
      </div>

      {/* User Basic Info Header */}
      <div className="px-4 pt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          {currentUser?.displayName || "Guest User"}
        </h2>
        <p className="text-sm font-medium text-gray-500 mt-1">
          {currentUser?.email || "No email linked"}
        </p>
      </div>

      {/* Grid Dashboard Content */}
      <div className="mx-auto mt-10 max-w-5xl px-4">
        <div className="grid gap-6 md:grid-cols-2 items-start">
          
          {/* Account Details Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <h3 className="mb-4 text-lg font-bold text-gray-900 tracking-wide flex items-center gap-2">
              Account Details
            </h3>
            <div className="space-y-4 rounded-xl bg-gray-50 p-4 border border-gray-100">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail size={18} className="text-amber-600 shrink-0" />
                <span className="truncate font-medium">{currentUser?.email || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Demo Controls Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md flex flex-col justify-between min-h-[174px]">
            <div>
              <h3 className="mb-2 text-lg font-bold text-gray-900 tracking-wide flex items-center gap-2">
                <ShieldCheck size={20} className="text-amber-600" />
                Demo Controls
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                This is a sandbox presentation layout. You are welcome to simulate administrative powers and configure stores by launching our interface below.
              </p>
            </div>
            
            <div className="mt-6">
              <Link
                to="/adminpanel"
                className="inline-block rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 px-6 py-3 text-sm font-semibold text-white tracking-wide shadow-sm hover:shadow transition-all duration-200"
              >
                View Admin Panel
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;