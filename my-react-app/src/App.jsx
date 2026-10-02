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

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setPage("task-manager");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setPage("login");
  };

  if (user && page === "task-manager") {
    return <TaskManager user={user} onLogout={handleLogout} />;
  }

  if (page === "register") {
    return (
      <Register
        onLogin={() => setPage("login")}
        onRegisterSuccess={() => setPage("login")}
      />
    );
  }

  return (
    <Login
      onRegister={() => setPage("register")}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}

export default App;


