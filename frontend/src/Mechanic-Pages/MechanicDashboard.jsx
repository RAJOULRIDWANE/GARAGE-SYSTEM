import { useState, useEffect } from 'react'; // 👈 Import useEffect
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import DashboardNavbar from '../components/DashboardNavbar'; 
import "./MechanicDashboard.css";

const MechanicDashboard = () => {
  const navigate = useNavigate();

  // 1. Define User State
  const [user, setUser] = useState({ 
    name: localStorage.getItem('USER_NAME'), 
    role: localStorage.getItem('USER_ROLE'),
  });

  // 2. 🆕 FETCH DATA ON LOAD
  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    try {
      const token = localStorage.getItem('ACCESS_TOKEN');
      
      // Fetch the currently logged-in user
      const res = await axios.get('http://127.0.0.1:8000/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Handle the response (works whether backend returns 'user' object or flat data)
      const userData = {
        name: res.data.name || res.data.user?.name, 
        role: res.data.role || res.data.user?.role
      };

      // Update State and Storage
      setUser(userData);
      localStorage.setItem('USER_NAME', userData.name);
      localStorage.setItem('USER_ROLE', userData.role);

    } catch (err) {
      // Silently handle error or redirect if unauthorized
      if(err.response && err.response.status === 401) {
          localStorage.clear();
          navigate('/login'); 
      }
    }
  };

  // 3. Define Logout Function
  const handleLogout = async () => {
    try {
        const token = localStorage.getItem('ACCESS_TOKEN');
        await axios.post('http://127.0.0.1:8000/api/logout', {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        console.error("Logout failed", error);
    }
    localStorage.clear();
    navigate('/login');
  };

  const openPasswordModal = () => {
    console.log("Open Password Modal");
  };

  return (
    <div className="client-dashboard-container"> 
      
      <DashboardNavbar 
        user={user} 
        onLogout={handleLogout} 
        onChangePassword={openPasswordModal} 
      />
    
      <div className="dashboard-content">
         <h1>Mechanic Dashboard </h1>
      </div>

    </div>
  );
};

export default MechanicDashboard;