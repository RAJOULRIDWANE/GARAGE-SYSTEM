import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Services.css';

function Services() {
  const services = [
    {
      icon: ( <i class="fa-solid fa-oil-can"></i> ),
      title: 'Oil Change',
      description: 'Regular oil changes to keep your engine running smoothly and extend its life.'
    },
    {
      icon: ( <i class="fa-solid fa-circle-stop"></i> ),
      title: 'Brake Services',
      description: 'Inspection, repair, and replacement of brake pads, rotors, and brake fluid as needed.'
    },
    {
      icon: ( <i class="fa-solid fa-microchip"></i> ),
      title: 'Engine diagnostics',
      description: 'Advanced diagnostic services to identify and fix engine problems and warning lights.'
    },
    {
      icon: ( <i class="fa-solid fa-dharmachakra"></i> ),
      title: 'Tire Services',
      description: 'Rotation, balancing, alignment, and replacement of tires for optimal performance.'
    },
    {
      icon: ( <i class="fa-solid fa-car-battery"></i> ),
      title: 'Battery Services',
      description: 'Testing, charging, and replacement of batteries to avoid unexpected breakdowns.'
    },
    {
      icon: ( <i class="fa-solid fa-fan"></i> ),
      title: 'A/C Services',
      description: 'Inspection, recharge, and repair of air conditioning systems for your comfort.'
    },
    {
      icon: ( <i class="fa-solid fa-gears"></i> ),
      title: 'Transmission Services',
      description: 'Inspection, fluid replacement, and repair services to ensure smooth shifting and performance.'
    },
    {
      icon: ( <i class="fa-solid fa-road"></i> ),
      title: 'Suspension & Steering',
      description: 'Repair and alignment of shocks, struts, and steering components for a stable and comfortable ride.'
    },
    {
      icon: ( <i class="fa-solid fa-wind"></i> ),
      title: 'Exhaust System Repair',
      description: 'Inspection and replacement of mufflers, catalytic converters, and exhaust pipes to reduce noise and emissions.'
    },
    {
      icon: ( <i class="fa-solid fa-gas-pump"></i> ),
      title: 'Fuel System Services',
      description: 'Cleaning and maintenance of fuel injectors, pumps, and filters to improve fuel efficiency and performance.'
    },
    {
      icon: (  <i class="fa-solid fa-temperature-half"></i> ),
      title: 'Radiator Services',
      description: 'Flushing, refilling, and leak repair to prevent engine overheating and maintain temperature control.'
    },
    {
      icon: ( <i class="fa-solid fa-plug-circle-bolt"></i> ),
      title: 'Electrical Repair',
      description: 'Diagnosis and replacement of headlights, taillights, fuses, and other electrical components.'
    },
    {
      icon: ( <i class="fa-solid fa-gears"></i> ),
      title: 'Clutch Repair',
      description: 'Inspection, adjustment, and replacement of clutch components for manual transmission vehicles.'
    },
    {
      icon: ( <i class="fa-solid fa-dharmachakra"></i> ),
      title: 'Wheel Alignment',
      description: 'Precise wheel alignment to improve handling, reduce tire wear, and ensure driving safety.'
    },
    {
      icon: ( <i class="fa-solid fa-shield"></i> ),
      title: 'Safety Inspection',
      description: 'Comprehensive multi-point inspections to identify any safety issues before they become major problems.'
    },
    {
      icon: ( <i class="fa-solid fa-bolt"></i> ),
      title: 'Electrical Diagnostics',
      description: 'Advanced diagnostics to detect and fix wiring issues, sensor faults, and electronic malfunctions.'
    },
    {
      icon: ( <i class="fa-solid fa-screwdriver-wrench"></i> ),
      title: 'Engine Cleaning & Detailing',
      description: 'Professional engine bay cleaning to remove grime, oil, and debris for better performance and aesthetics.'
    },
    {
      icon: ( <i class="fa-solid fa-leaf"></i> ),
      title: 'Emissions Testing',
      description: 'State-required emissions testing to ensure your vehicle meets environmental and regulatory standards.'
    }, 
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
        <Link to="/contact">
          <div className="support-badge">
            <i class="fa-solid fa-shield-halved"></i>
            <span> Support 24/7 </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Services;