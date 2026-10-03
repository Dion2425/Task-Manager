import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUserPlus, FiArrowLeft } from "react-icons/fi";
import { login, register } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

export default function Register() {
  const navigate = useNavigate();
  const { login: authenticate } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    emri: "",
    mbiemri: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password || !formData.confirmPassword) {
      setError("Please complete all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await register(formData);
      if (response) {
        const loginResponse = await login({
          email: formData.email,
          password: formData.password,
        });

        if (loginResponse?.accessToken) {
          authenticate(loginResponse.accessToken, loginResponse.refreshToken);
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.message ?? "Unable to register. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-dark align-items-center justify-content-center position-relative overflow-hidden" style={{ background: "var(--app-bg)" }}>
      {/* Abstract Background Shapes */}
      <div className="position-absolute rounded-circle bg-primary opacity-25 blur-3xl" style={{ width: "600px", height: "600px", filter: "blur(100px)", top: "-10%", right: "-10%" }}></div>
      <div className="position-absolute rounded-circle bg-success opacity-25 blur-3xl" style={{ width: "500px", height: "500px", filter: "blur(100px)", bottom: "-10%", left: "-10%" }}></div>
      
      <div className="container z-1 py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-6">
            <Link to="/" className="btn btn-link text-muted text-decoration-none d-inline-flex align-items-center gap-2 mb-4 ps-0">
              <FiArrowLeft /> Back to Login
            </Link>
            
            <div className="card glass-panel border-secondary shadow-lg">
              <div className="card-body p-5">
                <div className="text-center mb-5">
                  <div className="d-inline-flex bg-primary bg-gradient p-3 rounded-3 shadow-sm mb-4">
                    <FiUserPlus size={32} className="text-white" />
                  </div>
                  <h1 className="h3 fw-bold text-white mb-2">Create an Account</h1>
                  <p className="text-muted">Join TaskFlow and start managing your projects today</p>
                </div>

                {error && (
                  <div className="alert alert-danger border-0 bg-danger bg-opacity-25 text-danger rounded-3 mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold text-uppercase">First Name</label>
                      <input
                        className="form-control form-control-lg bg-dark border-secondary text-white"
                        type="text"
                        name="emri"
                        placeholder="John"
                        value={formData.emri}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold text-uppercase">Last Name</label>
                      <input
                        className="form-control form-control-lg bg-dark border-secondary text-white"
                        type="text"
                        name="mbiemri"
                        placeholder="Doe"
                        value={formData.mbiemri}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-muted small fw-bold text-uppercase">Email Address</label>
                    <input
                      className="form-control form-control-lg bg-dark border-secondary text-white"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold text-uppercase">Password</label>
                      <input
                        className="form-control form-control-lg bg-dark border-secondary text-white"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold text-uppercase">Confirm Password</label>
                      <input
                        className="form-control form-control-lg bg-dark border-secondary text-white"
                        type="password"
                        name="confirmPassword"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="form-label text-muted small fw-bold text-uppercase">Phone Number (Optional)</label>
                    <input
                      className="form-control form-control-lg bg-dark border-secondary text-white"
                      type="tel"
                      name="phoneNumber"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <button className="btn btn-primary btn-lg w-100 fw-bold shadow-sm mb-3" type="submit" disabled={loading}>
                    {loading ? "Creating Account..." : "Register Now"}
                  </button>
                  
                  <p className="text-center text-muted small mb-0">
                    By registering, you agree to our <a href="#" className="text-primary text-decoration-none">Terms of Service</a> and <a href="#" className="text-primary text-decoration-none">Privacy Policy</a>.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
