import React, { useState } from 'react';
import './ForgotPassword.css';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sending login link to:', email);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F9FAFB',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '60px 80px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        maxWidth: '660px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#2B7FE8', fontSize: '32px', marginBottom: '40px' }}>
          Trouble Logging in ?
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: 'left', marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151' }}>
              Email
            </label>
            <input
              type="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#2B7FE8',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              marginBottom: '25px'
            }}
          >
            Send Login Link
          </button>

          <div style={{ margin: '25px 0', color: '#9CA3AF' }}>OR</div>

          <Link 
            to="/signup"
            style={{
              color: '#2B7FE8',
              fontSize: '14px',
              textDecoration: 'none'
            }}
          >
            Create New Account
          </Link>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;