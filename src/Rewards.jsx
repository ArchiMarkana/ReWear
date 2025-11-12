import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./Rewards.css";

export default function Rewards() {
  return (
    <div className="rewards-root">
      <Header />
      
      <div className="rewards-container">
        <div className="rewards-header">
          <h1>Rewards & Loyalty</h1>
          <p>Earn points and unlock exclusive benefits</p>
        </div>

        <div className="rewards-content">
          <div className="empty-rewards">
            <div className="empty-icon">🎁</div>
            <h2>Rewards program coming soon</h2>
            <p>We're working on an exciting rewards program for our loyal customers</p>
            <a href="/" className="start-shopping-btn">Start Shopping</a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

