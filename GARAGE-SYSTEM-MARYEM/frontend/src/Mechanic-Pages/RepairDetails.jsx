import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './Repairdetails.css';
import DashboardNavbar from '../components/DashboardNavbar';

const RepairDetails = () => {
    const { t } = useTranslation();
    const { jobId } = useParams();
    const navigate = useNavigate();

    // State
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedZone, setSelectedZone] = useState('all');
    const [selectedServices, setSelectedServices] = useState([]);
    const [parts, setParts] = useState([]); // Kept for compatibility if needed
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // Static Parts Data
    const services = [
        { id: 1, name: t('mechanic.parts.engine_block'), zone: 'engine', category: t('mechanic.categories.main_parts') },
        { id: 2, name: t('mechanic.parts.cylinder_head'), zone: 'engine', category: t('mechanic.categories.main_parts') },
        { id: 3, name: t('mechanic.parts.head_gasket'), zone: 'engine', category: t('mechanic.categories.main_parts') },
        { id: 4, name: t('mechanic.parts.pistons'), zone: 'engine', category: t('mechanic.categories.main_parts') },
        { id: 5, name: t('mechanic.parts.piston_rings'), zone: 'engine', category: t('mechanic.categories.main_parts') },
        { id: 6, name: t('mechanic.parts.connecting_rods'), zone: 'engine', category: t('mechanic.categories.main_parts') },
        { id: 7, name: t('mechanic.parts.crankshaft'), zone: 'engine', category: t('mechanic.categories.main_parts') },
        { id: 8, name: t('mechanic.parts.camshaft'), zone: 'engine', category: t('mechanic.categories.main_parts') },
        { id: 9, name: t('mechanic.parts.valves'), zone: 'engine', category: t('mechanic.categories.main_parts') },
        { id: 10, name: t('mechanic.parts.valve_springs'), zone: 'engine', category: t('mechanic.categories.main_parts') },
        { id: 11, name: t('mechanic.parts.injectors'), zone: 'engine', category: t('mechanic.categories.fuel_system') },
        { id: 12, name: t('mechanic.parts.fuel_pump'), zone: 'engine', category: t('mechanic.categories.fuel_system') },
        { id: 13, name: t('mechanic.parts.fuel_filter'), zone: 'engine', category: t('mechanic.categories.fuel_system') },
        { id: 14, name: t('mechanic.parts.injection_rail'), zone: 'engine', category: t('mechanic.categories.fuel_system') },
        { id: 15, name: t('mechanic.parts.throttle_body'), zone: 'engine', category: t('mechanic.categories.fuel_system') },
        { id: 16, name: t('mechanic.parts.spark_plugs'), zone: 'engine', category: t('mechanic.categories.ignition') },
        { id: 17, name: t('mechanic.parts.ignition_coils'), zone: 'engine', category: t('mechanic.categories.ignition') },
        { id: 18, name: t('mechanic.parts.ignition_harness'), zone: 'engine', category: t('mechanic.categories.ignition') },
        { id: 19, name: t('mechanic.parts.crankshaft_sensor'), zone: 'engine', category: t('mechanic.categories.ignition') },
        { id: 20, name: t('mechanic.parts.oil_pump'), zone: 'engine', category: t('mechanic.categories.lubrication') },
        { id: 21, name: t('mechanic.parts.oil_filter'), zone: 'engine', category: t('mechanic.categories.lubrication') },
        { id: 22, name: t('mechanic.parts.oil_pan'), zone: 'engine', category: t('mechanic.categories.lubrication') },
        { id: 23, name: t('mechanic.parts.pan_gasket'), zone: 'engine', category: t('mechanic.categories.lubrication') },
        { id: 24, name: t('mechanic.parts.oil_pressure_sensor'), zone: 'engine', category: t('mechanic.categories.lubrication') },
        { id: 26, name: t('mechanic.parts.radiator'), zone: 'engine', category: t('mechanic.categories.cooling') },
        { id: 27, name: t('mechanic.parts.engine_fan'), zone: 'engine', category: t('mechanic.categories.cooling') },
        { id: 28, name: t('mechanic.parts.thermostat'), zone: 'engine', category: t('mechanic.categories.cooling') },
        { id: 29, name: t('mechanic.parts.water_pump'), zone: 'engine', category: t('mechanic.categories.cooling') },
        { id: 30, name: t('mechanic.parts.coolant_hoses'), zone: 'engine', category: t('mechanic.categories.cooling') },
        { id: 31, name: t('mechanic.parts.expansion_tank'), zone: 'engine', category: t('mechanic.categories.cooling') },
        { id: 32, name: t('mechanic.parts.timing_belt'), zone: 'engine', category: t('mechanic.categories.distribution') },
        { id: 33, name: t('mechanic.parts.timing_chain'), zone: 'engine', category: t('mechanic.categories.distribution') },
        { id: 34, name: t('mechanic.parts.tensioner_pulley'), zone: 'engine', category: t('mechanic.categories.distribution') },
        { id: 35, name: t('mechanic.parts.crankshaft_pulley'), zone: 'engine', category: t('mechanic.categories.distribution') },
        { id: 36, name: t('mechanic.parts.tires'), zone: 'wheels', category: t('mechanic.categories.wheels') },
        { id: 37, name: t('mechanic.parts.rims'), zone: 'wheels', category: t('mechanic.categories.wheels') },
        { id: 38, name: t('mechanic.parts.hubcaps'), zone: 'wheels', category: t('mechanic.categories.wheels') },
        { id: 39, name: t('mechanic.parts.wheel_bolts'), zone: 'wheels', category: t('mechanic.categories.wheels') },
        { id: 40, name: t('mechanic.parts.tire_valves'), zone: 'wheels', category: t('mechanic.categories.wheels') },
        { id: 41, name: t('mechanic.parts.brake_discs'), zone: 'wheels', category: t('mechanic.categories.braking') },
        { id: 42, name: t('mechanic.parts.brake_pads'), zone: 'wheels', category: t('mechanic.categories.braking') },
        { id: 43, name: t('mechanic.parts.brake_calipers'), zone: 'wheels', category: t('mechanic.categories.braking') },
        { id: 44, name: t('mechanic.parts.brake_hoses'), zone: 'wheels', category: t('mechanic.categories.braking') },
        { id: 45, name: t('mechanic.parts.master_cylinder'), zone: 'wheels', category: t('mechanic.categories.braking') },
        { id: 46, name: t('mechanic.parts.brake_drums'), zone: 'wheels', category: t('mechanic.categories.braking') },
        { id: 47, name: t('mechanic.parts.shock_absorbers'), zone: 'wheels', category: t('mechanic.categories.suspension_steering') },
        { id: 48, name: t('mechanic.parts.springs'), zone: 'wheels', category: t('mechanic.categories.suspension_steering') },
        { id: 49, name: t('mechanic.parts.control_arms'), zone: 'wheels', category: t('mechanic.categories.suspension_steering') },
        { id: 50, name: t('mechanic.parts.ball_joints'), zone: 'wheels', category: t('mechanic.categories.suspension_steering') },
        { id: 51, name: t('mechanic.parts.silent_blocks'), zone: 'wheels', category: t('mechanic.categories.suspension_steering') },
        { id: 52, name: t('mechanic.parts.stabilizer_bar'), zone: 'wheels', category: t('mechanic.categories.suspension_steering') },
        { id: 53, name: t('mechanic.parts.steering_link'), zone: 'wheels', category: t('mechanic.categories.suspension_steering') },
        { id: 54, name: t('mechanic.parts.steering_rack'), zone: 'wheels', category: t('mechanic.categories.suspension_steering') },
        { id: 55, name: t('mechanic.parts.exhaust_manifold'), zone: 'exhaust', category: t('mechanic.categories.exhaust') },
        { id: 56, name: t('mechanic.parts.manifold_gasket'), zone: 'exhaust', category: t('mechanic.categories.exhaust') },
        { id: 57, name: t('mechanic.parts.catalyst'), zone: 'exhaust', category: t('mechanic.categories.exhaust') },
        { id: 58, name: t('mechanic.parts.particle_filter'), zone: 'exhaust', category: t('mechanic.categories.exhaust') },
        { id: 59, name: t('mechanic.parts.lambda_sensor'), zone: 'exhaust', category: t('mechanic.categories.exhaust') },
        { id: 60, name: t('mechanic.parts.silencer'), zone: 'exhaust', category: t('mechanic.categories.exhaust') },
        { id: 61, name: t('mechanic.parts.exhaust_line'), zone: 'exhaust', category: t('mechanic.categories.exhaust') },
        { id: 62, name: t('mechanic.parts.exhaust_clamps'), zone: 'exhaust', category: t('mechanic.categories.exhaust') },
        { id: 63, name: t('mechanic.parts.rubber_supports'), zone: 'exhaust', category: t('mechanic.categories.exhaust') },
        { id: 64, name: t('mechanic.parts.headlights'), zone: 'lights', category: t('mechanic.categories.front_lighting') },
        { id: 65, name: t('mechanic.parts.bulbs'), zone: 'lights', category: t('mechanic.categories.front_lighting') },
        { id: 66, name: t('mechanic.parts.front_indicators'), zone: 'lights', category: t('mechanic.categories.front_lighting') },
        { id: 67, name: t('mechanic.parts.parking_lights'), zone: 'lights', category: t('mechanic.categories.front_lighting') },
        { id: 68, name: t('mechanic.parts.rear_lights'), zone: 'lights', category: t('mechanic.categories.rear_lighting') },
        { id: 69, name: t('mechanic.parts.brake_lights'), zone: 'lights', category: t('mechanic.categories.rear_lighting') },
        { id: 70, name: t('mechanic.parts.reverse_lights'), zone: 'lights', category: t('mechanic.categories.rear_lighting') },
        { id: 71, name: t('mechanic.parts.rear_indicators'), zone: 'lights', category: t('mechanic.categories.rear_lighting') },
        { id: 72, name: t('mechanic.parts.fog_lights'), zone: 'lights', category: t('mechanic.categories.others') },
        { id: 73, name: t('mechanic.parts.plate_light'), zone: 'lights', category: t('mechanic.categories.others') },
        { id: 74, name: t('mechanic.parts.fuses'), zone: 'lights', category: t('mechanic.categories.others') },
        { id: 75, name: t('mechanic.parts.relays'), zone: 'lights', category: t('mechanic.categories.others') },
        { id: 76, name: t('mechanic.parts.light_switch'), zone: 'lights', category: t('mechanic.categories.others') },
        { id: 77, name: t('mechanic.parts.bumpers'), zone: 'body', category: t('mechanic.categories.exterior_parts') },
        { id: 78, name: t('mechanic.parts.hood'), zone: 'body', category: t('mechanic.categories.exterior_parts') },
        { id: 79, name: t('mechanic.parts.fenders'), zone: 'body', category: t('mechanic.categories.exterior_parts') },
        { id: 80, name: t('mechanic.parts.doors'), zone: 'body', category: t('mechanic.categories.exterior_parts') },
        { id: 81, name: t('mechanic.parts.trunk'), zone: 'body', category: t('mechanic.categories.exterior_parts') },
        { id: 82, name: t('mechanic.parts.mirrors'), zone: 'body', category: t('mechanic.categories.exterior_parts') },
        { id: 83, name: t('mechanic.parts.grille'), zone: 'body', category: t('mechanic.categories.exterior_parts') },
        { id: 84, name: t('mechanic.parts.windshield'), zone: 'body', category: t('mechanic.categories.windows_seals') },
        { id: 85, name: t('mechanic.parts.side_windows'), zone: 'body', category: t('mechanic.categories.windows_seals') },
        { id: 86, name: t('mechanic.parts.rear_window'), zone: 'body', category: t('mechanic.categories.windows_seals') },
        { id: 87, name: t('mechanic.parts.door_seals'), zone: 'body', category: t('mechanic.categories.windows_seals') },
        { id: 88, name: t('mechanic.parts.window_regulators'), zone: 'body', category: t('mechanic.categories.windows_seals') },
        { id: 89, name: t('mechanic.parts.staples'), zone: 'body', category: t('mechanic.categories.fasteners_accessories') },
        { id: 90, name: t('mechanic.parts.clips'), zone: 'body', category: t('mechanic.categories.fasteners_accessories') },
        { id: 91, name: t('mechanic.parts.body_screws'), zone: 'body', category: t('mechanic.categories.fasteners_accessories') },
        { id: 92, name: t('mechanic.parts.supports'), zone: 'body', category: t('mechanic.categories.fasteners_accessories') },
        { id: 93, name: t('mechanic.parts.interior_trims'), zone: 'body', category: t('mechanic.categories.fasteners_accessories') },
        { id: 94, name: t('mechanic.parts.carburetor'), zone: 'engine', category: t('mechanic.categories.fuel_system') },
    ];

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('ACCESS_TOKEN');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const [jobResponse, userResponse] = await Promise.all([
                    axios.get(`http://127.0.0.1:8000/api/mechanic/jobs/${jobId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('http://127.0.0.1:8000/api/user', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                // Handle data wrapper
                const jobData = jobResponse.data.data || jobResponse.data;
                console.log("Job Data Processed:", jobData);

                setJob(jobData);
                setUser(userResponse.data);
            } catch (error) {
                console.error('Failed to fetch details:', error);
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [jobId, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('USER_ROLE');
        navigate('/login');
    };

    const getClientName = () => {
        if (!job) return '';
        if (job.vehicle?.owner_name) return job.vehicle.owner_name;
        if (job.vehicle?.client?.name) return job.vehicle.client.name;
        if (job.vehicle?.user?.name) return job.vehicle.user.name;
        if (job.client?.name) return job.client.name;
        return t('mechanic.unknown_client');
    };

    // Filter logic
    const filteredServices = services.filter(s => {
        const matchZone = selectedZone === 'all' || s.zone === selectedZone;
        const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchZone && matchSearch;
    });

    // Group by category
    const groupedServices = filteredServices.reduce((groups, service) => {
        const category = service.category;
        if (!groups[category]) groups[category] = [];
        groups[category].push(service);
        return groups;
    }, {});

    // Cart Logic
    const toggleService = (service) => {
        setSelectedServices(prev => {
            const exists = prev.find(s => s.id === service.id);
            if (exists) return prev.filter(s => s.id !== service.id);
            return [...prev, { ...service, quantity: 1 }];
        });
    };

    const updateQuantity = (id, change) => {
        setSelectedServices(prev => prev.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(1, item.quantity + change);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const removeItem = (id) => {
        setSelectedServices(prev => prev.filter(item => item.id !== id));
    };

    const totalItems = selectedServices.reduce((sum, item) => sum + item.quantity, 0);

    const sendPartsRequest = async () => {
        if (selectedServices.length === 0 && parts.length === 0) {
            alert(t('mechanic.details.no_parts_error'));
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem('ACCESS_TOKEN');
            const combinedParts = [
                ...selectedServices.map(s => ({ name: s.name, quantity: s.quantity })),
                ...parts.map(p => ({ name: p.name, quantity: p.quantity }))
            ];

            const requestData = {
                job_id: jobId,
                vehicle: {
                    make: job.vehicle?.make,
                    model: job.vehicle?.model,
                    license_plate: job.vehicle?.plate_number || job.vehicle?.license_plate
                },
                parts: combinedParts,
                notes: `Parts request for job #${jobId} - ${getClientName()}`
            };

            await axios.post('http://127.0.0.1:8000/api/mechanic/parts-request', requestData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setShowConfirmation(true);
        } catch (error) {
            console.error('Failed to send parts request:', error);
            alert(t('mechanic.details.send_error'));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="dashboard-container">
            <DashboardNavbar user={user || { name: t('dashboard.expert'), role: 'Mechanic' }} />
            <div className="loading-state">
                <div className="spinner-mini"></div>
                <p>{t('mechanic.details.loading')}</p>
            </div>
        </div>
    );

    if (!job) return (
        <div className="repair-details-container">
            <DashboardNavbar user={user} onLogout={handleLogout} />
            <div className="error-state">
                <h2>{t('mechanic.details.not_found')}</h2>
                <button
                    className="btn-error-action"
                    onClick={() => navigate('/mechanic/dashboard')}
                >
                    {t('mechanic.details.return_dashboard')}
                </button>
            </div>
        </div>
    );

    return (
        <div className="repair-details-container">
            <header className="dashboard-header">
                <DashboardNavbar user={user} onLogout={handleLogout} onChangePassword={() => setShowPasswordModal(true)} />
            </header>

            <div className="repair-content-wrapper">
                <div className="back-link-container">
                    <Link to="/mechanic/dashboard" className="back-link">
                        <i className="fa-solid fa-arrow-left"></i> {t('mechanic.details.back')}
                    </Link>
                </div>

                {!showConfirmation ? (
                    <div className="repair-content">
                        {/* --- VEHICLE INFORMATION SECTION --- */}
                        <section className="vehicle-info-section">
                            <h2>
                                <i className="fa-solid fa-car"></i> {t('mechanic.details.title')}
                            </h2>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>{t('mechanic.details.client_name')}</label>
                                    <input type="text" value={getClientName()} readOnly />
                                </div>
                                <div className="info-item">
                                    <label>{t('mechanic.details.make')}</label>
                                    <input type="text" value={job.vehicle?.make || 'N/A'} readOnly />
                                </div>
                                <div className="info-item">
                                    <label>{t('mechanic.details.model')}</label>
                                    <input type="text" value={job.vehicle?.model || 'N/A'} readOnly />
                                </div>
                                <div className="info-item">
                                    <label>{t('mechanic.details.license_plate')}</label>
                                    <input type="text" value={job.vehicle?.plate_number || job.vehicle?.license_plate || 'N/A'} readOnly />
                                </div>

                                <div className="info-item full-width">
                                    <label>{t('mechanic.details.service_requested')}</label>
                                    <div className="service-badges-container">
                                        {/* FIX: Prioritize showing array of services, fallback to single service */}
                                        {job.services && job.services.length > 0 ? (
                                            job.services.map((s, i) => (
                                                <span key={i} className="service-badge">
                                                    {s.name}
                                                </span>
                                            ))
                                        ) : job.service ? (
                                            <span className="service-badge">
                                                {job.service.name}
                                            </span>
                                        ) : (
                                            t('mechanic.details.general_repair')
                                        )}
                                    </div>
                                </div>

                                <div className="info-item full-width">
                                    <label>{t('mechanic.details.description')}</label>
                                    <textarea
                                        value={job.description || t('mechanic.details.no_description')}
                                        readOnly
                                    ></textarea>
                                </div>
                            </div>
                        </section>

                        {/* --- PARTS SELECTION SECTION --- */}
                        <section className="services-section">
                            <div className="services-header">
                                <h2><i className="fa-solid fa-toolbox"></i> {t('mechanic.details.select_parts')}</h2>
                                <div className="search-wrapper">
                                    <input
                                        className="search-input"
                                        type="text"
                                        placeholder={t('mechanic.details.search_parts')}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <i className="fa-solid fa-search"></i>
                                </div>
                            </div>

                            <div className="zone-filter">
                                {['all', 'engine', 'wheels', 'exhaust', 'lights', 'body'].map(zone => (
                                    <button
                                        key={zone}
                                        className={selectedZone === zone ? 'active' : ''}
                                        onClick={() => setSelectedZone(zone)}
                                    >
                                        {t(`mechanic.details.zones.${zone}`)}
                                    </button>
                                ))}
                            </div>

                            <div className="services-grid-container">
                                {Object.entries(groupedServices).map(([category, items]) => (
                                    <div key={category} className="service-category-group">
                                        <h3 className="category-header">{category}</h3>
                                        <div className="services-grid">
                                            {items.map(service => {
                                                const isSelected = selectedServices.find(s => s.id === service.id);
                                                return (
                                                    <div
                                                        key={service.id}
                                                        className={`service-card ${isSelected ? 'selected' : ''}`}
                                                        onClick={() => toggleService(service)}
                                                    >
                                                        <div className="service-info">
                                                            <h3>{service.name}</h3>
                                                            <span className="service-zone">{t(`mechanic.details.zones.${service.zone}`)}</span>
                                                        </div>
                                                        {isSelected && (
                                                            <div className="selected-checkmark">
                                                                <i className="fa-solid fa-check-circle"></i>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* --- SUMMARY SECTION --- */}
                        {selectedServices.length > 0 && (
                            <section className="summary-section">
                                <div className="summary-header">
                                    <h3><i className="fa-solid fa-cart-shopping"></i> {t('mechanic.details.order_summary')}</h3>
                                    <span className="badge-count">{t('mechanic.details.items_selected', { count: selectedServices.length })}</span>
                                </div>
                                <div className="summary-list">
                                    <div className="summary-list-header">
                                        <span>{t('mechanic.details.part_name')}</span>
                                        <span>{t('mechanic.details.zone')}</span>
                                        <span>{t('mechanic.details.quantity')}</span>
                                        <span></span>
                                    </div>
                                    {selectedServices.map(item => (
                                        <div key={item.id} className="summary-item-row">
                                            <div><span className="item-name">{item.name}</span></div>
                                            <div><span className="item-zone-tag">{t(`mechanic.details.zones.${item.zone}`)}</span></div>
                                            <div>
                                                <input
                                                    type="number"
                                                    className="qty-custom-input"
                                                    value={item.quantity}
                                                    min="1"
                                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value || 1) - item.quantity)}
                                                />
                                            </div>
                                            <div>
                                                <button className="btn-remove" onClick={() => removeItem(item.id)}>
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="summary-footer">
                                    <div className="total-row">
                                        <span>{t('mechanic.details.total_quantity')}</span>
                                        <span className="total-number">{totalItems}</span>
                                    </div>
                                    <button
                                        className="btn-submit"
                                        onClick={sendPartsRequest}
                                        disabled={submitting}
                                    >
                                        <i className="fa-solid fa-paper-plane"></i> {submitting ? t('mechanic.details.sending') : t('mechanic.details.confirm_send')}
                                    </button>
                                </div>
                            </section>
                        )}
                    </div>
                ) : (
                    /* --- CONFIRMATION VIEW --- */
                    <div className="confirmation-container">
                        <div className="confirmation-success">
                            <div className="success-icon"><i className="fa-solid fa-circle-check"></i></div>
                            <h2>{t('mechanic.details.request_sent')}</h2>
                            <div className="request-summary">
                                <p><strong>{t('mechanic.details.job_id')}:</strong> #{jobId}</p>
                                <p><strong>{t('mechanic.details.vehicle')}:</strong> {job.vehicle?.make} {job.vehicle?.model}</p>
                                <h4>{t('mechanic.details.parts_requested')}:</h4>
                                <ul>
                                    {selectedServices.map(part => (
                                        <li key={part.id}>{part.name} <span className="qty-pill">x{part.quantity}</span></li>
                                    ))}
                                </ul>
                            </div>
                            <div className="confirmation-actions">
                                <button className="btn-secondary" onClick={() => navigate('/mechanic/dashboard')}>
                                    <i className="fa-solid fa-home"></i> {t('mechanic.details.return_dashboard')}
                                </button>
                                <button className="btn-primary" onClick={() => { setShowConfirmation(false); setSelectedServices([]); }}>
                                    <i className="fa-solid fa-plus"></i> {t('mechanic.details.new_request')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RepairDetails;