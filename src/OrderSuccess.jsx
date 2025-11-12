import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "./BuyNow.css";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="buy-now-root">
      <Header />
      <div style={{ 
        maxWidth: "600px", 
        margin: "50px auto", 
        padding: "40px", 
        textAlign: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px"
      }}>
        <div style={{ fontSize: "64px", marginBottom: "20px" }}>✅</div>
        <h1 style={{ color: "#28a745", marginBottom: "20px" }}>Order Placed Successfully!</h1>
        <p style={{ fontSize: "18px", marginBottom: "30px", color: "#666" }}>
          Thank you for your purchase. Your order has been confirmed.
        </p>
        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "15px 40px",
              fontSize: "18px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate("/orders")}
            style={{
              padding: "15px 40px",
              fontSize: "18px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Order History
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

