import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";
import DashboardNavbar from '../components/DashboardNavbar';
import "./ReceptionistClientDetails.css"; 

const ReceptionistClientDetails = () => {
  const { id, name } = useParams(); 
  const navigate = useNavigate();

  // Clean up the name from URL
  const clientNameDisplay = name ? decodeURIComponent(name).replace(/-/g, ' ') : 'Client';

  const [user, setUser] = useState({ 
    name: localStorage.getItem('USER_NAME') || 'Receptionist', 
    role: localStorage.getItem('USER_ROLE') || 'Receptionist' 
  });

  const [client, setClient] = useState(null);
  const [repairs, setRepairs] = useState([]);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if(id) fetchClientDetails();
  }, [id]);

  const fetchClientDetails = async () => {
    try {
        const token = localStorage.getItem('ACCESS_TOKEN');
        const res = await axios.get(`http://127.0.0.1:8000/api/receptionist/client/${id}/repairs`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        

        setClient(res.data.client);
        setRepairs(res.data.repairs);
    } catch (err) {
        console.error("Error fetching details:", err);
    }
  };

  const handleLogout = async () => {
      try {
          const token = localStorage.getItem('ACCESS_TOKEN');
          await axios.post('http://127.0.0.1:8000/api/logout', {}, {
              headers: { Authorization: `Bearer ${token}` }
          });
      } catch (error) { console.error("Logout failed", error); }
      localStorage.clear();
      navigate('/login');
  };

  // --- KPI Calculation Logic ---
  const totalSpent = repairs.reduce((sum, job) => sum + Number(job.cost || 0), 0);
  const totalVisits = repairs.length;

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0]; 

  const todaysAppointments = repairs.filter(r => 
      r.date_end && r.date_end.startsWith(todayStr)
  ).length;

  const confirmedToday = repairs.filter(r => {
      if (!r.date_end || !r.status) return false;
      const isToday = r.date_end.startsWith(todayStr);
      const status = r.status.toLowerCase().trim();
      return isToday && status === 'completed';
  }).length;

  // --- Search Filter Logic ---
  const filteredRepairs = repairs.filter(job => {
      if (!searchTerm) return true;
      // Check both plate and plate_number just in case
      const plate = job.vehicle?.plate_number || job.vehicle?.plate || '';
      return plate.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // --- Invoice Logic ---
  const handleDownloadInvoice = (invoice, clientName, vehicleInfo, jobCost) => {
    const finalAmount = invoice?.amount || jobCost || "0.00";
    let invNumber = invoice?.invoice_number || "INV-DRAFT";
    let invDate = invoice?.created_at ? new Date(invoice.created_at) : new Date();
    let invStatus = invoice?.status || "Pending";

    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.text("GARAGE SERVICE INVOICE", 105, 20, null, null, "center");
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Invoice No:", 20, 40);
    doc.text("Date:", 20, 50);
    doc.text("Status:", 20, 60);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(invNumber, 50, 40);
    doc.text(invDate.toLocaleDateString(), 50, 50);
    
    const statusColor = (invStatus === 'paid') ? [0, 128, 0] : [200, 0, 0];
    doc.setTextColor(...statusColor);
    doc.text(invStatus.toUpperCase(), 50, 60);

    doc.setTextColor(100); 
    doc.setFontSize(10);
    doc.text("BILL TO:", 120, 40);
    doc.setTextColor(0); 
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(clientName || "Guest Client", 120, 48);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(vehicleInfo || "Unknown Vehicle", 120, 55);

    doc.setFillColor(240, 240, 240);
    doc.rect(20, 75, 170, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.text("DESCRIPTION", 25, 81);
    doc.text("AMOUNT", 160, 81);

    doc.setFont("helvetica", "normal");
    doc.text("Repair Service", 25, 95);
    doc.text(`${finalAmount} MAD`, 160, 95);
    doc.line(20, 110, 190, 110);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL DUE:", 110, 125);
    doc.text(`${finalAmount} MAD`, 160, 125);

    doc.save(`Invoice_${invNumber}.pdf`);
  };

  // --- HELPER: Slugify Status for CSS ---
  const getBadgeClass = (status) => {
      if (!status) return 'pending';
      const s = status.toLowerCase().trim();
      if (s === 'progress' || s === 'in progress') return 'in-progress'; 
      if (s === 'completed') return 'completed';
      if (s === 'cancelled') return 'cancelled';
      return 'pending'; 
  };

  // --- HELPER: Format Display Text ---
  const formatStatusLabel = (status) => {
      if (!status) return 'Pending';
      const s = status.toLowerCase().trim();
      if (s === 'progress' || s === 'in-progress' || s === 'in progress') return 'In Progress';
      return status; 
  };

  return (
    <div className="receptionist-container">
      <DashboardNavbar user={user} onLogout={handleLogout} />

      <div className="header-actions">
        <div>
            <Link to="/receptionist/dashboard" className="dashboard-back">
                ← Back to Dashboard
            </Link>
            <h1>{clientNameDisplay}'s Repair History</h1>
        </div>
      </div>
      
      {/* KPI SECTION */}
      <div className="kpi-container">
        <div className="kpi-card">
            <div className="kpi-icon">
              <i className="fa-regular fa-calendar"></i>
            </div>
            <div className="kpi-info">
                <h3>Today's Appt</h3>
                <p className="kpi-number">{todaysAppointments}</p>
            </div>
        </div>
        <div className="kpi-card">
            <div className="kpi-icon success-icon">
              <i className="fa-regular fa-circle-check"></i>
            </div>
            <div className="kpi-info">
                <h3>Confirmed Today</h3>
                <p className="kpi-number">{confirmedToday}</p>
            </div>
        </div>
        <div className="kpi-card">
            <div className="kpi-icon">
              <i className="fa-solid fa-wrench"></i>
            </div>
            <div className="kpi-info">
                <h3>Total Visits</h3>
                <p className="kpi-number">{totalVisits}</p>
            </div>
        </div>
        <div className="kpi-card">
            <div className="kpi-icon success-icon">
              <i class="fa-solid fa-wallet"></i>
            </div>
            <div className="kpi-info">
                <h3>Total Spent</h3>
                <p className="kpi-number">{totalSpent} MAD</p>
            </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="search-filter-bar">
        <input 
            type="text" 
            placeholder="Search by License Plate (e.g. 1234-A-50)..." 
            className="dashboard-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-card">
        <table>
            <thead>
                <tr>
                    <th>Vehicle</th>
                    <th>Type</th>
                    <th>Service</th>
                    <th>Mechanic</th>
                    <th>Cost</th>
                    <th>Start Date</th>
                    <th>Predicted End</th> 
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {filteredRepairs.length > 0 ? filteredRepairs.map(job => (
                    <tr key={job.id}>
                        {/* 1. Vehicle Info (Checks plate OR plate_number) */}
                        <td>
                            <strong>{job.vehicle?.make || 'Unknown'} {job.vehicle?.model || ''}</strong>
                            <div className="sub-text">
                                {/* Try all common names */}
                                {job.vehicle?.plate || 
                                job.vehicle?.plate_number || 
                                job.vehicle?.license_plate || 
                                job.vehicle?.matricule || 
                                job.vehicle?.registration_number || 
                                'No Plate'}
                            </div>
                        </td>
                        
                        {/* 2. Vehicle Type */}
                        <td>
                             <span style={{textTransform: 'capitalize', fontWeight: '500', color:'#475569'}}>
                                {job.vehicle?.type || 'Standard'}
                             </span>
                        </td>
                        
                        {/* 3. Service Name & Desc */}
                        <td>
                            <strong>{job.service?.name || 'Custom Service'}</strong>
                            <div className="sub-text">
                                {job.description || 'No description'}
                            </div>
                        </td>
                        
                        {/* 4. Mechanic Name */}
                        <td>
                             {job.mechanic ? (
                                <span className="mechanic-name">
                                   {job.mechanic.name}
                                </span>
                             ) : <span className="unassigned">Unassigned</span>}
                        </td>
                        
                        {/* Cost */}
                        <td style={{fontWeight:'bold'}}>{job.cost} MAD</td>
                        
                        {/* 5. Start Date (Checks date_start OR created_at) */}
                        <td>
                             {new Date(job.date_start || job.created_at).toLocaleString('en-GB', {
                                day: '2-digit', month: '2-digit', year: 'numeric'
                             })}
                        </td>

                        {/* Predicted End Date */}
                        <td>
                             {job.date_end ? new Date(job.date_end).toLocaleString('en-GB', {
                                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC'
                             }) : <span className="sub-text">TBD</span>}
                        </td>
                        
                        {/* Status */}
                        <td>
                            <span className={`status-badge ${getBadgeClass(job.status)}`}>
                                {formatStatusLabel(job.status)}
                            </span>
                        </td>

                        {/* Actions */}
                        <td>
                            <button 
                                className="action-btn" 
                                style={{
                                    marginRight:'8px', 
                                    backgroundColor: '#dbeafe', 
                                    color:'#1e40af',
                                }}
                                title="Open Live Monitor"
                                onClick={() => navigate(`/track-repair/${job.id}`)}
                            >
                                <i className="fa-solid fa-eye"></i>
                            </button>

                            <button className="action-btn invoice-btn" onClick={() => handleDownloadInvoice(
                                job.invoice, 
                                clientNameDisplay, 
                                `${job.vehicle?.make} ${job.vehicle?.model}`, 
                                job.cost
                            )}>
                                <i className="fa-solid fa-file-arrow-down"></i>
                            </button>
                        </td>
                    </tr>
                )) : (
                    <tr><td colSpan="9" style={{textAlign:'center', padding:'20px'}}>No records found matching "{searchTerm}".</td></tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReceptionistClientDetails;