import { useState } from "react";
import api from "../api/axios";

function Login({ onRegister, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      onLoginSuccess(response.data.user);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError(
      "Google login requires Google OAuth configuration. Email login is ready."
    );
  };

  return (
    <div className="auth-page">
      <div className="auth-image-side login-image">
        <div className="image-overlay"></div>

        <div className="image-content">
          <div className="brand-mark">✓</div>

          <h1>Stay organized.</h1>

          <p>
            Plan your day, manage your tasks and keep everything
            under control.
          </p>

          <div className="image-feature">
            <span>✓</span>
            <div>
              <strong>Simple task management</strong>
              <small>Everything in one place</small>
            </div>
          </div>

          <div className="image-feature">
            <span>✓</span>
            <div>
              <strong>Work smarter</strong>
              <small>Focus on what matters</small>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-heading">
            <span className="mini-logo">✓</span>
            <span className="brand-name">TaskFlow</span>

            <h2>Welcome back</h2>

            <p>
              Sign in to continue managing your tasks.
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
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
              <div className="password-label">
                <label>Password</label>
                <button
                  type="button"
                  className="forgot-btn"
                  onClick={() =>
                    setError("Password reset can be added later.")
                  }
                >
                  Forgot password?
                </button>
              </div>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
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
            onClick={handleGoogleLogin}
          >
            <span className="google-icon">G</span>
            Continue with Google
          </button>

          <p className="switch-text">
            Don't have an account?{" "}
            <button type="button" onClick={onRegister}>
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;