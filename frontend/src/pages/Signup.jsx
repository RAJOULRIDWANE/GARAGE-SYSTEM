import './Auth.css'

function Signup({ onNavigate }) {
  return (
    <main className="page-content auth-page">
      <div className="auth-inner">
        <section className="auth-hero">
          <div className="auth-hero-overlay" />
          <div className="auth-hero-content">
            <h1>Join Us Today!</h1>
            <p>Create your account and bring us your vehicle!</p>
          </div>
        </section>
        <section className="auth-form-panel">
          <div className="auth-form-card">
            <div className="auth-avatar">
              <div className="auth-avatar-icon">
                <i class="fa-regular fa-user"></i>
              </div>
            </div>
            <h2>Create Account</h2>
            <form
              className="auth-form"
              onSubmit={(e) => {
                e.preventDefault()
              }}
            >
              <label className="auth-field">
                <span>Full Name</span>
                <input type="text" placeholder="Enter your full name" />
              </label>
              <label className="auth-field">
                <span>Email</span>
                <input type="email" placeholder="Enter your email" />
              </label>
              <label className="auth-field">
                <span>Password</span>
                <input type="password" placeholder="Create a password" />
              </label>
              <label className="auth-field">
                <span>Confirm Password</span>
                <input type="password" placeholder="Confirm your password" />
              </label>
              <button type="submit" className="btn-primary auth-submit">
                Sign up
              </button>
            </form>
            <p className="auth-footer-text">
              Already have an account?{' '}
              <button
                type="button"
                className="auth-link-button"
                onClick={() => onNavigate('login')}
              >
                Login
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Signup
