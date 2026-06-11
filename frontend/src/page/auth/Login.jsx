import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import authService from '../../services/authService';
import '../../css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/foods';

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await authService.login(email, password);

      if (result.success) {
        if (result.user.role === 'ADMIN') {
          navigate('/foods/admin');
        } else {
          navigate(from);
        }
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data ||
        err.message ||
        'Login failed. Please check credentials.'
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

        <h2>Welcome Back</h2>

        <p className="auth-subtitle">
          Sign in to manage your inventory and order delicious food
        </p>

        {error && <div className="auth-error-banner">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="name@quickbite.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-btn btn-primary"
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>

        <div className="demo-credentials">
          <p>
            <strong>Demo Note:</strong> Admin features require an account with role ADMIN.
            Users registered via the frontend get the USER role by default.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;