import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import "./ReceptionistDashboard.css"; 

const ReceptionistDashboard = () => {
  const navigate = useNavigate();

  // --- User State ---
  const [user, setUser] = useState({ 
    name: localStorage.getItem('USER_NAME') || 'Receptionist', 
    role: localStorage.getItem('USER_ROLE') || 'Receptionist' 
  });

  // --- Data State ---
  const [groupedClients, setGroupedClients] = useState([]); // Main List
  const [repairs, setRepairs] = useState([]); // For KPIs
  const [mechanics, setMechanics] = useState([]); // For Add Modal

  // --- Filter State ---
  const [dashboardSearch, setDashboardSearch] = useState(''); 
  
  // --- Modal State ---
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false); 
  const [message, setMessage] = useState(null); 
  const [messageType, setMessageType] = useState(''); 

  // --- Add Job Form State ---
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
        
        // 1. Fetch Grouped Clients (The Main Table)
        const clientRes = await axios.get('http://127.0.0.1:8000/api/receptionist/clients-summary', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setGroupedClients(clientRes.data);

        // 2. Fetch General Dashboard Data (Mechanics for Modal + Repairs for KPIs)
        const dashRes = await axios.get('http://127.0.0.1:8000/api/receptionist/dashboard', {
             headers: { Authorization: `Bearer ${token}` }
        });

        if (dashRes.data.user) {
            setUser(dashRes.data.user); // Update the visual state
            localStorage.setItem('USER_NAME', dashRes.data.user.name); // Persist it
            localStorage.setItem('USER_ROLE', dashRes.data.user.role);
        }

        setMechanics(dashRes.data.mechanics || []);
        setRepairs(dashRes.data.repairs || []); // <--- Needed for KPIs

    } catch (err) { 
        console.error(err);
        if(err.response && err.response.status === 401) handleLogout();
    }
  };

  // --- NAVIGATION FIX ---
  // We accept the full 'client' object now, not just the ID
  const handleClientClick = (client) => {
    // Safety check + Format name (Ahmed Ali -> Ahmed-Ali)
    const safeName = client.name ? client.name.replace(/\s+/g, '-') : 'Client';
      
    // Navigate with BOTH ID (for logic) and Name (for display)
    navigate(`/receptionist/client/${client.id}/${safeName}`); 
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

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => { setMessage(null); setMessageType(''); }, 4000);
  };

  // --- KPI Logic ---
  const getKPIData = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD

    const todaysAppointments = repairs.filter(r => 
        r.date_end && r.date_end.startsWith(today)
    ).length;

    const confirmedToday = repairs.filter(r => {
        if (!r.date_end || !r.status) return false;
        const isToday = r.date_end.startsWith(today);
        const status = r.status.toLowerCase().trim();
        return isToday && status === 'completed';
    }).length;

    return { todaysAppointments, confirmedToday };
  };

  const { todaysAppointments, confirmedToday } = getKPIData();

  // --- Filter Logic ---
  const getFilteredClients = () => {
      if (!dashboardSearch) return groupedClients;
      const lowerSearch = dashboardSearch.toLowerCase();
      return groupedClients.filter(client => 
          client.name.toLowerCase().includes(lowerSearch) || 
          client.email.toLowerCase().includes(lowerSearch)
      );
  };

  const filteredClients = getFilteredClients();

  // --- Add Appointment Logic ---
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
              <i className="fa-regular fa-calendar"></i>
            </div>
            <div className="kpi-info">
                <h3>Today's Appointment</h3>
                <p className="kpi-number">{todaysAppointments}</p>
            </div>
        </div>
        <div className="kpi-card">
            <div className="kpi-icon success-icon">
              <i className="fa-regular fa-circle-check"></i>
            </div>
            <div className="kpi-info">
                <h3>Confirmed Appointment</h3>
                <p className="kpi-number">{confirmedToday}</p>
            </div>
        </div>
      </div>

      <div className="header-actions">
           <h1>Clients Overview</h1>
           <button className="add-btn" onClick={() => setShowModal(true)}>+ Add New Appointment</button>
      </div>

      <div className="search-filter-bar">
        <input 
            type="text" 
            placeholder="Search Client by Name or Email..." 
            className="dashboard-search-input"
            value={dashboardSearch}
            onChange={(e) => setDashboardSearch(e.target.value)}
        />
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
                    <th>Client Name</th>
                    <th>Total Vehicles</th>
                    <th>Total Repairs History</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {filteredClients.length > 0 ? filteredClients.map(client => (
                    // PASS THE WHOLE CLIENT OBJECT HERE
                    <tr key={client.id} className="clickable-row" onClick={() => handleClientClick(client)}>
                        <td>
                            <strong>{client.name}</strong>
                            <div className="sub-text">{client.email}</div>
                        </td>
                        <td>{client.vehicles?.length || 0} Vehicles</td>
                        <td><span className="status-badge progress">{client.repairs_count} Repairs</span></td>
                        <td>
                            <button className="action-btn view-btn">
                                <i className="fa-solid fa-eye"></i> View History
                            </button>
                        </td>
                    </tr>
                )) : (
                    <tr><td colSpan="4" style={{textAlign: "center", padding: "20px"}}>No clients found.</td></tr>
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
                    <input type="number" min="0" className="form-control" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})}/>
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