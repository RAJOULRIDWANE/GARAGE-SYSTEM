import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardNavbar from '../components/DashboardNavbar';
import './ClientDashboard.css';

const ClientDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: 'Client' });

  useEffect(() => {
    fetchDashboardData();
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

  const handleDownloadInvoice = (repairId) => {
    // Logic to download invoice
    alert("Downloading Invoice for repair #" + repairId);
  };

  const handleLeaveComment = (mechanicName) => {
    // Logic to open chat or comment modal
    alert(`Leaving a comment for ${mechanicName}`);
  };

  if (loading) return <div className="loading-screen">{t('dashboard.loading')}</div>;

  return (
    <div className="client-dashboard-bg">
      <DashboardNavbar user={user} onLogout={() => navigate('/login')} />

      <div className="client-container">

        {/* HEADER */}
        <div className="dashboard-header">
          <h1>{t('dashboard.title')}</h1>
          <p>{t('dashboard.subtitle')}</p>
        </div>

        {/* 1. TOP KPI CARDS */}
        <div className="kpi-row">
          {/* My Vehicles */}
          <div className="kpi-card-client">
            <div className="kpi-text">
              <span className="kpi-label">{t('dashboard.my_vehicles')}</span>
              <span className="kpi-value">{data?.kpi.vehicles_count}</span>
            </div>
            <div className="kpi-icon-bubble blue">
              <i className="fa-solid fa-car"></i>
            </div>
          </div>

          {/* Active Repairs */}
          <div className="kpi-card-client">
            <div className="kpi-text">
              <span className="kpi-label">{t('dashboard.active_repairs')}</span>
              <span className="kpi-value">{data?.kpi.active_repairs}</span>
            </div>
            <div className="kpi-icon-bubble green">
              <i className="fa-regular fa-calendar-check"></i>
            </div>
          </div>

          {/* Invoices */}
          <div className="kpi-card-client">
            <div className="kpi-text">
              <span className="kpi-label">{t('dashboard.invoices_due')}</span>
              <span className="kpi-value">{data?.kpi.invoices_due}</span>
            </div>
            <div className="kpi-icon-bubble orange">
              <i className="fa-solid fa-file-invoice-dollar"></i>
            </div>
          </div>
        </div>

        {/* 2. MIDDLE SECTION: CURRENT ACTIVE REPAIRS */}
        <h2 className="section-title">{t('dashboard.current_progress')}</h2>

        {data?.current_jobs.length > 0 ? (
          data.current_jobs.map((job) => (
            <div className="active-job-container" key={job.id}>

              {/* Left Card: Vehicle Info */}
              <div className="job-card">
                <div className="job-icon blue-bg">
                  <i className="fa-solid fa-car-side"></i>
                </div>
                <div className="job-details">
                  <h3>{job.vehicle?.make} {job.vehicle?.model}</h3>
                  <p className="plate-number">{job.vehicle?.plate_number || job.vehicle?.plate}</p>
                  <p className="job-date">{t('dashboard.entry_date')}: {new Date(job.created_at).toLocaleDateString()}</p>
                </div>
                {job.status === 'Completed' && (
                  <button className="invoice-btn-outline" onClick={() => handleDownloadInvoice(job.id)}>
                    <i className="fa-solid fa-file-pdf"></i> {t('dashboard.download_invoice')}
                  </button>
                )}
              </div>

              {/* Right Card: Mechanic Info */}
              <div className="job-card">
                <div className="job-icon blue-bg">
                  <i className="fa-solid fa-wrench"></i>
                </div>
                <div className="job-details">
                  <h3>{job.mechanic?.name || 'Assigned Team'}</h3>
                  <p className="role-text">{t('dashboard.expert')}</p>
                  <p className={`status-pill ${job.status.toLowerCase().replace(' ', '-')}`}>
                    {job.status}
                  </p>
                </div>
                <button className="comment-btn-outline" onClick={() => handleLeaveComment(job.mechanic?.name)}>
                  <i className="fa-regular fa-comments"></i> {t('dashboard.leave_comment')}
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>{t('dashboard.no_active_repairs')}</p>
          </div>
        )}

        {/* 3. BOTTOM SECTION: LATEST REPAIRS (History) */}
        <h2 className="section-title" style={{ marginTop: '30px' }}>{t('dashboard.latest_activity')}</h2>
        <div className="history-list">
          {data?.history.map((job) => (
            <div className="history-card" key={job.id}>
              <div className="history-icon">
                <i className="fa-solid fa-screwdriver-wrench"></i>
              </div>
              <div className="history-info">
                <h3>{job.service?.name || job.description || 'General Service'}</h3>
                <p>{job.vehicle?.make} {job.vehicle?.model}</p>
                <span className="ready-date">
                  {job.date_end ? `${t('dashboard.ready_date')}: ${job.date_end}` : `${t('dashboard.status')}: ${job.status}`}
                </span>
              </div>
              <div className="history-status">
                <span className={`status-badge-small ${job.status.toLowerCase().replace(' ', '-')}`}>
                  {job.status}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ClientDashboard;