import React, { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ShoppingCart,
  Menu,
  X,
  Search,
  CircleArrowRight,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import ProfileDrawer from "./ProfileDrawer";
import { useStore } from "../context/StoreContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Category");
  const [showMobileSearchBar, setShowMobileSearchBar] = useState(false);

  const drawerCheckboxRef = useRef(null);
  const dropdownRef = useRef(null);
  const megaMenuRef = useRef(null); // Ref for closing the shop menu on outside click
  const navigate = useNavigate();
  const { categories, products, currentUser, cartItems } = useStore();

  // Handle outside clicks for Search Dropdown AND Mega Menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close search results
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSearchQuery("");
        setSearchResults([]);
      }
      // Close mega menu
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target)) {
        setShowMegaMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const title = (product?.title || "").toLowerCase();
      const category = product?.category || "";
      const matchesCategory =
        selectedCategory === "All Category" || category === selectedCategory;
      const matchesSearch = title.includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (searchQuery || selectedCategory !== "All Category") {
      setSearchResults(filtered.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, [products, searchQuery, selectedCategory]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleResultClick = (id) => {
    navigate(`/product/${id}`);
    setSearchQuery("");
    setSearchResults([]);
    setShowMobileSearchBar(false);
  };

  const searchDropdown = (
    <ul className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-[999] max-h-60 overflow-y-auto">
      {searchResults.map((product) => (
        <li
          key={product._id}
          className="flex items-center gap-3 px-3 py-2 hover:bg-amber-50 cursor-pointer"
          onClick={() => handleResultClick(product._id)}
        >
          <img
            className="h-12 w-12 rounded-md object-cover"
            src={product.image}
            alt={product.title}
          />
          <div>
            <p className="text-sm font-medium text-gray-700">{product.title}</p>
            <p className="text-xs text-amber-800">{product.category}</p>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <ProfileDrawer ref={drawerCheckboxRef} />
      <div
        className={`fixed left-0 right-0 top-0 z-30 w-full transition-colors duration-500 ${
          isScrolled ? "bg-white/20 backdrop-blur-lg " : "bg-transparent"
        }`}
      >
        <div className="mx-auto w-full max-w-screen-2xl px-6 py-4 md:px-16">
          <div className="flex items-center justify-between">
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? (
                  <X size={24} className="text-amber-600" />
                ) : (
                  <Menu size={24} className="text-amber-600" />
                )}
              </button>
            </div>

            <div className="mx-auto text-xl font-bold text-amber-800 md:mx-0 md:mr-6">
              <Link to="/"><img src="/logo.png" alt="Furnivia Logo" className="h-10"/></Link>
            </div>

            <div className="hidden items-center space-x-6 text-sm font-medium text-gray-700 md:flex">
              <Link to="/" className="text-amber-800">Home</Link>

              {/* Click-triggered Mega Menu Wrapper */}
              <div className="relative" ref={megaMenuRef}>
                <button
                  onClick={() => setShowMegaMenu((prev) => !prev)}
                  className="flex items-center gap-1 font-semibold text-gray-800 hover:text-amber-800"
                >
                  Shop <ChevronDown className={`h-4 w-4 transition-transform ${showMegaMenu ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {showMegaMenu && (
                    <div className="absolute left-0 top-full z-50 mt-2 grid w-[420px] grid-cols-2 rounded-xl border border-gray-200 bg-white p-6 shadow-2xl">
                      {categories.map((cat) => (
                        <Link
                          key={cat}
                          to={`/shop?category=${encodeURIComponent(cat)}`}
                          className="group flex items-center rounded-lg px-3 py-2 transition hover:bg-amber-50"
                          onClick={() => setShowMegaMenu(false)}
                        >
                          <div className="flex w-full items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 group-hover:text-amber-600">
                              {cat}
                            </span>
                            <CircleArrowRight className="h-4 w-4 text-amber-400" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/about" className="hover:text-amber-800">About</Link>
              <Link to="/contact" className="hover:text-amber-800">Contact</Link>
              <Link to="/adminpanel" className="hover:text-amber-800">Demo Admin</Link>
            </div>

            <div
              ref={dropdownRef}
              className="relative mx-6 hidden w-[400px] items-center overflow-visible rounded-md border bg-white md:flex"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search furniture..."
                className="w-full bg-white px-4 py-2 text-sm text-gray-800 outline-none"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border-l bg-white px-3 text-sm text-gray-600 outline-none"
              >
                <option>All Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <button className="px-4 py-2 text-gray-800">
                <Search size={20} />
              </button>
              {(searchQuery || selectedCategory !== "All Category") &&
                searchResults.length > 0 &&
                searchDropdown}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowMobileSearchBar((prev) => !prev)}
                className="text-gray-700 md:hidden"
                aria-label="Toggle search"
              >
                <Search size={20} />
              </button>

              <div className="relative cursor-pointer">
                <Link to="/cart">
                  <ShoppingCart size={20} className="text-gray-700" />
                </Link>
                <span className="absolute -right-2 -top-2 rounded-full bg-amber-800 px-1 text-xs text-white">
                  {cartCount}
                </span>
              </div>

              {currentUser ? (
                <button
                  onClick={() => {
                    if (drawerCheckboxRef.current) {
                      drawerCheckboxRef.current.checked = true;
                    }
                  }}
                  className="focus:outline-none"
                >
                  <img
                    src={currentUser.photoURL || "/userPfp.png"}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover shadow-md md:h-10 md:w-10"
                  />
                </button>
              ) : (
                <Link to="/login" className="text-lg font-bold text-gray-700">
                  Login
                </Link>
              )}
            </div>
          </div>

          {showMobileSearchBar && (
            <div
              ref={dropdownRef}
              className="relative mx-auto my-4 flex w-[90%] max-w-[400px] items-center overflow-visible rounded-md border bg-white md:hidden"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search furniture..."
                className="w-full bg-white px-4 py-2 text-sm text-gray-800 outline-none"
              />
              <button className="px-4 py-2 text-gray-800">
                <Search size={20} />
              </button>
              {(searchQuery || selectedCategory !== "All Category") &&
                searchResults.length > 0 &&
                searchDropdown}
            </div>
          )}

          <AnimatePresence>
            {isMenuOpen && (
              <div className="mt-4 flex flex-col space-y-2 rounded-lg bg-white p-4 text-sm shadow-md md:hidden">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-gray-800">
                  Home
                </Link>

                <div className="border-t pt-2">
                  <button
                    onClick={() => setShowMegaMenu(!showMegaMenu)}
                    className="flex w-full items-center justify-between font-medium text-gray-800"
                  >
                    Shop
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${showMegaMenu ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {showMegaMenu && (
                      <div className="mt-2 flex flex-col space-y-2 pl-4">
                        {categories.map((cat) => (
                          <Link
                            key={cat}
                            to={`/shop?category=${encodeURIComponent(cat)}`}
                            onClick={() => {
                              setIsMenuOpen(false);
                              setShowMegaMenu(false);
                            }}
                            className="text-gray-700 hover:text-amber-800"
                          >
                            {cat}
                          </Link>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-gray-800">
                  About
                </Link>
                <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-gray-800">
                  Contact
                </Link>
                <Link to="/adminpanel" onClick={() => setIsMenuOpen(false)} className="text-gray-800">
                  Demo Admin
                </Link>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default Navbar;