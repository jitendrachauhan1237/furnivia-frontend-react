import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import LoginSignup from "./pages/LoginSignup";
import Footer from "./components/Footer";
import ShopPage from "./pages/Shop";
import AboutUs from "./pages/About";
import ProductDisplayPage from "./pages/DisplayPage";
import ContactUs from "./pages/ContactUs";
import ProfilePage from "./pages/profile/ProfilePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrders from "./pages/MyOrders";
import AdminPanel from "./pages/AdminPanelDetails/AdminPanel";
import SeedData from "./pages/SeedData";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="max-w-screen-2xl mx-auto w-full ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/product/:_id" element={<ProductDisplayPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/adminpanel" element={<AdminPanel />} />
          <Route path="/seed" element={<SeedData />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
