import React, { useState, useEffect, useRef } from "react";
import "./Header.css";
import sellerIcon from "./assets/icon.png";
import { Link } from "react-router-dom"; // Import Link

function Header() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      {/* Left: Logo + Search */}
      <div className="header-left">
        <div className="logo">MyLogo</div>
        <input
          type="text"
          placeholder="Search products..."
          className="search-bar"
        />
      </div>

      {/* Right: Profile, Cart, Seller, More */}
      <div className="header-right">
        {/* Profile Section */}
        <div
          className="profile-section"
          ref={profileRef}
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <svg
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="currentColor"
          >
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
          <span>Profile</span>

          {showProfileMenu && (
            <div className="profile-dropdown">
              <div>
                New Customer? <Link to="/login"><button>Sign Up</button></Link>
              </div>

              <Link to="/profile" className="dropdown-item">
                {/* Profile Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3z"/>
                  <path fillRule="evenodd" d="M8 8a3 3 0 100-6 3 3 0 000 6z"/>
                </svg>
                <span>My Profile</span>
              </Link>

              <Link to="/orders" className="dropdown-item">
                {/* Orders Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1h16v2H0V1zm0 5h16v2H0V6zm0 5h16v2H0v-2z"/>
                </svg>
                <span>Orders</span>
              </Link>

              <Link to="/wishlist" className="dropdown-item">
                {/* Wishlist Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 2.748-.717 8.717c-.386.387-.386 1.017 0 1.404l.717.717L8 14l7.283-3.162.717-.717c.386-.387.386-1.017 0-1.404L8 2.748z"/>
                </svg>
                <span>Wishlist</span>
              </Link>

              <Link to="/cart" className="dropdown-item">
                {/* Cart Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                <span>Cart</span>
              </Link>

              <Link to="/rewards" className="dropdown-item">
                {/* Rewards Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0l2.39 4.84 5.35.78-3.87 3.77.92 5.34L8 12.53 3.21 15.71l.92-5.34-3.87-3.77 5.35-.78L8 0z"/>
                </svg>
                <span>Rewards</span>
              </Link>
            </div>
          )}
        </div>

        {/* Cart Section */}
        <Link to="/cart" className="cart">
          <svg
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="currentColor"
          >
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.82 14h8.35c.63 0 1.18-.38 1.4-.97l3.58-8.56a.996.996 0 0 0-.92-1.47H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44c-.16.28-.25.61-.25.97 0 1.1.9 2 2 2h12v-2H7.82z"/>
          </svg>
          <span>Cart</span>
        </Link>

        {/* Become Seller (Link added here) */}
        <Link to="/become-seller" className="seller">
          <img
            src={sellerIcon}
            alt="Become Seller"
            className="icon"
            style={{ width: 25, height: 25, marginBottom: -5, padding: "0 7px" }}
          />
          <span style={{ marginBottom: -2 }}>Become Seller</span>
        </Link>

        {/* More */}
        <div className="more">•••</div>
      </div>
    </header>
  );
}

export default Header;
