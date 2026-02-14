import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import './Auth.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function VerifyOtp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    // Get email from navigation state or local storage
    const stateEmail = location.state?.email;
    if (stateEmail) {
      setEmail(stateEmail);
    } else {
      // Fallback if someone navs directly
      const savedEmail = localStorage.getItem('verify_email');
      if (savedEmail) {
        setEmail(savedEmail);
      } else {
        navigate('/login');
      }
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/verify-otp", {
        email,
        otp
      });

      setMessage(response.data.message);
      setLoading(false);

      // Cleanup
      localStorage.removeItem('verify_email');

      // Redirect to login after success
      setTimeout(() => {
        navigate('/login', { state: { message: "Account verified! You can now login." } });
      }, 2000);

    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data.message) {
        setErrors({ otp: err.response.data.message });
      } else {
        setErrors({ otp: "Something went wrong. Please try again." });
      }
    }
  };

  const handleResend = async () => {
    setResending(true);
    setMessage("");
    setErrors({});

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/resend-otp", { email });
      setMessage(response.data.message);
    } catch (err) {
      setErrors({ resend: "Could not resend OTP. Try again later." });
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="page-content auth-page">
      <div className="auth-inner">
        <section className="auth-hero">
          <div className="auth-hero-overlay" />
          <div className="auth-hero-content">
            <h1>{t('auth.otp_title')}</h1>
            <p>{t('auth.otp_subtitle', { email })}</p>
          </div>
        </section>

        <section className="auth-form-panel">
          <div className="auth-form-card">
            <div className="auth-avatar">
              <div className="auth-avatar-icon">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
            </div>

            <h2>{t('auth.otp_title')}</h2>

            {message && (
              <div style={{ color: 'green', textAlign: 'center', marginBottom: '10px', background: '#e6fffa', padding: '10px', borderRadius: '5px' }}>
                {message}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="auth-field">
                <span>{t('auth.otp_label')}</span>
                <input
                  type="text"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="000000"
                  maxLength="6"
                  required
                />
                {errors.otp && <small style={{ color: 'red' }}>{errors.otp}</small>}
                {errors.resend && <small style={{ color: 'red' }}>{errors.resend}</small>}
              </label>

              <button
                type="submit"
                className="btn-primary auth-submit"
                disabled={loading || otp.length !== 6}
              >
                {loading ? t('auth.verifying') : t('auth.otp_verify_button')}
              </button>
            </form>

            <div className="auth-footer-text">
              {t('auth.otp_not_received')}{' '}
              <button
                onClick={handleResend}
                className="auth-link-button"
                disabled={resending}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', color: 'inherit', textDecoration: 'underline' }}
              >
                {resending ? t('auth.resending') : t('auth.resend_otp')}
              </button>
            </div>

            <p className="auth-footer-text" style={{ marginTop: '10px' }}>
              <Link to="/login" className="auth-link-button">{t('auth.back_to_login')}</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default VerifyOtp;
