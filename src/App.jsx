import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Home';
import Login from './Login';
import BuyNow from './BuyNow';
import Payment from './Payment';
import OrderSuccess from './OrderSuccess';
import SellerLogin from './SellerLogin';
import SellerDashboard from './SellerDashboard';
import ProductDetail from './ProductDetail';
import ProductUpload from './ProductUpload';
import BecomeSeller from './BecomeSeller';
import Profile from './Profile';
import Wishlist from './Wishlist';
import Cart from './Cart';
import Orders from './Orders';
import Rewards from './Rewards';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/buy/:id" element={<BuyNow />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/become-seller" element={<BecomeSeller />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/rewards" element={<Rewards />} />
        
            {/* Seller Routes */}
            <Route path="/seller-login" element={<SellerLogin />} />
            <Route path="/seller/login" element={<SellerLogin />} />
            <Route path="/seller/register" element={<SellerLogin />} />
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="/seller/upload" element={<ProductUpload />} />
      </Routes>
    </Router>
  );
}