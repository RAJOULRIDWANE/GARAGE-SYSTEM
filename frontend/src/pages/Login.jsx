import './Auth.css'

function Login({ onNavigate }) {
  return (
    <main className="page-content auth-page">
      <div className="auth-inner">
        <section className="auth-hero">
          <div className="auth-hero-overlay" />
          <div className="auth-hero-content">
            <h1>Welcome Back!</h1>
            <p>Create your account and bring us your vehicle!</p>
          </div>
        </section>
        <section className="auth-form-panel">
          <div className="auth-form-card">
            <div className="auth-avatar">
              <div className="auth-avatar-icon">
                <i class="fa-solid fa-user-check"></i>
              </div>
            </div>
            <h2>Welcome Back!</h2>
            <form
              className="auth-form"
              onSubmit={(e) => {
                e.preventDefault()
              }}
            >
              <label className="auth-field">
                <span>Email</span>
                <input type="email" placeholder="Enter your email" />
              </label>
              <label className="auth-field">
                <span>Password</span>
                <input type="password" placeholder="Enter your password" />
              </label>
              <div className="auth-extra-row">
                <button type="button" className="auth-link-button small">
                  Forgot password?
                </button>
              </div>
              <button type="submit" className="btn-primary auth-submit">
                Login
              </button>
            </form>
            <p className="auth-footer-text">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                className="auth-link-button"
                onClick={() => onNavigate('signup')}
              >
                Sign up
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Login
