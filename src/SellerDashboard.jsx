import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SellerDashboard.css';

function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sellerData, setSellerData] = useState(null);
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('sellerToken');
    const data = localStorage.getItem('sellerData');
    
    if (!token || !data) {
      navigate('/seller/login');
      return;
    }

    setSellerData(JSON.parse(data));
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('sellerToken');
      
      // Fetch dashboard stats
      const statsResponse = await fetch('http://localhost:5000/api/seller/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsResponse.json();
      if (statsData.success) setStats(statsData.stats);

      // Fetch products
      const productsResponse = await fetch('http://localhost:5000/api/seller/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const productsData = await productsResponse.json();
      if (productsData.success) setProducts(productsData.products);

      // Fetch orders
      const ordersResponse = await fetch('http://localhost:5000/api/seller/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const ordersData = await ordersResponse.json();
      if (ordersData.success) setOrders(ordersData.orders);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sellerToken');
    localStorage.removeItem('sellerData');
    navigate('/seller/login');
  };


  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>ReWear</h2>
          <p>Seller Dashboard</p>
        </div>
        
        <div className="seller-info">
          <h3>{sellerData?.name?.first} {sellerData?.name?.last}</h3>
          <p>{sellerData?.email}</p>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            📦 Products
          </button>
          <button 
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            📋 Orders
          </button>
          <button 
            className="upload-product-btn"
            onClick={() => navigate('/seller/upload')}
          >
            ➕ Add Product
          </button>
          <button 
            className="go-to-user-btn"
            onClick={() => navigate('/')}
          >
            🏠 Go to User Side
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-tab">
            <h1>Dashboard Overview</h1>
            
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Products</h3>
                <p className="stat-number">{stats.totalProducts || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Active Products</h3>
                <p className="stat-number">{stats.activeProducts || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Total Orders</h3>
                <p className="stat-number">{stats.totalOrders || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Orders</h3>
                <p className="stat-number">{stats.pendingOrders || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Total Revenue</h3>
                <p className="stat-number">₹{stats.totalRevenue || 0}</p>
              </div>
            </div>

            <div className="recent-orders">
              <h2>Recent Orders</h2>
              {orders.slice(0, 5).map(order => (
                <div key={order._id} className="order-item">
                  <div>
                    <strong>Order #{order.orderId}</strong>
                    <p>Customer: {order.userId?.name?.first} {order.userId?.name?.last}</p>
                    <p>Amount: ₹{order.totalAmount}</p>
                  </div>
                  <span className={`status ${order.status}`}>{order.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="products-tab">
            <h1>My Products</h1>
            <div className="products-grid">
              {products.map(product => (
                <div key={product._id} className="product-card">
                  <div className="product-image">
                    {product.images.length > 0 ? (
                      <img src={product.images[0].url.startsWith('http') ? product.images[0].url : `http://localhost:5000${product.images[0].url}`} alt={product.title} />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.title}</h3>
                    <p className="product-category">{product.category}</p>
                    <p className="product-price">₹{product.price}</p>
                    <p className="product-stock">Stock: {product.stock}</p>
                    <span className={`product-status ${product.status}`}>{product.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-tab">
            <h1>Orders</h1>
            <div className="orders-list">
              {orders.map(order => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <h3>Order #{order.orderId}</h3>
                    <span className={`status ${order.status}`}>{order.status}</span>
                  </div>
                  <div className="order-details">
                    <p><strong>Customer:</strong> {order.userId?.name?.first} {order.userId?.name?.last}</p>
                    <p><strong>Email:</strong> {order.userId?.email}</p>
                    <p><strong>Amount:</strong> ₹{order.totalAmount}</p>
                    <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                    {order.items && order.items.length > 0 && (
                      <div style={{ marginTop: '10px' }}>
                        <p><strong>Items:</strong></p>
                        {order.items.map((item, idx) => (
                          <p key={idx} style={{ marginLeft: '20px', fontSize: '14px' }}>
                            - {item.productId?.title || 'Product'} (Qty: {item.quantity}) - ₹{item.price}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default SellerDashboard;