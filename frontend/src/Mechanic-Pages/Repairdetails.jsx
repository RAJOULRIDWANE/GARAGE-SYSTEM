import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Repairdetails.css';

const RepairDetails = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    
    // State Management
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedZone, setSelectedZone] = useState('all');
    const [selectedServices, setSelectedServices] = useState([]);
    const [parts, setParts] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    // Services Data with Icons (price removed from display)
    const services = [
        // ENGINE ZONE
        { id: 1, name: 'Oil Change', zone: 'engine', icon: 'fa-solid fa-oil-can' },
        { id: 2, name: 'Battery Change', zone: 'engine', icon: 'fa-solid fa-car-battery' },
        { id: 3, name: 'Engine Diagnostics', zone: 'engine', icon: 'fa-solid fa-gauge-high' },
        { id: 4, name: 'Transmission Services', zone: 'engine', icon: 'fa-solid fa-gears' },
        { id: 5, name: 'Clutch Repair', zone: 'engine', icon: 'fa-solid fa-gear' },
        { id: 6, name: 'Radiator Services', zone: 'engine', icon: 'fa-solid fa-temperature-high' },
        { id: 7, name: 'A/C Services', zone: 'engine', icon: 'fa-solid fa-fan' },
        { id: 8, name: 'Fuel System Services', zone: 'engine', icon: 'fa-solid fa-gas-pump' },
        { id: 9, name: 'Engine Cleaning', zone: 'engine', icon: 'fa-solid fa-spray-can-sparkles' },
        // WHEELS ZONE
        { id: 10, name: 'Brake Services', zone: 'wheels', icon: 'fa-solid fa-car-burst' },
        { id: 11, name: 'Tire Services', zone: 'wheels', icon: 'fa-solid fa-circle' },
        { id: 12, name: 'Suspension & Steering', zone: 'wheels', icon: 'fa-solid fa-arrows-up-down' },
        { id: 13, name: 'Wheel Alignment', zone: 'wheels', icon: 'fa-solid fa-arrows-left-right' },
        // EXHAUST ZONE
        { id: 14, name: 'Emissions Testing', zone: 'exhaust', icon: 'fa-solid fa-cloud' },
        { id: 15, name: 'Exhaust System Repair', zone: 'exhaust', icon: 'fa-solid fa-wind' },
        // LIGHTS ZONE
        { id: 16, name: 'Electrical Repair (Lights)', zone: 'lights', icon: 'fa-solid fa-lightbulb' },
        // BODY ZONE
        { id: 17, name: 'Electrical Diagnostics', zone: 'body', icon: 'fa-solid fa-bolt' },
        { id: 18, name: 'Safety Inspection', zone: 'body', icon: 'fa-solid fa-shield-halved' },
    ];
    
    // Fetch Job Details
    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const token = localStorage.getItem('ACCESS_TOKEN');
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/mechanic/jobs/${jobId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setJob(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch job details:', error);
                setLoading(false);
            }
        };
        
        fetchJobDetails();
    }, [jobId]);
    
    // Helper function to get client name (handles both structures)
    const getClientName = () => {
        if (job?.vehicle?.client?.name) return job.vehicle.client.name;
        if (job?.vehicle?.client?.user?.name) return job.vehicle.client.user.name;
        if (job?.vehicle?.user?.name) return job.vehicle.user.name;
        return 'Unknown Client';
    };
    
    // Filter services by zone
    const filteredServices = selectedZone === 'all' 
        ? services 
        : services.filter(s => s.zone === selectedZone);
    
    // Toggle service selection (simplified - no quantity)
    const toggleService = (service) => {
        setSelectedServices(prev => {
            const exists = prev.find(s => s.id === service.id);
            if (exists) {
                return prev.filter(s => s.id !== service.id);
            }
            return [...prev, service];
        });
    };
    
    // Add new part
    const addPart = () => {
        setParts(prev => [...prev, { 
            id: Date.now(), 
            name: '', 
            quantity: 1
        }]);
    };
    
    // Update part
    const updatePart = (partId, field, value) => {
        setParts(prev =>
            prev.map(p => p.id === partId ? { ...p, [field]: value } : p)
        );
    };
    
    // Remove part
    const removePart = (partId) => {
        setParts(prev => prev.filter(p => p.id !== partId));
    };
    
    // Send parts request to parts manager
    const sendPartsRequest = async () => {
        if (parts.length === 0) {
            alert('Please add at least one part to request');
            return;
        }

        // Validate all parts have names
        const invalidParts = parts.filter(p => !p.name.trim());
        if (invalidParts.length > 0) {
            alert('Please fill in all part names');
            return;
        }

        setSubmitting(true);
        
        try {
            const token = localStorage.getItem('ACCESS_TOKEN');
            
            // Prepare the request data
            const requestData = {
                job_id: jobId,
                vehicle: {
                    make: job.vehicle?.make,
                    model: job.vehicle?.model,
                    license_plate: job.vehicle?.license_plate
                },
                services: selectedServices.map(s => ({
                    name: s.name
                })),
                parts: parts.map(p => ({
                    name: p.name,
                    quantity: p.quantity
                })),
                notes: `Parts request for job #${jobId} - ${getClientName()}`
            };
            
            // Send request to parts manager
            await axios.post(
                'http://127.0.0.1:8000/api/mechanic/parts-request',
                requestData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setShowConfirmation(true);
            
        } catch (error) {
            console.error('Failed to send parts request:', error);
            alert('Failed to send parts request. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };
    
    if (loading) {
        return (
            <div className="repair-details-container">
                <div className="loading-state">Loading job details...</div>
            </div>
        );
    }
    
    if (!job) {
        return (
            <div className="repair-details-container">
                <div className="error-state">
                    <h2>Job not found</h2>
                    <button 
                        onClick={() => navigate('/mechanic/dashboard')}
                        style={{
                            marginTop: '20px',
                            padding: '12px 24px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="repair-details-container">
            {/* Header with Return Button */}
            <header className="repair-header">
                <button className="btn-return" onClick={() => navigate('/mechanic/dashboard')}>
                    <i className="fa-solid fa-arrow-left"></i>
                    Return to Dashboard
                </button>
                <h1>Repair Details</h1>
            </header>
            
            {!showConfirmation ? (
                <div className="repair-content">
                    {/* Vehicle Information Form */}
                    <section className="vehicle-info-section">
                        <h2>
                            <i className="fa-solid fa-car"></i>
                            Vehicle Information
                        </h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Make</label>
                                <input type="text" value={job.vehicle?.make || ''} readOnly />
                            </div>
                            <div className="info-item">
                                <label>Model</label>
                                <input type="text" value={job.vehicle?.model || ''} readOnly />
                            </div>
                            <div className="info-item">
                                <label>License Plate</label>
                                <input type="text" value={job.vehicle?.license_plate || ''} readOnly />
                            </div>
                            <div className="info-item">
                                <label>Client Name</label>
                                <input 
                                    type="text" 
                                    value={getClientName()} 
                                    readOnly 
                                />
                            </div>
                            <div className="info-item full-width">
                                <label>Job Description</label>
                                <textarea value={job.description || ''} readOnly rows="2"></textarea>
                            </div>
                        </div>
                    </section>
                    
                    {/* Services Selection */}
                    <section className="services-section">
                        <div className="services-header">
                            <h2>
                                <i className="fa-solid fa-toolbox"></i>
                                Select Services
                            </h2>
                            
                            {/* Zone Filter */}
                            <div className="zone-filter">
                                <button 
                                    className={selectedZone === 'all' ? 'active' : ''}
                                    onClick={() => setSelectedZone('all')}
                                >
                                    All
                                </button>
                                <button 
                                    className={selectedZone === 'engine' ? 'active' : ''}
                                    onClick={() => setSelectedZone('engine')}
                                >
                                    Engine
                                </button>
                                <button 
                                    className={selectedZone === 'wheels' ? 'active' : ''}
                                    onClick={() => setSelectedZone('wheels')}
                                >
                                    Wheels
                                </button>
                                <button 
                                    className={selectedZone === 'exhaust' ? 'active' : ''}
                                    onClick={() => setSelectedZone('exhaust')}
                                >
                                    Exhaust
                                </button>
                                <button 
                                    className={selectedZone === 'lights' ? 'active' : ''}
                                    onClick={() => setSelectedZone('lights')}
                                >
                                    Lights
                                </button>
                                <button 
                                    className={selectedZone === 'body' ? 'active' : ''}
                                    onClick={() => setSelectedZone('body')}
                                >
                                    Body
                                </button>
                            </div>
                        </div>
                        
                        <div className="services-grid">
                            {filteredServices.map(service => {
                                const isSelected = selectedServices.find(s => s.id === service.id);
                                
                                return (
                                    <div 
                                        key={service.id} 
                                        className={`service-card ${isSelected ? 'selected' : ''}`}
                                        onClick={() => toggleService(service)}
                                    >
                                        {/* Service Icon */}
                                        <div className="service-icon-circle">
                                            <i className={service.icon}></i>
                                        </div>
                                        
                                        <div className="service-info">
                                            <h3>{service.name}</h3>
                                            <span className="service-zone">{service.zone}</span>
                                        </div>
                                        
                                        {isSelected && (
                                            <div className="selected-checkmark">
                                                <i className="fa-solid fa-check"></i>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                    
                    {/* Parts Section */}
                    <section className="parts-section">
                        <div className="parts-header">
                            <h2>
                                <i className="fa-solid fa-gears"></i>
                                Parts Needed
                            </h2>
                            <button className="btn-add-part" onClick={addPart}>
                                <i className="fa-solid fa-plus"></i>
                                Add Part
                            </button>
                        </div>
                        
                        {parts.length > 0 ? (
                            <div className="parts-list">
                                {parts.map(part => (
                                    <div key={part.id} className="part-item">
                                        <input 
                                            type="text" 
                                            placeholder="Part name *"
                                            value={part.name}
                                            onChange={(e) => updatePart(part.id, 'name', e.target.value)}
                                        />
                                        <input 
                                            type="number" 
                                            placeholder="Quantity"
                                            min="1"
                                            value={part.quantity}
                                            onChange={(e) => updatePart(part.id, 'quantity', parseInt(e.target.value) || 1)}
                                        />
                                        <button 
                                            className="btn-remove-part"
                                            onClick={() => removePart(part.id)}
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-parts-message">
                                <i className="fa-solid fa-box-open"></i>
                                <p>No parts added yet. Click "Add Part" to request parts from the parts manager.</p>
                            </div>
                        )}
                    </section>
                    
                    {/* Summary Section - Simplified */}
                    {(selectedServices.length > 0 || parts.length > 0) && (
                        <section className="summary-section">
                            <h3>Summary</h3>
                            {selectedServices.length > 0 && (
                                <div className="summary-row">
                                    <span>Services Selected:</span>
                                    <span>{selectedServices.length}</span>
                                </div>
                            )}
                            {parts.length > 0 && (
                                <div className="summary-row">
                                    <span>Parts Requested:</span>
                                    <span>{parts.length}</span>
                                </div>
                            )}
                            <div className="summary-row total">
                                <span>Total Items:</span>
                                <span>{selectedServices.length + parts.length}</span>
                            </div>
                        </section>
                    )}
                    
                    {/* Submit Button */}
                    <div className="action-buttons">
                        <button 
                            className="btn-submit" 
                            onClick={sendPartsRequest}
                            disabled={submitting || parts.length === 0}
                        >
                            <i className="fa-solid fa-paper-plane"></i>
                            {submitting ? 'Sending Request...' : 'Send Parts Request to Manager'}
                        </button>
                    </div>
                </div>
            ) : (
                /* Confirmation View */
                <div className="confirmation-container">
                    <div className="confirmation-success">
                        <div className="success-icon">
                            <i className="fa-solid fa-circle-check"></i>
                        </div>
                        <h2>Parts Request Sent Successfully!</h2>
                        <p>Your parts request has been sent to the parts manager.</p>
                        
                        <div className="request-summary">
                            <h3>Request Summary</h3>
                            
                            <div className="summary-info">
                                <p><strong>Job ID:</strong> #{jobId}</p>
                                <p><strong>Vehicle:</strong> {job.vehicle?.make} {job.vehicle?.model}</p>
                                <p><strong>License Plate:</strong> {job.vehicle?.license_plate}</p>
                            </div>
                            
                            {selectedServices.length > 0 && (
                                <div className="services-summary">
                                    <h4>Services:</h4>
                                    <ul>
                                        {selectedServices.map(service => (
                                            <li key={service.id}>
                                                {service.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            
                            <div className="parts-summary">
                                <h4>Parts Requested:</h4>
                                <ul>
                                    {parts.map(part => (
                                        <li key={part.id}>
                                            {part.name} (Qty: {part.quantity})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        
                        <div className="confirmation-actions">
                            <button 
                                className="btn-dashboard" 
                                onClick={() => navigate('/mechanic/dashboard')}
                            >
                                <i className="fa-solid fa-home"></i>
                                Return to Dashboard
                            </button>
                            <button 
                                className="btn-new-request" 
                                onClick={() => {
                                    setShowConfirmation(false);
                                    setParts([]);
                                    setSelectedServices([]);
                                }}
                            >
                                <i className="fa-solid fa-plus"></i>
                                Create New Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RepairDetails;