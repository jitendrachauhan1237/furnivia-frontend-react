import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, ClipboardList, LogOut, X } from "lucide-react";
import { useStore } from "../context/StoreContext";

const ProfileDrawer = React.forwardRef((props, ref) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { currentUser, logout } = useStore();

  const closeDrawer = () => {
    if (ref.current) ref.current.checked = false;
  };

  const handleLogout = () => {
    logout();
    closeDrawer();
    setShowLogoutModal(false);
    navigate("/login");
  };

  return (
    <>
      {/* DaisyUI Drawer Side Hook */}
      <div className="drawer drawer-end z-50">
        <input
          id="my-drawer-4"
          type="checkbox"
          className="drawer-toggle"
          ref={ref}
        />
        <div className="drawer-content"></div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-4"
            className="drawer-overlay"
            aria-label="close sidebar"
          ></label>
          
          <div className="min-h-full w-80 bg-white p-6 text-gray-800 flex flex-col justify-between shadow-2xl">
            <div>
              {/* Profile Overview Header */}
              {currentUser && (
                <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
                  <img
                    src={currentUser.photoURL || "/userPfp.png"}
                    alt={currentUser.displayName || "User"}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-amber-500/20 shadow-sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-900 truncate">
                      {currentUser.displayName || "Guest User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <ul className="menu p-0 space-y-1.5 [&_li_a]:py-3 [&_li_a]:px-4 [&_li_a]:rounded-xl [&_li_a]:font-medium [&_li_a]:text-gray-700">
                <li>
                  <Link
                    to="/profile"
                    onClick={closeDrawer}
                    className=""
                  >
                    <User size={18} className="text-gray-400 group-hover:text-amber-500" />
                    Profile Details
                  </Link>
                </li>
                <li>
                  <Link
                    to="/myorders"
                    onClick={closeDrawer}
                    className=""
                  >
                    <ClipboardList size={18} className="text-gray-400 group-hover:text-amber-500" />
                    My Orders
                  </Link>
                </li>
              </ul>
            </div>

            {/* Bottom Section Controls */}
            <div className="border-t border-gray-100 pt-4">
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
              >
                <LogOut size={18} />
                Sign Out Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Logout Modal Overlays */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-center border border-gray-100">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-50"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
            
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 mb-4">
              <LogOut size={22} />
            </div>

            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Confirm Logout</h2>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              Are you sure you want to log out? You will need to sign back in to access your current cart items and saved orders.
            </p>
            
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-xl bg-gray-100 hover:bg-gray-200 py-3 text-sm font-semibold text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 py-3 text-sm font-semibold text-white shadow-sm shadow-red-200 transition-colors"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

ProfileDrawer.displayName = "ProfileDrawer";

export default ProfileDrawer;