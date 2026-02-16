import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import './ClientDashboard.css';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [vehicles, setVehicles] = useState([]); // NEW: Add vehicles state
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: 'Client' });

  useEffect(() => {
    fetchDashboardData();
    fetchVehicles(); // NEW: Fetch vehicles on load
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('ACCESS_TOKEN');
      const userData = JSON.parse(localStorage.getItem('USER_DATA') || '{}');
      setUser(userData);

      const res = await axios.get('http://127.0.0.1:8000/api/client/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      setLoading(false);
    }
  };

  // NEW: Function to fetch vehicles
  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('ACCESS_TOKEN');
      const res = await axios.get('http://127.0.0.1:8000/api/vehicles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehicles(res.data);
    } catch (error) {
      console.error("Error loading vehicles:", error);
    }
  };

  const handleDownloadInvoice = (repairId) => {
    alert("Downloading Invoice for repair #" + repairId);
  };

  const handleLeaveComment = (mechanicName) => {
    alert(`Leaving a comment for ${mechanicName}`);
  };

  // NEW: Function to get vehicle icon based on type
  const getVehicleIcon = (type) => {
    switch(type) {
      case 'moto':
      case 'moteur':
        return 'fa-motorcycle';
      case 'truck':
        return 'fa-truck';
      case 'bus':
        return 'fa-bus';
      default:
        return 'fa-car';
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading your space...</div>;
  }

  return (
    <div className="client-dashboard-bg">
      <DashboardNavbar user={user} onLogout={() => navigate('/login')} />

      <div className="client-container">
        
        {/* HEADER WITH ADD VEHICLE BUTTON */}
        <div className="dashboard-header">
          <div className="dashboard-header-left">
            <h1>My Client Space</h1>
            <p>Manage your vehicles & appointments</p>
          </div>
          <Link to="/client/add-vehicle" className="add-vehicle-btn">
            <i className="fa-solid fa-plus"></i>
            Add Vehicle
          </Link>
        </div>

        {/* TOP KPI CARDS */}
        <div className="kpi-row">
          {/* My Vehicles */}
          <div className="kpi-card-client">
            <div className="kpi-text">
              <span className="kpi-label">My Vehicles</span>
              <span className="kpi-value">{vehicles.length || 0}</span>
            </div>
            <div className="kpi-icon-bubble blue">
              <i className="fa-solid fa-car"></i>
            </div>
          </div>

          {/* Active Repairs */}
          <div className="kpi-card-client">
            <div className="kpi-text">
              <span className="kpi-label">Active Repairs</span>
              <span className="kpi-value">{data?.kpi?.active_repairs || 0}</span>
            </div>
            <div className="kpi-icon-bubble green">
              <i className="fa-solid fa-wrench"></i>
            </div>
          </div>

          {/* Invoices Due */}
          <div className="kpi-card-client">
            <div className="kpi-text">
              <span className="kpi-label">Invoices Due</span>
              <span className="kpi-value">{data?.kpi?.invoices_due || 0}</span>
            </div>
            <div className="kpi-icon-bubble orange">
              <i className="fa-solid fa-file-invoice-dollar"></i>
            </div>
          </div>
        </div>

        {/* NEW: MY VEHICLES SECTION */}
        <h2 className="section-title">My Vehicles</h2>
        
        {vehicles && vehicles.length > 0 ? (
          <div className="vehicles-grid">
            {vehicles.map((vehicle) => (
              <div className="vehicle-card" key={vehicle.id}>
                <div className="vehicle-card-icon">
                  <i className={`fa-solid ${getVehicleIcon(vehicle.type)}`}></i>
                </div>
                <div className="vehicle-card-info">
                  <h3>{vehicle.make} {vehicle.model}</h3>
                  <p className="vehicle-year">{vehicle.year}</p>
                  <p className="vehicle-plate">{vehicle.license_plate}</p>
                  <span className={`vehicle-type-badge ${vehicle.type}`}>
                    {vehicle.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <i className="fa-solid fa-car" style={{fontSize: '48px', color: '#ccc', marginBottom: '15px'}}></i>
            <p>No vehicles added yet.</p>
            <Link to="/client/add-vehicle" className="add-first-vehicle-btn">
              <i className="fa-solid fa-plus"></i>
              Add Your First Vehicle
            </Link>
          </div>
        )}

        {/* CURRENT ACTIVE REPAIRS */}
        <h2 className="section-title" style={{marginTop: '50px'}}>Current Progress</h2>
        
        {data?.current_jobs && data.current_jobs.length > 0 ? (
          data.current_jobs.map((job) => (
            <div className="active-job-container" key={job.id}>
              
              {/* Left Card: Vehicle Info */}
              <div className="job-card">
                <div className="job-icon blue-bg">
                  <i className="fa-solid fa-car-side"></i>
                </div>
                <div className="job-details">
                  <h3>{job.vehicle?.make} {job.vehicle?.model}</h3>
                  <p className="plate-number">{job.vehicle?.license_plate || job.vehicle?.plate || 'N/A'}</p>
                  <p className="job-date">Entry: {new Date(job.created_at).toLocaleDateString()}</p>
                </div>
                {job.status === 'Completed' && (
                  <button 
                    className="invoice-btn-outline" 
                    onClick={() => handleDownloadInvoice(job.id)}
                  >
                    <i className="fa-solid fa-file-pdf"></i>
                    Download Invoice
                  </button>
                )}
              </div>

              {/* Right Card: Mechanic Info */}
              <div className="job-card">
                <div className="job-icon blue-bg">
                  <i className="fa-solid fa-user-gear"></i>
                </div>
                <div className="job-details">
                  <h3>{job.mechanic?.name || 'Assigned Team'}</h3>
                  <p className="role-text">Car Expert</p>
                  <span className={`status-pill ${job.status.toLowerCase().replace(' ', '-')}`}>
                    {job.status}
                  </span>
                </div>
                <button 
                  className="comment-btn-outline" 
                  onClick={() => handleLeaveComment(job.mechanic?.name)}
                >
                  <i className="fa-regular fa-comments"></i>
                  Leave Comment
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>You have no active repairs at the moment.</p>
          </div>
        )}

        {/* LATEST REPAIRS HISTORY */}
        <h2 className="section-title" style={{marginTop: '50px'}}>Latest Activity</h2>
        <div className="history-list">
          {data?.history && data.history.length > 0 ? (
            data.history.map((job) => (
              <div className="history-card" key={job.id}>
                <div className="history-icon">
                  <i className="fa-solid fa-screwdriver-wrench"></i>
                </div>
                <div className="history-info">
                  <h3>{job.service?.name || job.description || 'General Service'}</h3>
                  <p>{job.vehicle?.make} {job.vehicle?.model}</p>
                  <span className="ready-date">
                    {job.date_end ? `Ready: ${job.date_end}` : `Status: ${job.status}`}
                  </span>
                </div>
                <div className="history-status">
                  <span className={`status-badge-small ${job.status.toLowerCase().replace(' ', '-')}`}>
                    {job.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No repair history available.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ClientDashboard;