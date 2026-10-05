import { useEffect, useState } from "react";
import api from "../api/axios";

function Register({
  onLogin,
  onRegisterSuccess,
  onGoogleSuccess,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // GOOGLE LOGIN SCRIPT
  // =========================

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // =========================
  // NORMAL REGISTER
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      console.log("REGISTER RESPONSE:", response.data);

      setSuccess(
        "Account created successfully. Please sign in to continue."
      );

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        onRegisterSuccess();
      }, 1000);
    } catch (error) {
      console.log("REGISTER ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GOOGLE REGISTER RESPONSE
  // =========================

  const handleGoogleResponse = async (response) => {
    try {
      setError("");
      setSuccess("");
      setLoading(true);

      const result = await api.post("/auth/google", {
        credential: response.credential,
      });

      console.log(
        "GOOGLE REGISTER RESPONSE:",
        result.data
      );

      localStorage.setItem(
        "token",
        result.data.token
      );

      // Google signup → Task Manager
      onGoogleSuccess(result.data.user);
    } catch (error) {
      console.log(
        "GOOGLE REGISTER ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Google signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GOOGLE REGISTER
  // =========================

  const handleGoogleRegister = () => {
    setError("");

    if (!window.google) {
      setError(
        "Google login is still loading. Please try again."
      );
      return;
    }

    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      setError(
        "Google Client ID is missing."
      );
      return;
    }

    window.google.accounts.id.prompt();
  };

  return (
    <div className="auth-page">

      {/* =========================
          LEFT IMAGE SIDE
      ========================= */}

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

      {/* =========================
          RIGHT FORM SIDE
      ========================= */}

      <div className="auth-form-side">
        <div className="auth-card register-card">

          {/* HEADING */}

          <div className="auth-heading">
            <span className="mini-logo">
              ✓
            </span>

            <span className="brand-name">
              TaskFlow
            </span>

            <h2>
              Create your account
            </h2>

            <p>
              Join TaskFlow and start organizing your day.
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          {/* =========================
              NORMAL REGISTER
          ========================= */}

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label>
                Full name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />
            </div>

            <div className="input-group">
              <label>
                Email address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <div className="input-group">
              <label>
                Password
              </label>

              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            <div className="input-group">
              <label>
                Confirm password
              </label>

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
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>

          </form>

          {/* DIVIDER */}

          <div className="divider">
            <span></span>
            <p>OR</p>
            <span></span>
          </div>

          {/* GOOGLE SIGNUP */}

          <button
            type="button"
            className="google-btn"
            onClick={handleGoogleRegister}
            disabled={loading}
          >
            <span className="google-icon">
              G
            </span>

            Continue with Google
          </button>

          {/* LOGIN */}

          <p className="switch-text">
            Already have an account?{" "}

            <button
              type="button"
              onClick={onLogin}
            >
              Sign in
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;