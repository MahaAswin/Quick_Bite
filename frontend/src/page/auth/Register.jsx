import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import '../../css/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password, phoneNo } = formData;

    if (!name || !email || !password || !phoneNo) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const responseText = await authService.register(
        name,
        email,
        password,
        phoneNo
      );

      if (responseText === 'User Registered Successfully') {
        setSuccess('Registration successful! Redirecting to login...');

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(responseText || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data ||
        err.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glassmorphic">
        <div className="auth-logo">
          <span className="logo-quick">Quick</span>
          <span className="logo-bite">Bite</span>
        </div>

        <h2>Create Account</h2>

        <p className="auth-subtitle">
          Join us to order food and explore menu features
        </p>

        {error && <div className="auth-error-banner">{error}</div>}
        {success && <div className="auth-success-banner">{success}</div>}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNo">Phone Number</label>
            <input
              type="tel"
              id="phoneNo"
              placeholder="9876543210"
              value={formData.phoneNo}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-btn btn-primary"
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;