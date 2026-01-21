import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './About.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


// --- Helper Component: Animated Counter ---
const AnimatedCounter = ({ target, suffix = "", duration = 2000, decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false); // Ensures it only runs once

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Start animation only if visible and hasn't run yet
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          
          let start = 0;
          const end = parseFloat(target);
          // Calculate how much to increment per frame (assuming 60fps)
          const totalFrames = (duration / 1000) * 60; 
          const increment = end / totalFrames;

          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 1000 / 60); // 60 FPS
          
          // Cleanup interval if component unmounts
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the element is visible
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [target, duration]);

  return (
    <span ref={elementRef} className="stat-number">
      {count.toFixed(decimals)}{suffix}
    </span>
  );
};

const About = () => {
  return (
    <div className="about-page">
      
      {/* 1. Header Section */}
      <div className="about-header">
        <div className="about-header-content">
          <h1>Who We Are</h1>
          <p>Dedicated to keeping your vehicle running safely and smoothly.</p>
        </div>
      </div>

      {/* 2. Main Story Section */}
      <div className="about-container">
        <div className="story-section">
          <div className="story-text">
            <h2>Driving Excellence Since 2015</h2>
            <p>
              Welcome to <strong>Garage PFE</strong>. We started with a simple mission: 
              to provide transparent, high-quality auto repair services that treat customers like family.
            </p>
            <p>
              We know that car repairs can be stressful. That is why we prioritize clear communication 
              and honest pricing. Whether it is a routine oil change or a complex engine overhaul, 
              our certified mechanics use the latest diagnostic tools to get you back on the road safely.
            </p>
            
            {/* --- Updated Stats Section with Animation --- */}

          </div>
          
          {/* Placeholder for an actual image */}
          <div className="story-image-placeholder">
            <div className="placeholder-content">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Workshop Image</span>
            </div>
          </div>
        </div>
            <div className="stats-grid">              
              <div className="stat-card">
                <AnimatedCounter target={10} suffix="+" decimals={0} />
                <span className="stat-label">Years serving drivers</span>
              </div>

              <div className="stat-card">
                <AnimatedCounter target={4.9} suffix="★" decimals={1} />
                <span className="stat-label">Average customer rating</span>
              </div>

              <div className="stat-card">
                <AnimatedCounter target={17} suffix="" decimals={0} />
                <span className="stat-label">Expert technicians</span>
              </div>

              <div className="stat-card">
                {/* We count to 3 and add 'K+' as a suffix string */}
                <AnimatedCounter target={3} suffix="K+" decimals={0} />
                <span className="stat-label">Vehicles serviced annually</span>
              </div>
            </div>

        {/* 3. Why Choose Us (Values) */}
        <div className="values-section">
          <div className="section-title">
            <h2>Why Choose Garage PFE?</h2>
            <div className="title-underline"></div>
          </div>

          <div className="values-grid">
            {/* Card 1 */}
            <div className="value-card">
              <div className="value-icon">
                <i className="fa-regular fa-circle-check"></i>
              </div>
              <h3>Certified Experts</h3>
              <p>Our team consists of certified mechanics who undergo regular training to stay updated with modern car technologies.</p>
            </div>

            {/* Card 2 */}
            <div className="value-card">
              <div className="value-icon">
                <i className="fa-regular fa-clock"></i>
              </div>
              <h3>Fast Turnaround</h3>
              <p>We value your time. We work efficiently to diagnose and fix your vehicle without compromising on quality.</p>
            </div>

            {/* Card 3 */}
            <div className="value-card">
              <div className="value-icon">
                <i className="fa-regular fa-credit-card"></i>
              </div>
              <h3>Transparent Pricing</h3>
              <p>No hidden fees. We provide a detailed quote before starting any work, so you know exactly what you are paying for.</p>
            </div>
          </div>
        </div>

        {/* 4. CTA Section */}
        <div className="cta-banner">
          <h2>Ready to book an appointment?</h2>
          <p>Contact us today or visit our garage for a free checkup.</p>
          <Link to="/contact" className="cta-button">Get in Touch</Link>
        </div>

      </div>
    </div>
  );
};

export default About;