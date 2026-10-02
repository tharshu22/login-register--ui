import { useEffect, useState } from "react";
import api from "../api/axios";
import "./TaskManager.css";

function TaskManager({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.log("Failed to load tasks:", error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/tasks", {
        title: title.trim(),
        description: description.trim(),
      });

      setTasks((prev) => [response.data.task, ...prev]);

      setTitle("");
      setDescription("");
    } catch (error) {
      console.log("Failed to add task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      const response = await api.put(`/tasks/${id}`);

      setTasks((prev) =>
        prev.map((task) =>
          task._id === id ? response.data.task : task
        )
      );
    } catch (error) {
      console.log("Failed to update task:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);

      setTasks((prev) =>
        prev.filter((task) => task._id !== id)
      );
    } catch (error) {
      console.log("Failed to delete task:", error);
    }
  };

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  return (
    <div className="task-page">
      <header className="task-navbar">
        <div className="task-brand">
          <div className="task-logo">✓</div>
          <span>TaskFlow</span>
        </div>

        <div className="task-user-area">
          <div className="user-info">
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </div>

          <button
            type="button"
            className="logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="task-container">
        <section className="welcome-section">
          <div>
            <p className="welcome-small">Dashboard</p>

            <h1>
              Welcome back,{" "}
              <span>{user.name.split(" ")[0]}</span>!
            </h1>

            <p>
              Organize your day and stay focused on what matters.
            </p>
          </div>

          <div className="task-summary">
            <div>
              <strong>{tasks.length}</strong>
              <span>Total tasks</span>
            </div>

            <div>
              <strong>{completedCount}</strong>
              <span>Completed</span>
            </div>
          </div>
        </section>

        <section className="add-task-card">
          <div className="section-heading">
            <div>
              <h2>Create a new task</h2>
              <p>Add something you want to accomplish.</p>
            </div>
          </div>

          <form onSubmit={handleAddTask}>
            <div className="task-input-row">
              <div className="task-input">
                <label>Task title</label>

                <input
                  type="text"
                  placeholder="e.g. Complete React assignment"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="task-input">
                <label>Description</label>

                <input
                  type="text"
                  placeholder="Add a short description"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                />
              </div>

              <button
                type="submit"
                className="add-task-btn"
                disabled={loading}
              >
                {loading ? "Adding..." : "+ Add Task"}
              </button>
            </div>
          </form>
        </section>

        <section className="tasks-section">
          <div className="tasks-heading">
            <div>
              <h2>Your tasks</h2>
              <p>Keep track of everything you need to do.</p>
            </div>

            <span className="task-count">
              {tasks.length} tasks
            </span>
          </div>

          {pageLoading ? (
            <div className="empty-task-box">
              <div className="loader"></div>
              <p>Loading your tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-task-box">
              <div className="empty-icon">✓</div>
              <h3>No tasks yet</h3>
              <p>
                Add your first task above and start organizing
                your day.
              </p>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <div
                  className={`task-card ${
                    task.completed ? "completed" : ""
                  }`}
                  key={task._id}
                >
                  <div className="task-status">
                    <button
                      type="button"
                      onClick={() =>
                        handleComplete(task._id)
                      }
                      className={
                        task.completed
                          ? "status-circle done"
                          : "status-circle"
                      }
                    >
                      {task.completed ? "✓" : ""}
                    </button>
                  </div>

                  <div className="task-details">
                    <h3>{task.title}</h3>

                    {task.description && (
                      <p>{task.description}</p>
                    )}

                    <span>
                      {task.completed
                        ? "Completed"
                        : "In progress"}
                    </span>
                  </div>

                  <div className="task-actions">
                    <button
                      type="button"
                      className="complete-action"
                      onClick={() =>
                        handleComplete(task._id)
                      }
                    >
                      {task.completed ? "Undo" : "Complete"}
                    </button>

                    <button
                      type="button"
                      className="delete-action"
                      onClick={() =>
                        handleDelete(task._id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default TaskManager;