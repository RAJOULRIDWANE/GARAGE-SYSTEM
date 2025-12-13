import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo-mark" />
            <span className="footer-logo-text">Logo</span>
          </div>
          <div className="footer-columns">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#">Pricing</a>
              <a href="#">Features</a>
            </div>
            <div className="footer-column">
              <h4>Services</h4>
              <a href="#">Maintenance</a>
              <a href="#">Repairs</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Blog</a>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <a href="#">Help Center</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 All Rights Reserved to Auto Repair</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
