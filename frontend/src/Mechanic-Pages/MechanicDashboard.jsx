//import { useState, useEffect, useCallback } from 'react';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import './MechanicDashboard.css';

const MechanicDashboard = () => {
    const navigate = useNavigate();

    // --- State Management ---
    const [user, setUser] = useState({
        name: localStorage.getItem('USER_NAME') || 'Mechanic',
        role: localStorage.getItem('USER_ROLE') || 'Mechanic'
    });

    const [repairs, setRepairs] = useState([]); // Renamed from 'tasks' to 'repairs'
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // Added for UI feedback
    const [messageType, setMessageType] = useState('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // --- Helpers ---
    const showMessage = (text, type) => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => {
            setMessage(null);
            setMessageType('');
        }, 4000);
    };

    // --- Data Fetching ---
    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('ACCESS_TOKEN');

        try {
            // 1. Fetch User Info
            const userRes = await axios.get('http://127.0.0.1:8000/api/user', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const userData = {
                name: userRes.data.name || userRes.data.user?.name,
                role: userRes.data.role || userRes.data.user?.role
            };
            setUser(userData);
            localStorage.setItem('USER_NAME', userData.name);
            localStorage.setItem('USER_ROLE', userData.role);

            // 2. Fetch Assigned Repairs
            const jobsRes = await axios.get('http://127.0.0.1:8000/api/mechanic/jobs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRepairs(jobsRes.data);

        } catch (err) {
            console.error("Dashboard Error:", err);
            if (err.response && err.response.status === 401) {
                showMessage('Session expired. Please log in again.', 'error');
                localStorage.clear();
                navigate('/login');
            } else {
                showMessage('Failed to load dashboard data.', 'error');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    // Initial Load
    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // --- Actions ---
    const handleStatusUpdate = async (repairId, newStatus) => {
        const token = localStorage.getItem('ACCESS_TOKEN');

        try {
            await axios.patch(
                `http://127.0.0.1:8000/api/mechanic/jobs/${repairId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            showMessage('Job status updated successfully', 'success');
            fetchDashboardData(); 
        } catch (err) {
            console.error(err);
            showMessage('Failed to update status.', 'error');
        }
    };

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

    // --- KPI Calculation ---
    const getKPIData = () => {
        return {
            // 1. Total Assigned: Everything NOT completed (Pending + In Progress)
            // This ensures yesterday's unfinished jobs are still counted here.
            ActiveJobs: repairs.filter(r => r.status !== 'completed').length,

            // 2. Completed: Just the finished jobs
            completed: repairs.filter(r => r.status === 'completed').length,

            // 3. Awaiting: Jobs that haven't started yet (Strictly Pending)
            // We exclude 'progress' here because those are already started.
            pending: repairs.filter(r => r.status === 'pending' || r.status === 'confirmed').length
        };
    };

    const kpiData = getKPIData();


    // --- Custom Dropdown Component ---
const StatusDropdown = ({ currentStatus, onStatusChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Configuration for colors and icons
    const statusConfig = {
        pending: { label: 'Pending', icon: 'fa-hourglass-start', colorClass: 'pending' },
        progress: { label: 'In Progress', icon: 'fa-wrench', colorClass: 'progress' },
        completed: { label: 'Completed', icon: 'fa-check-circle', colorClass: 'completed' }
    };

    const currentConfig = statusConfig[currentStatus] || statusConfig.pending;

    const handleSelect = (status) => {
        onStatusChange(status);
        setIsOpen(false);
    };

    return (
        <div className="custom-dropdown-wrapper" onMouseLeave={() => setIsOpen(false)}>
            <button 
                className={`dropdown-trigger ${currentConfig.colorClass}`} 
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{currentConfig.label}</span>
            </button>

            {isOpen && (
                <div className="dropdown-menu">
                    {Object.entries(statusConfig).map(([key, config]) => (
                        <div 
                            key={key} 
                            className={`dropdown-item ${key === currentStatus ? 'active' : ''}`}
                            onClick={() => handleSelect(key)}
                        >
                            <span>{config.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


    return (
        <div className="dashboard-container">

            <header className="dashboard-header">
                <DashboardNavbar 
                    user={user} 
                    onLogout={handleLogout} 
                    onChangePassword={() => setShowPasswordModal(true)} 
                />
            </header>

            <div className='main' style={{padding: '20px'}}>
                <section className="dashboard-stats">
                    <div className="section-header">
                        <h2>Dashboard</h2>
                    </div>

                    <div className="stats-container">
                        <div className="stat-card">
                            <div className="stat-info">
                                <span>Active Repairs</span>
                                <h2>{kpiData.ActiveJobs}</h2>
                            </div>
                            <div className="stat-icon blue">
                              <i className="fa-solid fa-wrench"></i>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-info">
                                <span>Completed</span>
                                <h2>{kpiData.completed}</h2>
                            </div>
                            <div className="stat-icon green">
                              <i className="fa-solid fa-check"></i>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-info">
                                <span>Awaiting tasks </span>
                                <h2>{kpiData.pending}</h2>
                            </div>
                            <div className="stat-icon orange">
                              <i className="fa-solid fa-clock-rotate-left"></i>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="tasks-section">
                    <div className="section-header">
                        <h2>My Job List</h2>
                        {/* Message Alert UI */}
                        {message && (
                            <div className={`alert-message ${messageType}`} style={{marginLeft: '20px', display:'inline-block', padding: '5px 10px', borderRadius:'4px'}}>
                                <span>{message}</span>
                            </div>
                        )}
                    </div>

                    <div className="task-list">
                        {loading ? (
                            <p>Loading jobs...</p>
                        ) : repairs.length === 0 ? (
                            <div className="no-tasks">
                                <p>🎉 You have no assigned jobs at the moment.</p>
                            </div>
                        ) : (
                            // Renamed 'task' to 'job' to match Receptionist style
                            repairs.map(job => (
                                <div 
                                    key={job.id} 
                                    className="task-card"
                                    onClick={() => {
                                        // Only navigate if job is not completed
                                        if (job.status !== 'completed') {
                                            navigate(`/mechanic/repair/${job.id}`);
                                        }
                                    }}
                                    style={{ 
                                        cursor: job.status !== 'completed' ? 'pointer' : 'default' 
                                    }}
                                >
                                    <div className="task-details">
                                        <h3>{job.description}</h3>
                                        <span className="car-model">
                                            <i className="fa-solid fa-car"></i> {job.vehicle?.make} {job.vehicle?.model} ({job.vehicle?.license_plate})
                                        </span>
                                        <span className="client-name">
                                            <i className="fa-regular fa-user"></i> {job.vehicle?.client?.name || job.vehicle?.user?.name || 'Unknown Client'}
                                        </span>
                                        <span className="due-date">
                                            <i className="fa-regular fa-calendar"></i> Due: {job.date_end ? new Date(job.date_end).toLocaleDateString() : 'ASAP'}
                                        </span>
                                    </div>

                                  <div className="task-action" onClick={(e) => e.stopPropagation()}>
                                      <label style={{fontSize: '12px', color: '#888', display: 'block', marginBottom: '4px'}}>
                                          Current Status:
                                      </label>
                                      
                                      <StatusDropdown 
                                          currentStatus={job.status} 
                                          onStatusChange={(newStatus) => handleStatusUpdate(job.id, newStatus)} 
                                      />
                                  </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>

        </div>
    );
};

export default MechanicDashboard;