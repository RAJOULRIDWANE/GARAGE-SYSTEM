import "./About.css";

const services = [
  {
    title: "Scheduled Maintenance",
    description:
      "End-to-end service tracking, reminders, and digital history for every visit.",
  },
  {
    title: "Diagnostics & Repairs",
    description:
      "State-of-the-art equipment and certified mechanics to solve issues fast and right.",
  },
  {
    title: "Detailing & Care",
    description:
      "Interior and exterior detailing packages designed to protect and refresh your ride.",
  },
  {
    title: "Fleet Support",
    description:
      "Custom maintenance programs and reporting tailored for business vehicle fleets.",
  },
];

function About() {
  return (
    <main className="page-content about-page">
      <section className="about-hero">
        <div className="about-hero-overlay" />
        <div className="about-hero-content">
          <p className="eyebrow">About the Garage System</p>
          <h1>Keeping every journey on track.</h1>
          <p>
            Garage System is a digital companion built to modernize automotive service experiences.
            We combine intuitive booking, transparent progress updates, and comprehensive
            maintenance history so customers always know the status of their vehicle.
          </p>
        </div>
      </section>

      <section className="about-section about-project">
        <div className="section-shell">
          <div className="about-project-text">
            <h2>Built for clarity and trust</h2>
            <p>
              Our platform was designed with customer confidence in mind. From the moment a vehicle
              arrives, every inspection, part order, and technician note is captured in one place.
              Real-time notifications ensure owners are updated at every milestone, while integrated
              reporting helps garage managers stay ahead of the workflow.
            </p>
            <p>
              Whether you&rsquo;re checking service history or approving a new repair, Garage System
              streamlines the process so teams can focus on delivering exceptional results.
            </p>
          </div>
          <div className="about-highlights">
            <article className="highlight-card">
              <span className="highlight-title">24/7 visibility</span>
              <p>Instant status updates across desktop and mobile keep drivers informed.</p>
            </article>
            <article className="highlight-card">
              <span className="highlight-title">Seamless workflows</span>
              <p>Assign jobs, track progress, and log approvals with a few simple clicks.</p>
            </article>
            <article className="highlight-card">
              <span className="highlight-title">Data-driven insights</span>
              <p>Analyze turnaround times and service metrics to continuously improve.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="about-section about-garage">
        <div className="section-shell">
          <div className="about-garage-copy">
            <h2>The garage behind the platform</h2>
            <p>
              We started as a neighborhood workshop committed to honest diagnostics and careful
              craftsmanship. Over the years, our team expanded into a full-service facility offering
              everything from quick tune-ups to complex rebuilds. Today, we combine that legacy of
              hands-on expertise with a smart digital experience that keeps customers in the loop.
            </p>
            <p>
              Our technicians are ASE-certified, our front desk team is dedicated to clear
              communication, and our processes are built around safety standards. The Garage System
              reflects how we work every day: transparent, reliable, and always striving to exceed
              expectations.
            </p>
          </div>
          <div className="about-garage-stats">
            <div className="stat-card">
              <span className="stat-value">15+</span>
              <span className="stat-label">Years serving drivers</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">4.9★</span>
              <span className="stat-label">Average customer rating</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">12</span>
              <span className="stat-label">Expert technicians</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">3K+</span>
              <span className="stat-label">Vehicles serviced annually</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section about-services">
        <div className="section-shell">
          <header className="services-header">
            <h2>Services we offer</h2>
            <p>
              From diagnostics to detailing, our garage delivers full-spectrum care tuned to each
              vehicle&rsquo;s needs.
            </p>
          </header>
          <div className="services-grid">
            {services.map((service) => (
              <article className="service-card" key={service.title}>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
