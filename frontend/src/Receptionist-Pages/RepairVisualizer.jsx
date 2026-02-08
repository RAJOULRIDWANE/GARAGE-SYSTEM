import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import DashboardNavbar from '../components/DashboardNavbar'; // Adjust path if needed
import './RepairVisualizer.css';

// --- MOCK IMAGES (Replace these with your actual local assets) ---
// You mentioned 24 photos. Use your imports here.
const CAR_IMAGES = {
  sedan: {
    side: "https://i.imgur.com/K75kU6g.png", // Placeholder: Side View Blueprint
    top: "https://placehold.co/600x400/png?text=Sedan+Top+View",
    front: "https://placehold.co/600x400/png?text=Sedan+Front+View",
  },
  suv: {
    side: "https://placehold.co/600x400/png?text=SUV+Side+View",
    // ...
  }
};

// --- ZONE MAPPING (The "Bridge") ---
// Define where the boxes appear on the "Side View" image (in percentages)
const ZONE_MAP = {
  sedan: {
    side: {
      ENGINE:   { top: '28%', left: '70%', width: '25%', height: '20%', borderRadius: '10%' },
      WHEELS:   [
        { top: '55%', left: '13%', width: '14%', height: '26%', borderRadius: '50%' }, // Rear
        { top: '55%', left: '72%', width: '14%', height: '26%', borderRadius: '50%' }  // Front
      ],
      BODY:     { top: '25%', left: '25%', width: '45%', height: '30%', borderRadius: '5px' },
      LIGHTS:   { top: '35%', left: '92%', width: '5%', height: '10%', borderRadius: '50%' },
      EXHAUST:  { top: '70%', left: '1%',  width: '8%', height: '8%', borderRadius: '5px' },
    }
  }
};

// --- COLOR MAPPING ---
const STATUS_COLORS = {
  Pending:    'rgba(255, 193, 7, 0.6)',   // Yellow
  'In Progress': 'rgba(13, 110, 253, 0.6)', // Blue
  Completed:  'rgba(25, 135, 84, 0.6)',   // Green
  Cancelled:  'rgba(220, 53, 69, 0.6)',   // Red
};

const RepairVisualizer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // -- State --
  const [user, setUser] = useState({ name: localStorage.getItem('USER_NAME') || 'Receptionist', role: 'Receptionist' });
  const [repairs, setRepairs] = useState([]);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [currentView, setCurrentView] = useState('side'); // side, top, front, back...

  // -- 1. Load Data --
  useEffect(() => {
    fetchRepairs();
    // If we navigated here with a specific repair selected
    if (location.state?.repairId) {
      // Logic to auto-select would go here after fetch
    }
  }, []);

  const fetchRepairs = async () => {
    try {
      const token = localStorage.getItem('ACCESS_TOKEN');
      // Fetching "Pending" or "In Progress" jobs usually
      const res = await axios.get('http://127.0.0.1:8000/api/receptionist/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Assuming res.data.repairs exists
      setRepairs(res.data.repairs || []);
      
      // Select first one by default if available
      if (res.data.repairs && res.data.repairs.length > 0) {
        setSelectedRepair(res.data.repairs[0]);
      }
    } catch (err) {
      console.error("Error loading repairs", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // -- 2. Helper: Get Category from Service --
  // Since your DB might not have 'category' yet, we map it manually here
  const getCategory = (serviceName) => {
    if (!serviceName) return 'BODY';
    const lower = serviceName.toLowerCase();
    if (lower.includes('oil') || lower.includes('engine') || lower.includes('filter')) return 'ENGINE';
    if (lower.includes('tire') || lower.includes('wheel') || lower.includes('brake')) return 'WHEELS';
    if (lower.includes('paint') || lower.includes('dent') || lower.includes('scratch')) return 'BODY';
    if (lower.includes('light') || lower.includes('lamp')) return 'LIGHTS';
    if (lower.includes('muffler') || lower.includes('exhaust')) return 'EXHAUST';
    return 'BODY'; // Default
  };

  // -- 3. Render The Zone Overlay --
  const renderZone = () => {
    if (!selectedRepair) return null;

    const vehicleType = 'sedan'; // Hardcoded for now, or use selectedRepair.vehicle.type
    const serviceName = selectedRepair.service?.name || selectedRepair.description; // Fallback
    const category = getCategory(serviceName);
    const status = selectedRepair.status;
    
    // Get Coordinates
    const coords = ZONE_MAP[vehicleType]?.[currentView]?.[category];
    
    if (!coords) return null;

    const styleBase = {
      position: 'absolute',
      backgroundColor: STATUS_COLORS[status] || STATUS_COLORS['Pending'],
      border: '2px solid white',
      boxShadow: '0 0 15px rgba(255,255,255,0.8)',
      zIndex: 10,
      cursor: 'pointer',
      animation: 'pulse 2s infinite'
    };

    // Handle Array (e.g., 4 Wheels) or Single Object (1 Engine)
    const zonesToRender = Array.isArray(coords) ? coords : [coords];

    return zonesToRender.map((pos, index) => (
      <div 
        key={index}
        className="visual-overlay-box"
        style={{
          ...styleBase,
          top: pos.top,
          left: pos.left,
          width: pos.width,
          height: pos.height,
          borderRadius: pos.borderRadius
        }}
        title={`${category}: ${status}`}
      >
        <span className="zone-label">{category}</span>
      </div>
    ));
  };

  return (
    <div className="visualizer-page">
      <DashboardNavbar user={user} onLogout={handleLogout} />

      <div className="visualizer-content">
        
        {/* LEFT PANEL: REPAIR LIST */}
        <div className="repair-sidebar">
          <h3>Active Repairs</h3>
          <div className="repair-list">
            {repairs.map(repair => (
              <div 
                key={repair.id} 
                className={`repair-item ${selectedRepair?.id === repair.id ? 'active' : ''}`}
                onClick={() => setSelectedRepair(repair)}
              >
                <div className="repair-header">
                  <strong>{repair.vehicle?.make || 'Unknown'} {repair.vehicle?.model}</strong>
                  <span className={`badge ${repair.status?.toLowerCase().replace(' ', '-')}`}>
                    {repair.status}
                  </span>
                </div>
                <p className="repair-desc">{repair.service?.name || repair.description}</p>
                <small>{repair.vehicle?.plate_number}</small>
              </div>
            ))}
            {repairs.length === 0 && <p className="no-data">No active repairs found.</p>}
          </div>
        </div>

        {/* RIGHT PANEL: VISUALIZATION */}
        <div className="visualizer-stage">
          
          {selectedRepair ? (
            <>
              <div className="stage-header">
                <h2>Visualizing: {selectedRepair.vehicle?.plate_number}</h2>
                <div className="view-controls">
                  {/* These buttons switch the image angle */}
                  {['side', 'front', 'top', 'back', 'interior'].map(view => (
                    <button 
                      key={view} 
                      className={currentView === view ? 'active' : ''}
                      onClick={() => setCurrentView(view)}
                    >
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="car-container">
                {/* 1. The Car Image */}
                <img 
                  src={CAR_IMAGES.sedan[currentView] || CAR_IMAGES.sedan.side} 
                  alt="Vehicle View" 
                  className="vehicle-image"
                />
                
                {/* 2. The Colored Overlay */}
                {renderZone()}
              </div>

              <div className="legend">
                 <div className="legend-item"><span className="dot pending"></span> Pending</div>
                 <div className="legend-item"><span className="dot progress"></span> In Progress</div>
                 <div className="legend-item"><span className="dot completed"></span> Completed</div>
              </div>
            </>
          ) : (
             <div className="empty-state">Select a repair to visualize</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default RepairVisualizer;