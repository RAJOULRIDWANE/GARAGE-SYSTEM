import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import MECHANIC from "../../public/images/MECHANIC.png";
import './Navbar.css'

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
          <div className="navbar-logo-mark">
            <img src={MECHANIC} alt="MecaPro logo" className="logo"/>
          </div>
          <span className="navbar-logo-text"> MecaPro </span>
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