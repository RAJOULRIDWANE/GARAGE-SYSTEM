import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import MECHANIC from "../../public/images/MECHANIC.png";
import './Navbar.css';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

function Navbar() {
  const { t } = useTranslation();
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
            <img src={MECHANIC} alt="MecaPro logo" className="logo" />
          </div>
          <span className="navbar-logo-text"> MecaPro </span>
        </Link>

        <nav className="navbar-links">

          <NavLink
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            to="/"
            end
          >
            {t('navbar.home')}
          </NavLink>

          <NavLink
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            to="/about"
          >
            {t('navbar.about')}
          </NavLink>

          <NavLink
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            to="/contact"
          >
            {t('navbar.contact')}
          </NavLink>

        </nav>

        <div className="navbar-actions">
          <Link className="btn-outline" to="/login"> {t('auth.login')} </Link>
          <Link className="btn-primary" to="/signup"> {t('auth.signup')} </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}

export default Navbar