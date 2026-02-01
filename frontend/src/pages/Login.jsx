import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import './Auth.css'
import '@fortawesome/fontawesome-free/css/all.min.css';

function Login() { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // --- ADDED STATE FOR VISIBILITY ---
  const [showPassword, setShowPassword] = useState(false); 
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 
    console.log("Attempting login with:", email); 

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email: email,
        password: password
      });

      console.log("Login Data:", response.data); 

      const token = response.data.token;
      const user = response.data.user; 

      // --- 1. CLEAR OLD DATA ---
      localStorage.clear(); 

      // --- 2. SAVE TOKEN ---
      localStorage.setItem('ACCESS_TOKEN', token);

      // --- 3. SAVE USER DETAILS INDIVIDUALLY ---
      Object.keys(user).forEach(key => {
          localStorage.setItem(key, user[key]);
      });
      localStorage.setItem('USER_ROLE', user.role); 


      // --- 4. REDIRECT ---
      if (user.role === 'client') {
        navigate('/client/dashboard');
      } else if (user.role === 'supervisor') {
        navigate('/supervisor/dashboard'); 
      } else if (user.role === 'mechanic') {
        navigate('/mechanic/dashboard'); 
      } else if (user.role === 'receptionist') {
        navigate('/receptionist/dashboard');
      } else if (user.role === 'parts_manager') {
        navigate('/partsmanager/dashboard');
      } else {
        navigate('/'); 
      }

    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(err.response.data.message || "Login failed");
      } else {
        setError("Network error. Is Laravel running?"); 
      }
    }
  };

  return (
    <main className="page-content auth-page">
      <div className="auth-inner">
        <section className="auth-hero">
          <div className="auth-hero-overlay" />
          <div className="auth-hero-content">
            <h1>Welcome Back!</h1>
            <p>Create your account and bring us your vehicle!</p>
          </div>
        </section>
        <section className="auth-form-panel">
          <div className="auth-form-card">
            <div className="auth-avatar">
              <div className="auth-avatar-icon">
                <i className="fa-solid fa-user-check"></i>
              </div>
            </div>
            <h2>Welcome Back!</h2>
            
            {/* Display Error Message here */}
            {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}

            <form className="auth-form" onSubmit={handleLogin}> 
              <label className="auth-field">
                <span>Email</span>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                />
              </label>
              
              <label className="auth-field">
                <span>Password</span>
                {/* --- ADDED WRAPPER FOR RELATIVE POSITIONING --- */}
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? "text" : "password"} // TOGGLE TYPE HERE
                    placeholder="Enter your password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                    style={{ paddingRight: '40px' }} // Make space for the icon
                  />
                  {/* --- ADDED TOGGLE BUTTON --- */}
                  <button 
                    type="button" 
                    className="eye-button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={showPassword ? "ri-eye-line" : "ri-eye-close-line"}></i>
                  </button>
                </div>
              </label>
              
              <div className="auth-extra-row">
                <button type="button" className="auth-link-button small">   {' '} <Link to="/forgot-password">  Forgot password? </Link>
                </button>
              </div>
              
              <button type="submit" className="btn-primary auth-submit">
                Login
              </button>
            </form>

            <p className="auth-footer-text">
              Don't have an account?{" "} 
              <Link to="/signup" className="auth-link-button"> Sign up </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Login