import './Navbar.css'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

function Navbar() { 
  const location = useLocation(); // To check which page we are on
  const navigate = useNavigate(); // To manually switch pages

  // This function handles the "Smart Scroll"
  const handleScrollToTracking = (e) => {
    e.preventDefault(); // Stop the default link jump
    
    const sectionId = "checkstatus-btn";

    // Scenario 1: We are already on the Home page
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } 
    // Scenario 2: We are on another page (like Login)
    else {
      navigate('/'); // Go to Home first
      
      // Wait 100ms for the Home page to load, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        
        <Link className="navbar-left" to="/">
          <div className="navbar-logo-mark" />
          <span className="navbar-logo-text">Logo</span>
        </Link>

        <nav className="navbar-links">
          
          <NavLink 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} 
            to="/" 
            end 
          > 
            Home 
          </NavLink>

          <NavLink 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} 
            to="/about"
          > 
            About 
          </NavLink>

          <NavLink 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} 
            to="/contact"
          > 
            Contact 
          </NavLink>

          {/* UPDATE: Use onClick to trigger our smart scroll function */}
          <Link 
            className="nav-link" 
            to="/#checkstatus-btn" 
            onClick={handleScrollToTracking}
          > 
            Tracking 
          </Link>

        </nav>

        <div className="navbar-actions">
          <Link className="btn-outline" to="/login"> Login </Link>
          <Link className="btn-primary" to="/signup"> Sign up </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar