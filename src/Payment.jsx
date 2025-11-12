import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { getImageUrl } from "./utils/imageUtils";
import { isLoggedIn } from "./utils/auth";
import "./BuyNow.css";

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentKey, setPaymentKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    if (state && state.product) {
      setProduct(state.product);
      setQuantity(state.quantity || 1);
    } else {
      navigate("/");
    }
  }, [state, navigate]);

  const handlePayment = async () => {
    if (paymentKey !== "969696") {
      setError("Invalid payment key");
      return;
    }

    setLoading(true);
    setError("");

    // If payment key is correct, redirect to success page
    // Try to create order in background, but don't block on errors
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const finalPrice = product.discount > 0 
          ? product.price - (product.price * product.discount / 100) 
          : product.price;

        // Try to create order in background (don't wait for response)
        fetch("http://localhost:5000/api/user/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            items: [{
              productId: product._id,
              quantity: quantity,
              sellerId: product.sellerId?._id || product.sellerId
            }],
            shippingAddress: {
              name: "User",
              address: "Address",
              city: "City",
              state: "State",
              pincode: "123456",
              phone: "1234567890"
            }
          })
        }).catch(err => {
          console.error("Order creation error (non-blocking):", err);
        });
      }
    } catch (error) {
      console.error("Payment processing error:", error);
    }

    // Redirect to success page immediately after payment key validation
    navigate("/order-success");
  };

  if (!product) {
    return (
      <div className="buy-now-root">
        <Header />
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>Loading...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  const finalPrice = product.discount > 0 
    ? product.price - (product.price * product.discount / 100) 
    : product.price;
  const totalAmount = finalPrice * quantity;
  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];

  return (
    <div className="buy-now-root">
      <Header />
      <div className="product-details" style={{ maxWidth: "800px", margin: "20px auto", padding: "20px" }}>
        <div className="product-image-container">
          <img src={getImageUrl(primaryImage?.url)} alt={product.title} />
        </div>
        <div className="product-info">
          <h1>{product.title}</h1>
          <p className="price">₹{finalPrice} {product.originalPrice && product.originalPrice > finalPrice && <span style={{ textDecoration: "line-through", color: "#999", marginLeft: "10px" }}>₹{product.originalPrice}</span>}</p>
          <p className="desc">{product.description || "No description available."}</p>
          
          <div style={{ margin: "20px 0" }}>
            <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>Quantity: {quantity}</label>
          </div>

          <div style={{ margin: "20px 0", padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
            <h3 style={{ marginBottom: "15px" }}>Payment</h3>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Enter Payment Key:</label>
              <input
                type="text"
                value={paymentKey}
                onChange={(e) => setPaymentKey(e.target.value)}
                placeholder="Enter payment key"
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "16px",
                  border: "1px solid #ddd",
                  borderRadius: "4px"
                }}
              />
            </div>
            
            {error && (
              <div style={{ color: "red", marginBottom: "15px", padding: "10px", backgroundColor: "#ffe6e6", borderRadius: "4px" }}>
                {error}
              </div>
            )}

            <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #ddd" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span>Subtotal:</span>
                <span>₹{finalPrice} x {quantity}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "bold", marginTop: "10px" }}>
                <span>Total:</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            <button
              className="buy-btn"
              onClick={handlePayment}
              disabled={loading || !paymentKey}
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "15px",
                fontSize: "18px",
                backgroundColor: loading ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Processing..." : "Complete Payment"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

