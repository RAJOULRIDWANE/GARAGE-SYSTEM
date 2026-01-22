import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import './Auth.css'
import '@fortawesome/fontawesome-free/css/all.min.css';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      if (response.status === 201) {
        alert('Account created successfully!');
        navigate('/login');
      }
    } catch (error) {
      alert('Signup failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <main className="page-content auth-page">
      <div className="auth-inner">
        <section className="auth-hero">
          <div className="auth-hero-overlay" />
          <div className="auth-hero-content">
            <h1>Join Us Today!</h1>
            <p>Create your account and bring us your vehicle!</p>
          </div>
        </section>
        <section className="auth-form-panel">
          <div className="auth-form-card">
            <div className="auth-avatar">
              <div className="auth-avatar-icon">
                <i className="fa-regular fa-user"></i>
              </div>
            </div>
            <h2>Create Account</h2>
            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >
              <label className="auth-field">
                <span>Full Name</span>
                <input type="text" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} required />
              </label>
              <label className="auth-field">
                <span>Email</span>
                <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
              </label>
              <label className="auth-field">
                <span>Password</span>
                <input type="password" name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} required />
              </label>
              <label className="auth-field">
                <span>Confirm Password</span>
                <input type="password" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} required />
              </label>
              <button type="submit" className="btn-primary auth-submit">
                Sign up
              </button>
            </form>
            <p className="auth-footer-text">
              Already have an account?{' '} <Link to="/login" className="auth-link-button"> Login </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Signup
