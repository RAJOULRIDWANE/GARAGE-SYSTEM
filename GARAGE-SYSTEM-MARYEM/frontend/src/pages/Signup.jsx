import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import './Auth.css'
import '@fortawesome/fontawesome-free/css/all.min.css';

function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 1. State for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '' // Laravel requires this exact name
  });

  // 2. State for feedback
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  // 3. Handle Input Changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user types to make UI feel responsive
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  // 4. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');
    setLoading(true);

    try {
      // --- API CALL ---
      // We assume standard users are 'client'. 
      // If you updated AuthController to accept roles, you can add role: 'client' here.
      const response = await axios.post('http://127.0.0.1:8000/api/register', formData);

      console.log("Signup Success:", response.data);

      // Save email for verification page
      localStorage.setItem('verify_email', formData.email);

      // --- REDIRECT TO VERIFY ---
      navigate('/verify-otp', { state: { email: formData.email } });

    } catch (err) {
      console.error("Signup Error:", err);
      setLoading(false);

      if (err.response && err.response.status === 422) {
        // Validation Errors (e.g., Email taken, passwords don't match)
        setErrors(err.response.data.errors);
      } else {
        // Network or Server Errors
        setGeneralError("Something went wrong. Is the server running?");
      }
    }
  };

  return (
    <main className="page-content auth-page">
      <div className="auth-inner">
        <section className="auth-hero">
          <div className="auth-hero-overlay" />
          <div className="auth-hero-content">
            <h1>{t('auth.signup_title')}</h1>
            <p>{t('auth.signup_subtitle')}</p>
          </div>
        </section>

        <section className="auth-form-panel">
          <div className="auth-form-card">
            <div className="auth-avatar">
              <div className="auth-avatar-icon">
                <i className="fa-regular fa-user"></i>
              </div>
            </div>

            <h2>{t('auth.signup_link')}</h2>

            {/* General Error Message */}
            {generalError && (
              <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>
                {generalError}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>

              {/* NAME */}
              <label className="auth-field">
                <span>{t('auth.name_label')}</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('auth.name_placeholder')}
                  required
                />
                {errors.name && <small style={{ color: 'red' }}>{errors.name[0]}</small>}
              </label>

              {/* EMAIL */}
              <label className="auth-field">
                <span>{t('auth.email_label')}</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('auth.email_placeholder')}
                  required
                />
                {errors.email && <small style={{ color: 'red' }}>{errors.email[0]}</small>}
              </label>

              {/* PASSWORD */}
              <label className="auth-field">
                <span>{t('auth.password_label')}</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t('auth.password_placeholder')}
                  required
                />
                {errors.password && <small style={{ color: 'red' }}>{errors.password[0]}</small>}
              </label>

              {/* CONFIRM PASSWORD */}
              <label className="auth-field">
                <span>{t('auth.confirm_password_label')}</span>
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder={t('auth.confirm_password_placeholder')}
                  required
                />
              </label>

              <button
                type="submit"
                className="btn-primary auth-submit"
                disabled={loading}
              >
                {loading ? t('auth.verifying') : t('auth.signup_button')}
              </button>
            </form>

            <p className="auth-footer-text">
              {t('auth.have_account')}{' '}
              <Link to="/login" className="auth-link-button"> {t('auth.login_link')} </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Signup;