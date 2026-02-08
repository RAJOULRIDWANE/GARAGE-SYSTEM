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
  const [groupedClients, setGroupedClients] = useState([]); 
  const [repairs, setRepairs] = useState([]); 
  const [mechanics, setMechanics] = useState([]); 
  const [services, setServices] = useState([]); 

  // --- Filter State ---
  const [dashboardSearch, setDashboardSearch] = useState(''); 
  
  // --- Modal State ---
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false); 
  const [message, setMessage] = useState(null); 
  const [messageType, setMessageType] = useState(''); 

  // --- Add Job Form State ---
  const [searchQuery, setSearchQuery] = useState(''); // Client Search
  const [searchResults, setSearchResults] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientVehicles, setClientVehicles] = useState([]);

  // --- SERVICE SEARCH STATE (NEW) ---
  const [serviceSearch, setServiceSearch] = useState('');
  const [showServiceList, setShowServiceList] = useState(false);
  
  const [formData, setFormData] = useState({
    vehicle_id: '',
    mechanic_id: '',
    service_id: '', 
    description: '', 
    cost: '',        
    date_end: '' 
  });

  useEffect(() => {
    fetchDashboardData();
    fetchServices(); 
  }, []);

  const fetchServices = async () => {
    try {
        const res = await axios.get('http://127.0.0.1:8000/api/services');
        setServices(res.data);
    } catch (err) { 
        console.error("Error fetching services", err); 
    }
  };

  const fetchDashboardData = async () => {
    try {
        const token = localStorage.getItem('ACCESS_TOKEN');
        const clientRes = await axios.get('http://127.0.0.1:8000/api/receptionist/clients-summary', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setGroupedClients(clientRes.data);

        const dashRes = await axios.get('http://127.0.0.1:8000/api/receptionist/dashboard', {
             headers: { Authorization: `Bearer ${token}` }
        });

        if (dashRes.data.user) {
            setUser(dashRes.data.user);
            localStorage.setItem('USER_NAME', dashRes.data.user.name);
            localStorage.setItem('USER_ROLE', dashRes.data.user.role);
        }

        setMechanics(dashRes.data.mechanics || []);
        setRepairs(dashRes.data.repairs || []);

    } catch (err) { 
        console.error(err);
        if(err.response && err.response.status === 401) handleLogout();
    }
  };

  const handleClientClick = (client) => {
    const safeName = client.name ? client.name.replace(/\s+/g, '-') : 'Client';
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
    const today = now.toISOString().split('T')[0]; 
    const todaysAppointments = repairs.filter(r => r.date_end && r.date_end.startsWith(today)).length;
    const confirmedToday = repairs.filter(r => {
        if (!r.date_end || !r.status) return false;
        return r.date_end.startsWith(today) && r.status.toLowerCase().trim() === 'completed';
    }).length;
    return { todaysAppointments, confirmedToday };
  };

  const { todaysAppointments, confirmedToday } = getKPIData();

  const filteredClients = (() => {
      if (!dashboardSearch) return groupedClients;
      const lowerSearch = dashboardSearch.toLowerCase();
      return groupedClients.filter(client => 
          client.name.toLowerCase().includes(lowerSearch) || 
          client.email.toLowerCase().includes(lowerSearch)
      );
  })();

  // --- CLIENT SEARCH LOGIC ---
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

  // --- SERVICE SEARCH LOGIC (NEW) ---
  const filteredServices = services.filter(service => {
     if (!serviceSearch) return true; // Show all if empty (or restrict if list is too long)
     const searchLower = serviceSearch.toLowerCase();
     const nameMatch = service.name.toLowerCase().includes(searchLower);
     const zoneMatch = service.zone && service.zone.toLowerCase().includes(searchLower);
     return nameMatch || zoneMatch;
  });

  const selectService = (service) => {
     setFormData({
         ...formData,
         service_id: service.id,
         cost: service.price
     });
     setServiceSearch(service.name); // Fill input with name
     setShowServiceList(false);      // Close dropdown
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vehicle_id || !formData.mechanic_id || !formData.service_id || !formData.date_end) {
      showMessage("Please fill in ALL fields.", "error"); return;
    }
    try {
      const token = localStorage.getItem('ACCESS_TOKEN');
      const response = await axios.post('http://127.0.0.1:8000/api/receptionist/jobs', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200 || response.status === 201) {
        setShowModal(false);
        // Reset Form
        setFormData({ vehicle_id: '', mechanic_id: '', service_id: '', description: '', cost: '', date_end: '' });
        setSearchQuery('');
        setServiceSearch(''); // Reset service search
        setSelectedClient(null);
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
            <div className="kpi-icon"><i className="fa-regular fa-calendar"></i></div>
            <div className="kpi-info"><h3>Today's Appointment</h3><p className="kpi-number">{todaysAppointments}</p></div>
        </div>
        <div className="kpi-card">
            <div className="kpi-icon success-icon"><i className="fa-regular fa-circle-check"></i></div>
            <div className="kpi-info"><h3>Confirmed Appointment</h3><p className="kpi-number">{confirmedToday}</p></div>
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
         <div className={`alert-message ${messageType}`}><span>{message}</span></div>
      )}

      <div className="table-card">
        <table>
            <thead>
                <tr><th>Client Name</th><th>Total Vehicles</th><th>Total Repairs History</th><th>Action</th></tr>
            </thead>
            <tbody>
                {filteredClients.length > 0 ? filteredClients.map(client => (
                    <tr key={client.id} className="clickable-row" onClick={() => handleClientClick(client)}>
                        <td><strong>{client.name}</strong><div className="sub-text">{client.email}</div></td>
                        <td>{client.vehicles?.length || 0} Vehicles</td>
                        <td><span className="status-badge progress">{client.repairs_count} Repairs</span></td>
                        <td><button className="action-btn view-btn"><i className="fa-solid fa-eye"></i> View History</button></td>
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

              {/* UPDATED SERVICE SEARCHABLE INPUT */}
              <div className="form-group" style={{position: 'relative'}}>
                  <label>Select Service :</label>
                  <input 
                      type="text"
                      className="form-control"
                      placeholder="Type to search service..."
                      value={serviceSearch}
                      onChange={(e) => {
                          setServiceSearch(e.target.value);
                          setShowServiceList(true);
                          setFormData({...formData, service_id: ''}); // Clear ID if typing new
                      }}
                      onFocus={() => setShowServiceList(true)}
                      // Delayed blur to allow clicking on list items
                      onBlur={() => setTimeout(() => setShowServiceList(false), 200)}
                  />
                  
                {showServiceList && (
                    <ul className="suggestions-list service-list">
                        {filteredServices.length > 0 ? filteredServices.map(s => (
                            // CHANGE: Use onMouseDown instead of onClick
                            <li key={s.id} onMouseDown={() => selectService(s)}>
                                <div className="service-row">
                                    <span className="service-name">{s.name}</span>
                                    <span className="service-zone">{s.zone || 'General'}</span>
                                </div>
                                <span className="service-price">{s.price} MAD</span>
                            </li>
                        )) : (
                            <li className="no-result">No services found</li>
                        )}
                    </ul>
                )}
              </div>

              <div className="form-group">
                  <label>Notes (Optional) :</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="E.g. Customer hears noise..." 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
              </div>

              <div className="form-group">
                <label>Mechanic :</label>
                <select className="form-control" value={formData.mechanic_id} onChange={e => setFormData({...formData, mechanic_id: e.target.value})}>
                  <option value="">-- Select Mechanic --</option>
                  {mechanics.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>

              <div className="form-group">
                 <label>End Date & Time :</label>
                 <input type="datetime-local" className="form-control" name="date_end" value={formData.date_end} onChange={e => setFormData({...formData, date_end: e.target.value})} required/>
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