import React, { useEffect } from 'react';
import { Link, useLocation  } from 'react-router-dom';
import './Services.css';

function Services() {

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  const categories = [
    {
      name: "Routine Maintenance",
      id: "maintenance",
      services: [
        { icon: "fa-oil-can", title: "Oil Change", description: "Regular oil changes to keep your engine running smoothly and extend its life." },
        { icon: "fa-car-battery", title: "Battery Services", description: "Testing, charging, and replacement of batteries to avoid unexpected breakdowns." },
        { icon: "fa-leaf", title: "Emissions Testing", description: "State-required emissions testing to ensure your vehicle meets environmental and regulatory standards." }
      ]
    },
    {
      name: "Brakes, Tires & Suspension",
      id: "brakes",
      services: [
        { icon: "fa-circle-stop", title: "Brake Services", description: "Inspection, repair, and replacement of brake pads, rotors, and brake fluid as needed." },
        { icon: "fa-dharmachakra", title: "Tire Services", description: "Rotation, balancing, alignment, and replacement of tires for optimal performance." },
        { icon: "fa-road", title: "Suspension & Steering", description: "Repair and alignment of shocks, struts, and steering components for a stable and comfortable ride." },
        { icon: "fa-dharmachakra", title: "Wheel Alignment", description: "Precise wheel alignment to improve handling, reduce tire wear, and ensure driving safety." }
      ]
    },
    {
      name: "Engine & Transmission",
      id: "engine",
      services: [
        { icon: "fa-microchip", title: "Engine Diagnostics", description: "Advanced diagnostic services to identify and fix engine problems and warning lights." },
        { icon: "fa-gears", title: "Transmission Services", description: "Inspection, fluid replacement, and repair services to ensure smooth shifting and performance." },
        { icon: "fa-gears", title: "Clutch Repair", description: "Inspection, adjustment, and replacement of clutch components for manual transmission vehicles." }
      ]
    },
    {
      name: "Electrical & Fuel Systems",
      id: "electrical",
      services: [
        { icon: "fa-bolt", title: "Electrical Diagnostics", description: "Advanced diagnostics to detect and fix wiring issues, sensor faults, and electronic malfunctions." },
        { icon: "fa-plug-circle-bolt", title: "Electrical Repair", description: "Diagnosis and replacement of headlights, taillights, fuses, and other electrical components." },
        { icon: "fa-gas-pump", title: "Fuel System Services", description: "Cleaning and maintenance of fuel injectors, pumps, and filters to improve fuel efficiency and performance." }
      ]
    },
    {
      name: "Cooling, Exhaust & Climate",
      id: "cooling",
      services: [
        { icon: "fa-temperature-half", title: "Radiator Services", description: "Flushing, refilling, and leak repair to prevent engine overheating and maintain temperature control." },
        { icon: "fa-wind", title: "Exhaust System Repair", description: "Inspection and replacement of mufflers, catalytic converters, and exhaust pipes to reduce noise and emissions." },
        { icon: "fa-fan", title: "A/C Services", description: "Inspection, recharge, and repair of air conditioning systems for your comfort." }
      ]
    },
    {
      name: "Inspection & Detailing",
      id: "inspection",
      services: [
        { icon: "fa-shield", title: "Safety Inspection", description: "Comprehensive multi-point inspections to identify any safety issues before they become major problems." },
        { icon: "fa-screwdriver-wrench", title: "Engine Cleaning & Detailing", description: "Professional engine bay cleaning to remove grime, oil, and debris for better performance and aesthetics." }
      ]
    }
  ];

  return (
    <div className="services-page">

      <div className="services-hero">
        <div className="services-hero-content">
          <h1>Our Services</h1>
          <p>We offer a complete range of professional automotive services.</p>
        </div>
      </div>

      <div className="services-container">

        {categories.map((category, index) => (
          <div key={index} className="service-category" id={category.id}>

            <h2 className="category-title">{category.name}</h2>

            <div className="services-grid">
              {category.services.map((service, i) => (
                <div key={i} className="service-card">

                  <i className={`fa-solid ${service.icon} service-icon`}></i>

                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>

                </div>
              ))}
            </div>

          </div>
        ))}

      </div>

      <div className="services-footer">
        <Link to="/contact" className="support-badge">
          <i className="fa-solid fa-shield-halved"></i>
          <span> Support 24/7 </span>
        </Link>
      </div>

    </div>
  );
}

export default Services;
