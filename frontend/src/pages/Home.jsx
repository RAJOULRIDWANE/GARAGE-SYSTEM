import './Home.css'

function Home({ onNavigate }) {
  return (
    <main className="page-content home-page">
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-inner">
          <div className="hero-text">
            <h1>
              Professional Repair &amp;
              <br />
              Maintenance Services
            </h1>
            <p>
              Smooth rides start with smart maintenance – care for your car today!
            </p>
            <div className="hero-actions">
              <button type="button" className="btn-primary" onClick={() => onNavigate('signup')}>
                Get Started
              </button>
              <button type="button" className="btn-outline">
                Call us now
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="status-section">
        <div className="section-inner">
          <h2>Check Your Car Status</h2>
          <p className="section-subtitle">
            Enter your Track Number to check your car&apos;s service history,
            upcoming maintenance, and current status.
          </p>
          <div className="status-card">
            <div className="status-input-row">
              <input type="text" placeholder="Enter Track Number" />
              <button type="button" className="btn-primary">
                Check Status
              </button>
            </div>
            <div className="status-options">
              <div className="status-pill">
                <div className="status-icon" />
                <span>Service History</span>
              </div>
              <div className="status-pill">
                <div className="status-icon" />
                <span>Upcoming Maintenance</span>
              </div>
              <div className="status-pill">
                <div className="status-icon" />
                <span>Recall Alert</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="services-section">
        <div className="section-inner">
          <h2>Our Services</h2>
          <p className="section-subtitle">
            We offer a complete range of automotive services to keep your vehicle in
            optimal condition.
          </p>
          <div className="card-grid">
            <article className="info-card">
              <div className="card-icon" />
              <h3>Oil Change</h3>
              <p>
                Regular oil changes to keep your engine running smoothly and
                efficiently.
              </p>
            </article>
            <article className="info-card">
              <div className="card-icon" />
              <h3>Brake Services</h3>
              <p>
                Inspection, repair, and replacement of brake systems for your
                safety.
              </p>
            </article>
            <article className="info-card">
              <div className="card-icon" />
              <h3>Engine Diagnostics</h3>
              <p>
                Computer diagnostics to quickly detect and resolve engine issues.
              </p>
            </article>
            <article className="info-card">
              <div className="card-icon" />
              <h3>Tire Services</h3>
              <p>
                Rotation, balancing, alignment, and replacement for maximum
                performance.
              </p>
            </article>
            <article className="info-card">
              <div className="card-icon" />
              <h3>Battery Services</h3>
              <p>
                Testing and replacement to prevent unexpected breakdowns.
              </p>
            </article>
            <article className="info-card">
              <div className="card-icon" />
              <h3>A/C Services</h3>
              <p>
                Inspection, recharge, and repair to keep your cabin comfortable.
              </p>
            </article>
          </div>
          <div className="section-cta">
            <button type="button" className="btn-primary" onClick={() => onNavigate('signup')}>
              View all services
            </button>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="section-inner">
          <h2>Why Choose Us</h2>
          <p className="section-subtitle">
            We are committed to providing exceptional service and building
            long-term relationships with our customers.
          </p>
          <div className="card-grid">
            <article className="info-card">
              <div className="card-icon" />
              <h3>Expert Mechanics</h3>
              <p>Certified technicians with years of experience.</p>
            </article>
            <article className="info-card">
              <div className="card-icon" />
              <h3>Fast Turnaround</h3>
              <p>Quick diagnostics and services to save you time.</p>
            </article>
            <article className="info-card">
              <div className="card-icon" />
              <h3>Secure Warranty</h3>
              <p>Reliable warranty coverage on all major services.</p>
            </article>
            <article className="info-card">
              <div className="card-icon" />
              <h3>Affordable Pricing</h3>
              <p>Transparent pricing with no hidden fees.</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
