import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";
import DashboardNavbar from '../components/DashboardNavbar';
import "./ReceptionistDashboard.css"; 

const ReceptionistDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({ 
    name: localStorage.getItem('USER_NAME') || 'Receptionist', 
    role: localStorage.getItem('USER_ROLE') || 'Receptionist' 
  });

  const [repairs, setRepairs] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  
  const [dashboardSearch, setDashboardSearch] = useState(''); 
  const [showFilterMenu, setShowFilterMenu] = useState(false); 
  const [statusFilter, setStatusFilter] = useState('all'); 
  const [priceSort, setPriceSort] = useState('none'); 

  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false); 
  const [message, setMessage] = useState(null); 
  const [messageType, setMessageType] = useState(''); 

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientVehicles, setClientVehicles] = useState([]);
  
  const [formData, setFormData] = useState({
    vehicle_id: '',
    mechanic_id: '',
    description: '',
    cost: '',
    date_end: '' 
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('ACCESS_TOKEN');
      const res = await axios.get('http://127.0.0.1:8000/api/receptionist/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.user) {
          const userData = {
            name: res.data.user.name,
            role: res.data.user.role
          };
          setUser(userData);
          localStorage.setItem('USER_NAME', userData.name);
          localStorage.setItem('USER_ROLE', userData.role);
      }

      setRepairs(res.data.repairs || []);
      setMechanics(res.data.mechanics || []);

    } catch (err) {
      console.error("Error fetching dashboard:", err);
      if(err.response && err.response.status === 401) {
          localStorage.clear();
          navigate('/login'); 
      }
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

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage(null);
      setMessageType('');
    }, 4000);
  };

const getKPIData = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`; 

    const todaysAppointments = repairs.filter(r => 
        r.date_end && r.date_end.startsWith(today)
    ).length;

    const confirmedToday = repairs.filter(r => {
        if (!r.date_end || !r.status) return false;

        const isToday = r.date_end.startsWith(today);
        
        const status = r.status.toLowerCase().trim();
        const isFinished =  status === 'completed';

        return isToday && isFinished;
    }).length;

    return { todaysAppointments, confirmedToday };
  };

  const { todaysAppointments, confirmedToday } = getKPIData();


const getFilteredRepairs = () => {
  let filtered = [...repairs];

  if (dashboardSearch) {
      const lowerSearch = dashboardSearch.toLowerCase();
      filtered = filtered.filter(item => 
          (item.vehicle?.client?.name || '').toLowerCase().includes(lowerSearch) ||
          (item.mechanic?.name || '').toLowerCase().includes(lowerSearch)
      );
  }

  if (statusFilter !== 'all') {
      filtered = filtered.filter(item => {
          const dbStatus = (item.status || "").toLowerCase().trim();
          const filterValue = statusFilter.toLowerCase();

          if (filterValue === 'progress') {
              return dbStatus.includes('progress');
          }

          return dbStatus === filterValue;
      });
  }

  if (priceSort === 'low-high') {
      filtered.sort((a, b) => parseFloat(a.cost) - parseFloat(b.cost));
  } else if (priceSort === 'high-low') {
      filtered.sort((a, b) => parseFloat(b.cost) - parseFloat(a.cost));
  }

  return filtered;
};

  const filteredRepairs = getFilteredRepairs();

  const handleClientSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 0) {
      try {
          const token = localStorage.getItem('ACCESS_TOKEN');
          const res = await axios.get(`http://127.0.0.1:8000/api/receptionist/clients/search?query=${query}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setSearchResults(res.data);
      } catch (err) { console.error(err); }
    } else { setSearchResults([]); }
  };

  const selectClient = async (client) => {
    setSelectedClient(client);
    setSearchQuery(client.name);
    setSearchResults([]); 
    try {
        const token = localStorage.getItem('ACCESS_TOKEN');
        const res = await axios.get(`http://127.0.0.1:8000/api/receptionist/clients/${client.id}/vehicles`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClientVehicles(res.data);
    } catch (err) { showMessage("Could not load vehicles", "error"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vehicle_id || !formData.mechanic_id || !formData.description || !formData.cost || !formData.date_end) {
      showMessage("Please fill in ALL fields.", "error"); return;
    }
    try {
      const token = localStorage.getItem('ACCESS_TOKEN');
      const response = await axios.post('http://127.0.0.1:8000/api/receptionist/jobs', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200 || response.status === 201) {
        setShowModal(false);
        setFormData({ vehicle_id: '', mechanic_id: '', description: '', cost: '', date_end: '' });
        fetchDashboardData(); 
        showMessage("Appointment Created Successfully!", "success");
      }
    } catch (err) {
      console.error("Error:", err);
      showMessage("Error creating appointment.", "error");
    }
  };

  const handleDelete = async (id) => {
      if (!window.confirm("Are you sure you want to delete this appointment?")) return;
      try {
          const token = localStorage.getItem('ACCESS_TOKEN');
          await axios.delete(`http://127.0.0.1:8000/api/receptionist/jobs/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          showMessage("Appointment deleted.", "success");
          fetchDashboardData(); 
      } catch (err) {
          console.error(err);
          showMessage("Error deleting appointment.", "error");
      }
  };


  const handleDownloadInvoice = (invoice, clientName, vehicleInfo, jobCost) => {
    
    const finalAmount = invoice?.amount || jobCost || "0.00";

    if (!invoice) {
        invoice = { 
            invoice_number: "INV-DRAFT", 
            created_at: new Date(), 
            status: "pending", 
            amount: finalAmount 
        };
    }

    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.text("GARAGE SERVICE INVOICE", 105, 20, null, null, "center");
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    // Details
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Invoice No:", 20, 40);
    doc.text("Date:", 20, 50);
    doc.text("Status:", 20, 60);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(invoice.invoice_number, 50, 40);
    doc.text(new Date(invoice.created_at).toLocaleDateString(), 50, 50);
    
    const statusColor = (invoice.status === 'paid') ? [0, 128, 0] : [200, 0, 0];
    doc.setTextColor(...statusColor);
    doc.text((invoice.status || "PENDING").toUpperCase(), 50, 60);

    // Bill To
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

    // Table
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 75, 170, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.text("DESCRIPTION", 25, 81);
    doc.text("AMOUNT", 160, 81);

    doc.setFont("helvetica", "normal");
    doc.text("Repair Service", 25, 95);
    
    //  Use finalAmount here
    doc.text(`${finalAmount} MAD`, 160, 95);
    doc.line(20, 110, 190, 110);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL DUE:", 110, 125);
    doc.text(`${finalAmount} MAD`, 160, 125);
    doc.save(`Invoice_${invoice.invoice_number}.pdf`);
  };


  return (
      <div className="receptionist-container">
        <DashboardNavbar 
          user={user} 
          onLogout={handleLogout} 
          onChangePassword={() => setShowPasswordModal(true)} 
        />
      
      <div className="kpi-container">
        <div className="kpi-card">
            <div className="kpi-icon">
              <i class="fa-regular fa-calendar"></i>
            </div>
            <div className="kpi-info">
                <h3>Today's Appointment</h3>
                <p className="kpi-number">{todaysAppointments}</p>
            </div>
        </div>
        <div className="kpi-card">
            <div className="kpi-icon success-icon">
              <i class="fa-regular fa-circle-check"></i>
            </div>
            <div className="kpi-info">
                <h3>Confirmed Appointment</h3>
                <p className="kpi-number">{confirmedToday}</p>
            </div>
        </div>
      </div>

      <div className="header-actions">
        <h1> <i class="fa-solid fa-list-check"></i> Repairs Dashboard</h1>
        <button className="add-btn" onClick={() => setShowModal(true)}>+ Add New Appointment</button>
      </div>

      <div className="search-filter-bar">
        <input 
            type="text" 
            placeholder="Search Item (Client or Mechanic)..." 
            className="dashboard-search-input"
            value={dashboardSearch}
            onChange={(e) => setDashboardSearch(e.target.value)}
        />
        
        <div className="filter-wrapper">
            <button className="filter-btn" onClick={() => setShowFilterMenu(!showFilterMenu)}>
                <i class="fa-solid fa-filter"></i>  Filter
            </button>

            {showFilterMenu && (
                <div className="filter-popup">
                    <div className="filter-group">
                        <label>Price</label>
                        <select value={priceSort} onChange={(e) => setPriceSort(e.target.value)}>
                            <option value="none">Default</option>
                            <option value="low-high">Low to High</option>
                            <option value="high-low">High to Low</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Status</label>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="canceled">Canceled</option>
                        </select>
                    </div>
                    <button className="apply-filter-btn" onClick={() => setShowFilterMenu(false)}>
                        Apply Filter
                    </button>
                </div>
            )}
        </div>
      </div>

      {!showModal && message && (
         <div className={`alert-message ${messageType}`}>
            <span>{message}</span>
         </div>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Customer / Vehicle</th>
              <th>Service</th>
              <th>Mechanic</th>
              <th>Cost</th>
              <th>Start Date</th> 
              <th>Est. End Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRepairs.length > 0 ? (
                filteredRepairs.map(job => (
                <tr key={job.id}>
                    <td>
                        <strong>{job.vehicle?.client?.name || 'Unknown'}</strong>
                        <span className="sub-text">
                            {job.vehicle?.make} {job.vehicle?.model}
                        </span>
                    </td>
                    <td>{job.description}</td>
                    <td>{job.mechanic ? job.mechanic.name : 'Unassigned'}</td>
                    <td>{job.cost} MAD</td>
                    <td>{new Date(job.created_at).toLocaleString('en-GB', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    
                    <td>
                      {job.date_end ? (
                        new Date(job.date_end).toLocaleString('en-GB', {
                          day: '2-digit', month: '2-digit', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })
                      ) : (
                        <span style={{color: '#94a3b8', fontStyle: 'italic'}}>TBD</span> 
                      )}
                    </td>

                    <td><span className={`status-badge ${job.status}`}>{job.status}</span></td>
                    <td>
                        <button className="action-btn invoice-btn" onClick={() => handleDownloadInvoice(job.invoice, job.vehicle?.client?.name, `${job.vehicle?.make} ${job.vehicle?.model}`, job.cost)}>
                          <i class="fa-solid fa-file-arrow-down"></i>
                        </button>
                        <button className="action-btn delete-btn" onClick={() => handleDelete(job.id)}>
                          <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </td>
                </tr>
                ))
            ) : (
                <tr><td colSpan="8" style={{textAlign: "center", padding: "20px"}}>No appointments found matching your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Appointment</h2>
            {message && <div className={`alert-message ${messageType}`}>{message}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Customer :</label>
                <input type="text" className="form-control" placeholder="Search Client..." value={searchQuery} onChange={handleClientSearch}/>
                {searchResults.length > 0 && (
                  <ul className="suggestions-list">
                    {searchResults.map(c => <li key={c.id} onClick={() => selectClient(c)}>{c.name}</li>)}
                  </ul>
                )}
              </div>
              <div className="form-group">
                <label>Vehicle :</label>
                <select className="form-control" value={formData.vehicle_id} onChange={e => setFormData({...formData, vehicle_id: e.target.value})} disabled={!selectedClient}>
                  <option value="">-- Select Vehicle --</option>
                  {clientVehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model}</option>)}
                </select>
              </div>
              <div className="form-group">
                  <label>Service :</label>
                  <input type="text" className="form-control" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}/>
              </div>
              <div className="form-group">
                <label>Mechanic :</label>
                <select className="form-control" value={formData.mechanic_id} onChange={e => setFormData({...formData, mechanic_id: e.target.value})}>
                  <option value="">-- Select Mechanic --</option>
                  {mechanics.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="row-split">
                  <div className="form-group" style={{flex:1}}>
                    <label>End Date & Time :</label>
                    <input type="datetime-local" className="form-control" name="date_end" value={formData.date_end} onChange={e => setFormData({...formData, date_end: e.target.value})} required/>
                  </div>
                  <div className="form-group" style={{flex:1}}>
                    <label>Cost (MAD) :</label>
                    <input type="number" className="form-control" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})}/>
                  </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceptionistDashboard;