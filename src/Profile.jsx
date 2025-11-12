import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { isLoggedIn, getCurrentUser, updateUserProfile, logout } from "./utils/auth";
import { getImageUrl } from "./utils/imageUtils";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    countryCode: "+91",
    profilePicture: ""
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Check if user is logged in and get user data
  useEffect(() => {
    const checkAuth = async () => {
      console.log('Profile component: Checking authentication...');
      
      // Check if token exists
      const token = sessionStorage.getItem('token');
      console.log('Profile component: Token exists:', !!token);
      console.log('Profile component: Token value:', token);
      
      if (!token) {
        console.log('Profile component: No token found, redirecting to login');
        navigate('/login');
        return;
      }
      
      try {
        console.log('Profile component: Token found, fetching user data...');
        // Get fresh user data from database
        const currentUser = await getCurrentUser();
        console.log('Profile component: Received user data:', currentUser);
        
        if (currentUser) {
          setUser(currentUser);
          setFormData({
            firstName: currentUser.name?.first || "",
            lastName: currentUser.name?.last || "",
            email: currentUser.email || "",
            phoneNumber: currentUser.phone?.number || "",
            countryCode: currentUser.phone?.countryCode || "+91",
            profilePicture: currentUser.profilePicture || ""
          });
          console.log('Profile component: User data set successfully');
        } else {
          console.log('Profile component: No user data received, redirecting to login');
          navigate('/login');
        }
      } catch (error) {
        console.error('Profile component: Error fetching user data:', error);
        
        // Try to get user data from localStorage as fallback
        const fallbackUser = JSON.parse(localStorage.getItem('userData') || '{}');
        if (fallbackUser && fallbackUser.email) {
          console.log('Profile component: Using fallback user data from localStorage');
          setUser(fallbackUser);
          setFormData({
            firstName: fallbackUser.name?.first || fallbackUser.firstName || "",
            lastName: fallbackUser.name?.last || fallbackUser.lastName || "",
            email: fallbackUser.email || "",
            phoneNumber: fallbackUser.phone?.number || fallbackUser.phone || "",
            countryCode: fallbackUser.phone?.countryCode || "+91",
            profilePicture: fallbackUser.profilePicture || ""
          });
        } else {
          console.log('Profile component: No fallback data available, redirecting to login');
          // If API call fails and no fallback, clear token and redirect to login
          sessionStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    checkAuth();
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      // Update user data via API
      const updatedUser = await updateUserProfile(formData);
      setUser(updatedUser);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error('Error updating profile:', error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a PNG or JPG image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const token = sessionStorage.getItem('token');
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await fetch('http://localhost:5000/api/profile/upload-picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update formData and user state with new profile picture
        const newProfilePicture = data.profilePicture;
        setFormData(prev => ({ ...prev, profilePicture: newProfilePicture }));
        setUser(data.user);
        alert('Profile picture uploaded successfully!');
      } else {
        alert(data.message || 'Failed to upload profile picture');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  // Fetch orders for order history tab
  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab === "orders" && isLoggedIn()) {
        try {
          const token = sessionStorage.getItem('token');
          const response = await fetch('http://localhost:5000/api/user/orders', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (data.success && data.orders) {
            // Update user state with orders
            setUser(prev => ({
              ...prev,
              purchases: data.orders.map(order => ({
                orderId: order.orderId,
                productId: order.items[0]?.productId?._id,
                quantity: order.items[0]?.quantity || 1,
                price: order.items[0]?.price || order.totalAmount,
                purchaseDate: order.createdAt,
                status: order.status
              }))
            }));
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      }
    };
    fetchOrders();
  }, [activeTab]);

  return (
    <div className="profile-root">
      <Header />
      
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {formData.profilePicture ? (
                <img 
                  src={getImageUrl(formData.profilePicture)} 
                  alt="Profile" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              ) : (
                <span>{formData.firstName[0] || 'U'}{formData.lastName[0] || 'S'}</span>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg,image/jpg"
              style={{ display: 'none' }}
            />
            <button 
              className="change-photo-btn" 
              onClick={handleChangePhotoClick}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Change Photo'}
            </button>
          </div>
          <div className="profile-info">
            <h1>{formData.firstName || 'User'} {formData.lastName || 'Name'}</h1>
            <p>{formData.email || 'user@example.com'}</p>
            <p>Points: {user?.points || 0}</p>
            <span className="member-since">Member since 2024</span>
          </div>
          <div className="profile-actions">
            <button className="logout-btn" onClick={handleLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
              </svg>
              Logout
            </button>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-tabs">
            <button 
              className={`tab ${activeTab === "personal" ? "active" : ""}`}
              onClick={() => setActiveTab("personal")}
            >
              Personal Information
            </button>
            <button 
              className={`tab ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              Order History
            </button>
            <button 
              className={`tab ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              Security
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "personal" && (
              <div className="personal-info">
                <h2>Personal Information</h2>
                <form className="profile-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone Number</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleInputChange}
                        style={{ flex: '0 0 80px' }}
                      >
                        <option value="+91">+91</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                      </select>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>
                  
                  
                  <button type="button" onClick={handleSave} className="save-btn">
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="order-history">
                <h2>Order History</h2>
                {user?.purchases && user.purchases.length > 0 ? (
                  <div className="orders-list">
                    {user.purchases.map((purchase, idx) => (
                      <div key={idx} className="order-item">
                        <div className="order-info">
                          <h3>Order #{purchase.orderId || `#${idx + 1}`}</h3>
                          <p>Placed on {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                          <span className={`order-status ${purchase.status}`}>{purchase.status}</span>
                        </div>
                        <div className="order-total">₹{purchase.price * purchase.quantity}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p>No orders yet</p>
                    <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>Start Shopping</Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "security" && (
              <div className="security-settings">
                <h2>Security Settings</h2>
                <ChangePasswordForm />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

// Change Password Component
function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters" });
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/profile/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        setMessage({ type: "error", text: data.message || "Failed to change password" });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({ type: "error", text: "Failed to change password. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="security-item">
      <div className="security-info">
        <h3>Change Password</h3>
        <p>Update your password to keep your account secure</p>
      </div>
      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            minLength={6}
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>
        {message.text && (
          <div style={{
            padding: "10px",
            marginTop: "10px",
            borderRadius: "4px",
            backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
            color: message.type === "success" ? "#155724" : "#721c24"
          }}>
            {message.text}
          </div>
        )}
        <button
          type="submit"
          className="change-password-btn"
          disabled={loading}
          style={{ marginTop: "15px" }}
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
