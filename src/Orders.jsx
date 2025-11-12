import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { isLoggedIn } from "./utils/auth";
import { getImageUrl } from "./utils/imageUtils";
import "./Orders.css";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/user/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="orders-root">
        <Header />
        <div className="orders-container">
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading orders...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="orders-root">
      <Header />
      
      <div className="orders-container">
        <div className="orders-header">
          <h1>Order History</h1>
          <p>Track and manage your orders</p>
        </div>

        <div className="orders-content">
          {orders.length === 0 ? (
            <div className="empty-orders">
              <div className="empty-icon">📦</div>
              <h2>No orders yet</h2>
              <p>Your order history will appear here once you make your first purchase</p>
              <Link to="/" className="start-shopping-btn">Start Shopping</Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-item">
                  <div className="order-info">
                    <h3>Order #{order.orderId}</h3>
                    <p>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    <span className={`order-status ${order.status}`}>{order.status}</span>
                  </div>
                  <div className="order-items">
                    {order.items?.map((item, idx) => {
                      const product = item.productId;
                      const primaryImage = product?.images?.[0];
                      return (
                        <div key={idx} className="order-item-detail">
                          {primaryImage && (
                            <img src={getImageUrl(primaryImage.url)} alt={product?.title} className="order-item-image" />
                          )}
                          <div className="order-item-info">
                            <h4>{product?.title || 'Product'}</h4>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ₹{item.price}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="order-total">Total: ₹{order.totalAmount}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

