import { useState } from "react";
import api from "../api/axios";

function Register({ onLogin, onRegisterSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      onRegisterSuccess();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    setError(
      "Google signup requires Google OAuth configuration. Email signup is ready."
    );
  };

  return (
    <div className="auth-page">
      <div className="auth-image-side register-image">
        <div className="image-overlay"></div>

        <div className="image-content">
          <div className="brand-mark">✓</div>

          <h1>Get things done.</h1>

          <p>
            Create your account and start organizing your
            everyday work with TaskFlow.
          </p>

          <div className="image-feature">
            <span>✓</span>
            <div>
              <strong>Create your own tasks</strong>
              <small>Plan your day easily</small>
            </div>
          </div>

          <div className="image-feature">
            <span>✓</span>
            <div>
              <strong>Track your progress</strong>
              <small>Complete tasks with confidence</small>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card register-card">
          <div className="auth-heading">
            <span className="mini-logo">✓</span>
            <span className="brand-name">TaskFlow</span>

            <h2>Create your account</h2>

            <p>
              Join TaskFlow and start organizing your day.
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Full name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Email address</label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Confirm password</label>

              <input
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />
            </div>

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="divider">
            <span></span>
            <p>OR</p>
            <span></span>
          </div>

          <button
            type="button"
            className="google-btn"
            onClick={handleGoogleRegister}
          >
            <span className="google-icon">G</span>
            Continue with Google
          </button>

          <p className="switch-text">
            Already have an account?{" "}
            <button type="button" onClick={onLogin}>
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;