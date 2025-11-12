import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer-root">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section">
          <h3 className="footer-title">About Us</h3>
          <p>
            We are an online e-commerce store bringing you the best fashion,
            accessories, and lifestyle products at affordable prices.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/categories">Categories</a></li>
            <li><a href="/become-seller">Become a Seller</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-section">
          <h3 className="footer-title">Contact</h3>
          <p>Email: support@yourstore.com</p>
          <p>Phone: +91 98765 43210</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} YourStore. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
