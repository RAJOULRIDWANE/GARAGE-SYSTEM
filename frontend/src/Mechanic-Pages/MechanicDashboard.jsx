import { useState, useEffect, useCallback, useMemo } from 'react';
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

    const [repairs, setRepairs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
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

    const formatDate = (dateString) => {
        if (!dateString) return 'ASAP';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // --- Data Fetching ---
    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('ACCESS_TOKEN');

        try {
            const [userRes, jobsRes] = await Promise.all([
                axios.get('http://127.0.0.1:8000/api/user', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://127.0.0.1:8000/api/mechanic/jobs', { headers: { Authorization: `Bearer ${token}` } })
            ]);

            const userData = {
                name: userRes.data.name || userRes.data.user?.name,
                role: userRes.data.role || userRes.data.user?.role
            };
            setUser(userData);
            localStorage.setItem('USER_NAME', userData.name);
            localStorage.setItem('USER_ROLE', userData.role);

            setRepairs(jobsRes.data.data || []);

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

        const previousRepairs = [...repairs];
        setRepairs(prevRepairs => 
            prevRepairs.map(r => r.id === repairId ? { ...r, status: newStatus } : r)
        );

        try {
            await axios.patch(
                `http://127.0.0.1:8000/api/mechanic/jobs/${repairId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            showMessage(`Repair Status have been modified successfully`, 'success');
        } catch (err) {
            console.error(err);
            setRepairs(previousRepairs);
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

    // --- KPI Calculation (Memoized) ---
    const kpiData = useMemo(() => {
        if (!Array.isArray(repairs)) return { ActiveJobs: 0, completed: 0, pending: 0 };
        // Normalize status for KPI calculation to handle case sensitivity
        const normalize = (s) => s?.toLowerCase() || '';
        return {
            ActiveJobs: repairs.filter(r => !normalize(r.status).includes('completed')).length,
            completed: repairs.filter(r => normalize(r.status).includes('completed')).length,
            pending: repairs.filter(r => normalize(r.status).includes('pending')).length
        };
    }, [repairs]);

    // --- Get all services for a job ---
    const getJobServices = (job) => {
        if (job.services && Array.isArray(job.services) && job.services.length > 0) {
            return job.services;
        }
        if (job.service) {
            return [job.service];
        }
        return [];
    };

    // --- Custom Dropdown Component (FIXED) ---
    const StatusDropdown = ({ currentStatus, onStatusChange }) => {
        const [isOpen, setIsOpen] = useState(false);

        // CONFIG: Added 'apiValue' to send exact string DB expects
        const statusConfig = {
            pending: { 
                label: 'Pending', 
                // icon: 'fa-hourglass-start', 
                colorClass: 'pending',
                apiValue: 'pending' 
            },
            progress: { 
                label: 'In Progress', 
                // icon: 'fa-wrench', 
                colorClass: 'progress',
                apiValue: 'in_progress' // FIX: Uses snake_case for API
            },
            completed: { 
                label: 'Completed', 
                // icon: 'fa-check-circle', 
                colorClass: 'completed',
                apiValue: 'completed' 
            }
        };

        // FIX: Fuzzy matching helper to handle "In Progress" vs "in_progress" vs "progress"
        const getStatusKey = (status) => {
            if (!status) return 'pending';
            const s = status.toLowerCase();
            if (s.includes('progress')) return 'progress';
            if (s.includes('completed')) return 'completed';
            return 'pending';
        };

        const activeKey = getStatusKey(currentStatus);
        const currentConfig = statusConfig[activeKey];

        const handleSelect = (e, key) => {
            e.stopPropagation();
            // FIX: Send the apiValue (e.g. 'in_progress') instead of the key
            onStatusChange(statusConfig[key].apiValue);
            setIsOpen(false);
        };

        return (
            <div 
                className="custom-dropdown-wrapper" 
                onMouseLeave={() => setIsOpen(false)}
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    className={`dropdown-trigger ${currentConfig.colorClass}`} 
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                    }}
                >
                    <i className={` ${currentConfig.icon}`}></i>
                    <span>{currentConfig.label}</span>
                </button>

                {isOpen && (
                    <div className="dropdown-menu">
                        {Object.keys(statusConfig).map((key) => (
                            <div 
                                key={key} 
                                className={`dropdown-item ${key === activeKey ? 'active' : ''}`}
                                onClick={(e) => handleSelect(e, key)}
                            >
                                <i className={`fa-solid ${statusConfig[key].icon}`}></i>
                                <span>{statusConfig[key].label}</span>
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
                                <span>Awaiting tasks</span>
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
                        {message && (
                            <div className={`alert-message ${messageType}`} style={{marginLeft: '20px', display:'inline-block', padding: '5px 10px', borderRadius:'4px'}}>
                                <span>{message}</span>
                            </div>
                        )}
                    </div>

                    <div className="task-list">
                        {loading ? (
                            <div className="section-loading">
                                <div className="spinner-mini"></div>
                                <span>Loading jobs...</span>
                            </div>
                        ) : repairs.length === 0 ? (
                            <div className="no-tasks">
                                <p>🎉 You have no assigned jobs at the moment.</p>
                            </div>
                        ) : (
                            repairs.map(job => (
                                <div 
                                    key={job.id} 
                                    className={`task-card ${job.status?.toLowerCase().includes('completed') ? 'card-completed' : ''}`}
                                    onClick={() => {
                                        if (!job.status?.toLowerCase().includes('completed')) {
                                            navigate(`/mechanic/repair/${job.id}`);
                                        }
                                    }}
                                    style={{ 
                                        cursor: !job.status?.toLowerCase().includes('completed') ? 'pointer' : 'default',
                                        opacity: job.status?.toLowerCase().includes('completed') ? 0.7 : 1 
                                    }}
                                >
                                    <div className="task-details">
                                        {/* Services Badges */}
                                        <div className="services-badges">
                                            {getJobServices(job).map((service, idx) => (
                                                <span key={idx} className="service-badge">
                                                    {service.name}
                                                </span>
                                            ))}
                                        </div>
                                        
                                        {/* Client Name */}
                                        <span className="client-name">
                                            <i className="fa-solid fa-user"></i> 
                                            {job.vehicle?.owner_name || 'Unknown Client'}
                                        </span>
                                        
                                        {/* Car Model */}
                                        <span className="car-model">
                                            <i className="fa-solid fa-car"></i> 
                                            {job.vehicle?.make} {job.vehicle?.model} ( {job.vehicle?.plate_number || 'N/A'} )
                                        </span>
                                        
                                        {/* Due Date */}
                                        <span className="due-date">
                                            <i className="fa-solid fa-calendar"></i> Due: {formatDate(job.date_end)}
                                        </span>
                                        
                                        {/* Description */}
                                        <span className='DESC' title={job.description}>
                                            <i className="fa-solid fa-circle-info"></i> 
                                            {job.description ? (job.description.length > 50 ? job.description.substring(0, 50) + '...' : job.description) : 'No description'}
                                        </span>
                                    </div>

                                    <div className="task-action" onClick={(e) => e.stopPropagation()}>
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