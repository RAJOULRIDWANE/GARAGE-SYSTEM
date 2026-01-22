import React from 'react';
import './Services.css';

function Services() {
  const services = [
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#E0F2FE"/>
          <circle cx="20" cy="20" r="8" stroke="#2B7FE8" strokeWidth="2"/>
        </svg>
      ),
      title: 'Oil Change',
      description: 'Regular oil changes to keep your engine running smoothly and extend its life.'
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#E0F2FE"/>
          <circle cx="20" cy="20" r="6" stroke="#2B7FE8" strokeWidth="2"/>
          <circle cx="20" cy="20" r="2" fill="#2B7FE8"/>
        </svg>
      ),
      title: 'Brake Services',
      description: 'Inspection, repair, and replacement of brake pads, rotors, and brake fluid as needed.'
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#E0F2FE"/>
          <rect x="14" y="16" width="12" height="8" rx="1" stroke="#2B7FE8" strokeWidth="2"/>
        </svg>
      ),
      title: 'Engine diagnostics',
      description: 'Advanced diagnostic services to identify and fix engine problems and warning lights.'
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#E0F2FE"/>
          <circle cx="20" cy="20" r="7" stroke="#2B7FE8" strokeWidth="2"/>
          <path d="M20 15V20L23 23" stroke="#2B7FE8" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Tire Services',
      description: 'Rotation, balancing, alignment, and replacement of tires for optimal performance.'
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#E0F2FE"/>
          <rect x="15" y="17" width="10" height="6" rx="1" stroke="#2B7FE8" strokeWidth="2"/>
        </svg>
      ),
      title: 'Battery Services',
      description: 'Testing, charging, and replacement of batteries to avoid unexpected breakdowns.'
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#E0F2FE"/>
          <path d="M16 18C16 16.9 16.9 16 18 16H22C23.1 16 24 16.9 24 18V24H16V18Z" stroke="#2B7FE8" strokeWidth="2"/>
        </svg>
      ),
      title: 'A/C Services',
      description: 'Inspection, recharge, and repair of air conditioning systems for your comfort.'
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#E0F2FE"/>
          <path d="M20 14L16 18L20 22L24 18L20 14Z" stroke="#2B7FE8" strokeWidth="2"/>
        </svg>
      ),
      title: 'Transmission Services',
      description: 'Inspection, fluid replacement, and repair services to ensure smooth shifting and performance.'
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#E0F2FE"/>
          <circle cx="20" cy="20" r="6" stroke="#2B7FE8" strokeWidth="2"/>
          <path d="M20 14V12M20 28V26M26 20H28M12 20H14" stroke="#2B7FE8" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Suspension & Steering',
      description: 'Repair and alignment of shocks, struts, and steering components for a stable and comfortable ride.'
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#E0F2FE"/>
          <path d="M16 20H24M20 16V24" stroke="#2B7FE8" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Exhaust System Repair',
      description: 'Inspection and replacement of mufflers, catalytic converters, and exhaust pipes to reduce noise and emissions.'
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#E0F2FE"/>
          <circle cx="20" cy="20" r="7" stroke="#2B7FE8" strokeWidth="2"/>
        </svg>
      ),
      title: 'Fuel System Services',
      description: 'Cleaning and maintenance of fuel injectors, pumps, and filters to improve fuel efficiency and performance.'
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#E0F2FE"/>
          <rect x="15" y="17" width="10" height="7" rx="1" stroke="#2B7FE8" strokeWidth="2"/>
        </svg>
      ),
      title: 'Radiator Services',
      description: 'Flushing, refilling, and leak repair to prevent engine overheating and maintain temperature control.'
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#E0F2FE"/>
          <circle cx="20" cy="20" r="7" stroke="#2B7FE8" strokeWidth="2"/>
        </svg>
      ),
      title: 'Electrical Repair',
      description: 'Diagnosis and replacement of headlights, taillights, fuses, and other electrical components.'
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#E0F2FE"/>
          <path d="M16 20L18.5 22.5L24 17" stroke="#2B7FE8" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Clutch Repair',
      description: 'Inspection, adjustment, and replacement of clutch components for manual transmission vehicles.'
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#E0F2FE"/>
          <circle cx="20" cy="20" r="6" stroke="#2B7FE8" strokeWidth="2"/>
        </svg>
      ),
      title: 'Wheel Alignment',
      description: 'Precise wheel alignment to improve handling, reduce tire wear, and ensure driving safety.'
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#E0F2FE"/>
          <circle cx="20" cy="20" r="7" stroke="#2B7FE8" strokeWidth="2"/>
        </svg>
      ),
      title: 'Safety Inspection',
      description: 'Comprehensive multi-point inspections to identify any safety issues before they become major problems.'
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#E0F2FE"/>
          <path d="M15 20H25M20 15V25" stroke="#2B7FE8" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Electrical Diagnostics',
      description: 'Advanced diagnostics to detect and fix wiring issues, sensor faults, and electronic malfunctions.'
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#E0F2FE"/>
          <rect x="16" y="18" width="8" height="5" rx="1" stroke="#2B7FE8" strokeWidth="2"/>
        </svg>
      ),
      title: 'Engine Cleaning & Detailing',
      description: 'Professional engine bay cleaning to remove grime, oil, and debris for better performance and aesthetics.'
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#E0F2FE"/>
          <circle cx="20" cy="20" r="6" stroke="#2B7FE8" strokeWidth="2"/>
        </svg>
      ),
      title: 'Emissions Testing',
      description: 'State-required emissions testing to ensure your vehicle meets environmental and regulatory standards.'
    }
  ];

  return (
    <div className="services-page">
      {/* Hero Header with Background Image */}
      <div className="services-hero">
        <div className="services-hero-content">
          <h1>Our Services</h1>
          <p>We offer a comprehensive range of automotive services to keep your vehicle in optimal conditions.</p>
        </div>
      </div>

      {/* Services Grid Section */}
      <div className="services-container">
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">
                {service.icon}
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Badge */}
      <div className="services-footer">
        <div className="support-badge">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L4 7V12C4 16.97 7.84 21.74 12 23C16.16 21.74 20 16.97 20 12V7L12 2Z" fill="#2B7FE8"/>
            <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Support 24/7</span>
        </div>
      </div>
    </div>
  );
}

export default Services;