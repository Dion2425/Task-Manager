import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiActivity } from "react-icons/fi";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

export default function Login() {
  const navigate = useNavigate();
  const { login: authenticate } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await login(formData);

      if (response?.accessToken) {
        authenticate(response.accessToken, response.refreshToken);
        navigate("/dashboard");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.message ?? "Unable to login. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-dark align-items-center justify-content-center position-relative overflow-hidden" style={{ background: "var(--app-bg)" }}>
      {/* Abstract Background Shapes */}
      <div className="position-absolute rounded-circle bg-primary opacity-25 blur-3xl" style={{ width: "600px", height: "600px", filter: "blur(100px)", top: "-10%", left: "-10%" }}></div>
      <div className="position-absolute rounded-circle bg-success opacity-25 blur-3xl" style={{ width: "500px", height: "500px", filter: "blur(100px)", bottom: "-10%", right: "-10%" }}></div>
      
      <div className="container z-1">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card glass-panel border-secondary shadow-lg">
              <div className="card-body p-5">
                <div className="text-center mb-5">
                  <div className="d-inline-flex bg-primary bg-gradient p-3 rounded-3 shadow-sm mb-4">
                    <FiActivity size={32} className="text-white" />
                  </div>
                  <h1 className="h3 fw-bold text-white mb-2">Welcome Back</h1>
                  <p className="text-muted">Sign in to continue to TaskFlow</p>
                </div>

                {error && (
                  <div className="alert alert-danger border-0 bg-danger bg-opacity-25 text-danger rounded-3 mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label text-muted small fw-bold text-uppercase">Email Address</label>
                    <input
                      className="form-control form-control-lg bg-dark border-secondary text-white"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-5">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="form-label text-muted small fw-bold text-uppercase mb-0">Password</label>
                      <a href="#" className="text-primary text-decoration-none small">Forgot Password?</a>
                    </div>
                    <div className="input-group">
                      <input
                        className="form-control form-control-lg bg-dark border-secondary text-white border-end-0"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary border-start-0 bg-dark text-muted"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-3">
                    <button className="btn btn-primary btn-lg w-100 fw-bold shadow-sm" type="submit" disabled={loading}>
                      {loading ? "Logging in..." : "Sign In"}
                    </button>
                    <Link to="/register" className="btn btn-outline-secondary btn-lg w-100 fw-bold">
                      Create an Account
                    </Link>
                  </div>
                </form>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="text-muted small">&copy; 2026 TaskFlow Inc. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
