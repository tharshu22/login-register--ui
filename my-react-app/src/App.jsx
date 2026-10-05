import { useState } from "react";
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import TaskManager from "./pages/TaskManager";

function App() {
  const [page, setPage] = useState("login");

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  // =========================
  // LOGIN / GOOGLE LOGIN
  // =========================

  const handleLoginSuccess = (userData) => {
    setUser(userData);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setPage("task-manager");
  };

  // =========================
  // NORMAL REGISTER SUCCESS
  // =========================
  // Normal registration mudinjathum
  // Login page-ku pogum.
  // User manually login pannuvanga.

  const handleRegisterSuccess = () => {
    setPage("login");
  };

  // =========================
  // GOOGLE REGISTER SUCCESS
  // =========================
  // Google signup successful na
  // direct-a Task Manager-ku pogum.

  const handleGoogleRegisterSuccess = (userData) => {
    setUser(userData);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setPage("task-manager");
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
    setPage("login");
  };

  // =========================
  // TASK MANAGER
  // =========================

  if (user && page === "task-manager") {
    return (
      <TaskManager
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  // =========================
  // REGISTER PAGE
  // =========================

  if (page === "register") {
    return (
      <Register
        onLogin={() => setPage("login")}
        onRegisterSuccess={handleRegisterSuccess}
        onGoogleSuccess={handleGoogleRegisterSuccess}
      />
    );
  }

  // =========================
  // LOGIN PAGE
  // =========================

  return (
    <Login
      onRegister={() => setPage("register")}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}

export default App;


