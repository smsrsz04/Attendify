import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import './Loginpage.css'; 

import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = () => {
    if (formData.email && formData.password) {
      // In a real app, you would verify credentials first
      console.log('Login successful!');
      navigate('/Dashboard'); // This redirects to dashboard
    } else {
      alert('Please fill in both fields');
    }
  };


  return (
    <div className="body">
      <div className="container">
        <div className="login-card">
          {/* User Icon */}
    

          {/* Header */}
          <h1 className="title">Attendify!</h1>
          <p className="subtitle">Please provide your credentials to log in</p>

          {/* Email Field */}
          <div className="form-group">
            <div className="input-wrapper">
              <Mail size={20} className="input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="form-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="eye-icon"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="forgot-password">
            <button type="button" className="forgot-link">
              Forgot Password?
            </button>
          </div>

          {/* Sign In Button */}
          <button onClick={handleLogin} className="signin-btn">
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;