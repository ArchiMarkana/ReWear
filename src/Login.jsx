import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "./utils/auth";
import "./Login.css";
import logo from "./assets/logo.png";

function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    countryCode: "+91"
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      // Signup Mode
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const userData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          countryCode: formData.countryCode
        };

        await registerUser(userData);
        alert("Account created successfully!");
        navigate("/"); // redirect to homepage
      } catch (err) {
        console.error("Signup Error:", err);
        alert(err.message || "Signup failed!");
      }
    } else {
      // Login Mode
      try {
        await loginUser(formData.email, formData.password);
        alert("Login successful!");
        navigate("/"); // redirect to homepage
      } catch (err) {
        console.error("Login Error:", err);
        alert(err.message || "Login failed! Please check your credentials.");
      }
    }

    // Reset form
    setFormData({ 
      firstName: "", 
      lastName: "", 
      email: "", 
      password: "", 
      confirmPassword: "",
      phoneNumber: "",
      countryCode: "+91"
    });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <Link to="/" className="home-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z"/>
            </svg>
            Home
          </Link>
        </div>
        
        <div className="logo-container">
          <img src={logo} alt="ReWear Logo" className="app-logo" />
        </div>

        <h2>{isSignUp ? "Create Account" : "Login"}</h2>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {isSignUp && (
            <>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  style={{ flex: '0 0 80px' }}
                >
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                </select>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number (Optional)"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  style={{ flex: 1 }}
                />
              </div>
            </>
          )}

          <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
        </form>

        <p className="toggle-text">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <span onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Login here" : "Sign up here"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
