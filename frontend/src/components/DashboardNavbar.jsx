import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardNavbar.css';

const DashboardNavbar = ({ user }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const initial = user.name ? user.name.charAt(0).toUpperCase() : '';

  return (
    <nav className="dashboard-navbar">
      <div className="navbar-left">
          <span className="welcome-text">Welcome Back</span>
          <h2 className="user-name">{user.name} !!</h2>
        </div>

      <div className="navbar-right">
        <div className="profile-container" onClick={toggleDropdown}>
          <div className="avatar-circle">{initial}</div>
          <div className="profile-info">
            <span className="p-name">{user.name}</span>
            <span className="p-role">{user.role}</span>
          </div>
          <span className="dropdown-arrow">▼</span>

          {showDropdown && (
            <div className="dropdown-menu">
              <button onClick={() => navigate(`/${user.role.toLowerCase()}/profile `)} className="dropdown-item">
                <i class="fa-regular fa-user"></i> Profile
              </button>
              <button onClick={handleLogout} className="dropdown-item logout">
                <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;