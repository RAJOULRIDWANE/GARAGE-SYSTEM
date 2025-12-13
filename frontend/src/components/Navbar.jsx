import './Navbar.css'

function Navbar({ onNavigate, currentPage }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left" onClick={() => onNavigate('home')}>
          <div className="navbar-logo-mark" />
          <span className="navbar-logo-text">Logo</span>
        </div>
        <nav className="navbar-links">
          <button
            type="button"
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            Home
          </button>
          <button type="button" className="nav-link">
            About
          </button>
          <button type="button" className="nav-link">
            Contact
          </button>
          <button type="button" className="nav-link">
            Tracking
          </button>
        </nav>
        <div className="navbar-actions">
          <button
            type="button"
            className="btn-outline"
            onClick={() => onNavigate('login')}
          >
            Login
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => onNavigate('signup')}
          >
            Sign up
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
