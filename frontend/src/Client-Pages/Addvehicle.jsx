import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardNavbar from '../components/DashboardNavbar';
import './AddVehicle.css';

const AddVehicle = () => {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('USER_DATA') || '{}'));
  const [loading, setLoading] = useState(false);

  // Vehicle Form Data
  const [vehicleData, setVehicleData] = useState({
    make: '',
    model: '',
    year: '',
    license_plate: '',
    type: ''
  });

  const handleVehicleChange = (e) => {
    setVehicleData({
      ...vehicleData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('ACCESS_TOKEN');
      
      const payload = {
        make: vehicleData.make,
        model: vehicleData.model,
        year: parseInt(vehicleData.year),
        license_plate: vehicleData.license_plate,
        type: vehicleData.type
      };

      console.log('Submitting payload:', payload);

      // UPDATED: Use the /api/vehicles endpoint
      await axios.post('http://127.0.0.1:8000/api/vehicles', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Vehicle added successfully!');
      navigate('/client/dashboard'); // This will refresh and show the new vehicle
    } catch (error) {
      console.error('Error adding vehicle:', error);
      const errorMessage = error.response?.data?.message || 'Error adding vehicle. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-vehicle-page">
      <DashboardNavbar user={user} onLogout={() => navigate('/login')} />

      <div className="add-vehicle-container">
        
        {/* Header with Back Button */}
        <div className="page-header">
          <button className="back-to-dashboard-btn" onClick={() => navigate('/client/dashboard')}>
            <i className="fa-solid fa-arrow-left"></i>
            <span>Back to Dashboard</span>
          </button>
          <h1 className="page-title">Add New Vehicle</h1>
        </div>

        {/* VEHICLE INFORMATION FORM */}
        <div className="form-section fade-in">
          <div className="form-header">
            <div className="form-icon vehicle-icon">
              <i className="fa-solid fa-car"></i>
            </div>
            <div>
              <h2 className="form-title">Vehicle Information</h2>
              <p className="form-subtitle">Enter your vehicle details</p>
            </div>
          </div>

          <form className="info-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Make (Brand) *</label>
                <input
                  type="text"
                  name="make"
                  value={vehicleData.make}
                  onChange={handleVehicleChange}
                  placeholder="e.g., Volkswagen, Toyota"
                  required
                />
              </div>

              <div className="form-group">
                <label>Model *</label>
                <input
                  type="text"
                  name="model"
                  value={vehicleData.model}
                  onChange={handleVehicleChange}
                  placeholder="e.g., Golf, Camry"
                  required
                />
              </div>

              <div className="form-group">
                <label>Year *</label>
                <input
                  type="number"
                  name="year"
                  value={vehicleData.year}
                  onChange={handleVehicleChange}
                  placeholder="2024"
                  min="1900"
                  max="2030"
                  required
                />
              </div>

              <div className="form-group">
                <label>License Plate *</label>
                <input
                  type="text"
                  name="license_plate"
                  value={vehicleData.license_plate}
                  onChange={handleVehicleChange}
                  placeholder="1234 AB 56"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Vehicle Type *</label>
                <select
                  name="type"
                  value={vehicleData.type}
                  onChange={handleVehicleChange}
                  required
                >
                  <option value="">Select vehicle type</option>
                  <option value="car">Car</option>
                  <option value="moto">Motorcycle</option>
                  <option value="bus">Bus</option>
                  <option value="truck">Truck</option>
                </select>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Adding Vehicle...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check"></i>
                  Add Vehicle
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AddVehicle;