import { useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("login");

  const handleLogin = (e) => {
    e.preventDefault();
    alert("Login successful!");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    alert("Account created successfully!");
  };

  const handleGoogle = () => {
    alert("Continue with Google clicked!");
  };

  const handleFacebook = () => {
    alert("Continue with Facebook clicked!");
  };

  /* REGISTER PAGE */
  if (page === "register") {
    return (
      <div className="auth-page">

        <div className="image-side">
          <img
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85"
            alt="Workspace"
          />

          <div className="image-dark"></div>

          <div className="image-content">
            <span>CREATE YOUR ACCOUNT</span>
            <h1>Build something<br />amazing.</h1>
            <p>
              Join us and discover a simple, beautiful experience
              designed just for you.
            </p>
          </div>
        </div>

        <div className="form-side">
          <div className="auth-card">

            <h2>Create account</h2>
            <p className="subtitle">
              Sign up to get started with us.
            </p>

            <form onSubmit={handleRegister}>

              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Create a password"
                  required
                />
              </div>

              <button className="main-btn" type="submit">
                Create Account
              </button>

            </form>

            <div className="divider">
              <span>OR</span>
            </div>

            <button
              className="social-btn"
              onClick={handleGoogle}
              type="button"
            >
              <span className="google">G</span>
              Continue with Google
            </button>

            <button
              className="social-btn"
              onClick={handleFacebook}
              type="button"
            >
              <span className="facebook">f</span>
              Continue with Facebook
            </button>

            <p className="bottom-text">
              Already have an account?

              <button
                className="link-btn"
                onClick={() => setPage("login")}
              >
                Login
              </button>
            </p>

          </div>
        </div>

      </div>
    );
  }

  /* LOGIN PAGE */
  return (
    <div className="auth-page">

      <div className="image-side">

        <img
          src="https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1400&q=85"
          alt="Modern workspace"
        />

        <div className="image-dark"></div>

        <div className="image-content">
          <span>WELCOME BACK</span>

          <h1>
            Your journey<br />
            starts here.
          </h1>

          <p>
            Sign in and continue your journey with a
            simple and beautiful experience.
          </p>
        </div>

      </div>

      <div className="form-side">

        <div className="auth-card">

          <h2>Welcome back!</h2>

          <p className="subtitle">
            Enter your details to continue.
          </p>

          <form onSubmit={handleLogin}>

            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="options">

              <label>
                <input type="checkbox" />
                Remember me
              </label>

              <button
                type="button"
                className="forgot-btn"
                onClick={() => alert("Password reset clicked!")}
              >
                Forgot password?
              </button>

            </div>

            <button
              className="main-btn"
              type="submit"
            >
              Login
            </button>

          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <button
            className="social-btn"
            onClick={handleGoogle}
            type="button"
          >
            <span className="google">G</span>
            Continue with Google
          </button>

          <button
            className="social-btn"
            onClick={handleFacebook}
            type="button"
          >
            <span className="facebook">f</span>
            Continue with Facebook
          </button>

          <p className="bottom-text">
            Don't have an account?

            <button
              className="link-btn"
              onClick={() => setPage("register")}
            >
              Register
            </button>
          </p>

        </div>

      </div>

    </div>
  );
}

export default App;


