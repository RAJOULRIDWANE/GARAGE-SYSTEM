import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Ensure you have axios installed
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      // Connect to your Laravel Backend
      // Ensure this matches your actual backend URL
      const response = await axios.post('http://127.0.0.1:8000/api/forgot-password', { email });
      setMessage(response.data.message || 'Reset link sent to your email.');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="auth-card">
        <div className="auth-header">
            <div className="info-icon">
                <i class="fa-solid fa-shield-halved"></i>
            </div>
          <h1>Trouble Logging In?</h1>
          <p>Enter your email and we'll send you a link to get back into your account.</p>
        </div>

        {/* Feedback Messages */}
        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" className="form-input" placeholder="Enter your email"  value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Sending...' : 'Reset Password'}
          </button>

          <div className="divider">
                <p> OR </p>
          </div>

          <Link to="/signup" className="auth-link-button small"> Create New Account </Link>
        </form>


      </div>
    </div>
  );
}

export default ForgotPassword;