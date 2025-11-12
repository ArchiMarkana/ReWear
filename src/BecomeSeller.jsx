import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaIdCard, FaLock, FaEye, FaEyeSlash, FaStore, FaCheckCircle } from "react-icons/fa";
import "./BecomeSeller.css";
import axios from "axios";

export default function BecomeSeller() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gstin: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.mobile || !formData.password) {
      setError("Please fill in all required fields!");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long!");
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address!");
      setLoading(false);
      return;
    }

    // Mobile validation - allow any 10-digit number
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      setError("Please enter a valid 10-digit mobile number!");
      setLoading(false);
      return;
    }

    try {
      // Prepare data for API
      const registrationData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        mobile: formData.mobile,
        gstin: formData.gstin || "",
        password: formData.password
      };

      console.log('Sending registration data:', registrationData);

      const response = await axios.post("http://localhost:5000/api/seller/register", registrationData);

      console.log('Registration response:', response.data);

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/seller-login');
        }, 2000);
      }
    } catch (error) {
      console.error("Registration Error:", error);
      console.error("Error response:", error.response?.data);
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="become-seller-container">
        <div className="success-card">
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          <h2>Registration Successful!</h2>
          <p>Your seller account has been created successfully.</p>
          <p className="redirect-text">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="become-seller-container">
      <div className="become-seller-card">
        {/* Back Button */}
        <div className="back-button">
          <Link to="/" className="back-link">
            <FaArrowLeft />
            Back to Home
          </Link>
        </div>

        {/* Login Option for Existing Sellers */}
        <div className="existing-seller-box">
          <div className="existing-seller-content">
            <FaStore className="store-icon" />
            <div>
              <p className="existing-seller-text">Already a seller?</p>
              <Link to="/seller-login" className="login-link">
                Login to your seller account
              </Link>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="header-section">
          <div className="header-icon">
            <FaStore />
          </div>
          <h1 className="main-title">Become a Seller</h1>
          <p className="subtitle">Join our seller community and start selling today!</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="registration-form">
          {/* Name Fields */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <FaUser className="label-icon" />
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter first name"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">
              <FaEnvelope className="label-icon" />
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Mobile */}
          <div className="form-group">
            <label className="form-label">
              <FaPhone className="label-icon" />
              Mobile Number *
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={(e) => {
                // Only allow numbers and limit to 10 digits
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                setFormData(prev => ({
                  ...prev,
                  mobile: value
                }));
                setError("");
              }}
              className="form-input"
              placeholder="Enter 10-digit mobile number"
              maxLength="10"
              required
            />
            <p className="form-help">
              Enter your 10-digit mobile number (e.g., 9876543210)
            </p>
          </div>

          {/* GSTIN */}
          <div className="form-group">
            <label className="form-label">
              <FaIdCard className="label-icon" />
              GSTIN (Optional)
            </label>
            <input
              type="text"
              name="gstin"
              value={formData.gstin}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter GSTIN if available"
            />
            <p className="form-help">
              GSTIN is required to sell products. You can add it later.
            </p>
          </div>

          {/* Password Fields */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <FaLock className="label-icon" />
                Password *
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input password-input"
                  placeholder="Create password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">
                Confirm Password *
              </label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="form-input password-input"
                  placeholder="Confirm password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? (
              <span className="loading-content">
                <div className="spinner"></div>
                Creating Account...
              </span>
            ) : (
              "Create Seller Account"
            )}
          </button>
        </form>

        {/* Terms */}
        <div className="terms-section">
          <p className="terms-text">
            By creating an account, you agree to our{" "}
            <a href="#" className="terms-link">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="terms-link">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}