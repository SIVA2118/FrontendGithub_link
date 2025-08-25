import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const { login, API_BASE } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ✅ Client-side validation for mobile number
    if (!/^\d{10}$/.test(form.mobileNumber)) {
      setError("Mobile number must be exactly 10 digits");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      login(data);
      nav('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join us and explore amazing features</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="grid grid-cols-2 gap-3">
            <input
              name="firstName"
              className="auth-input"
              placeholder="First name"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <input
              name="lastName"
              className="auth-input"
              placeholder="Last name"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <input
            name="mobileNumber"
            className="auth-input"
            placeholder="Mobile number"
            value={form.mobileNumber}
            onChange={handleChange}
            maxLength="10"
            required
          />

          <input
            name="email"
            type="email"
            className="auth-input"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            className="auth-input"
            placeholder="Password (min 6)"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Sign up'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
}
