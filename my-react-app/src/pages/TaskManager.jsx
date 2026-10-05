import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import "./TaskManager.css";

function TaskManager({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] =
    useState("dashboard");

  const [birthdayName, setBirthdayName] = useState("");
  const [birthdayDate, setBirthdayDate] = useState("");

  const [note, setNote] = useState("");

  const [birthdays, setBirthdays] = useState(() => {
    const saved = localStorage.getItem(
      "taskflow_birthdays"
    );

    return saved ? JSON.parse(saved) : [];
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem(
      "taskflow_notes"
    );

    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const firstName =
    user?.name?.split(" ")[0] || "there";

  /* =========================
     GET TASKS
  ========================= */

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");

      setTasks(response.data);
    } catch (error) {
      console.log(
        "Failed to load tasks:",
        error
      );
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  /* =========================
     LOCAL STORAGE
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      "taskflow_birthdays",
      JSON.stringify(birthdays)
    );
  }, [birthdays]);

  useEffect(() => {
    localStorage.setItem(
      "taskflow_notes",
      JSON.stringify(notes)
    );
  }, [notes]);

  /* =========================
     ADD TASK
  ========================= */

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/tasks",
        {
          title: title.trim(),
          description: description.trim(),
          dueDate: dueDate || null,
        }
      );

      setTasks((prev) => [
        response.data.task,
        ...prev,
      ]);

      setTitle("");
      setDescription("");
      setDueDate("");
    } catch (error) {
      console.log(
        "Failed to add task:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     COMPLETE / UNDO
  ========================= */

  const handleComplete = async (id) => {
    try {
      const response = await api.put(
        `/tasks/${id}`
      );

      setTasks((prev) =>
        prev.map((task) =>
          task._id === id
            ? response.data.task
            : task
        )
      );
    } catch (error) {
      console.log(
        "Failed to update task:",
        error
      );
    }
  };

  /* =========================
     DELETE TASK
  ========================= */

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);

      setTasks((prev) =>
        prev.filter(
          (task) => task._id !== id
        )
      );
    } catch (error) {
      console.log(
        "Failed to delete task:",
        error
      );
    }
  };

  /* =========================
     BIRTHDAY
  ========================= */

  const handleAddBirthday = (e) => {
    e.preventDefault();

    if (
      !birthdayName.trim() ||
      !birthdayDate
    ) {
      return;
    }

    const birthday = {
      id: Date.now(),
      name: birthdayName.trim(),
      date: birthdayDate,
    };

    setBirthdays((prev) => [
      ...prev,
      birthday,
    ]);

    setBirthdayName("");
    setBirthdayDate("");
  };

  const handleDeleteBirthday = (id) => {
    setBirthdays((prev) =>
      prev.filter(
        (birthday) =>
          birthday.id !== id
      )
    );
  };

  /* =========================
     NOTES
  ========================= */

  const handleAddNote = () => {
    if (!note.trim()) {
      return;
    }

    const newNote = {
      id: Date.now(),
      text: note.trim(),
      date: new Date().toLocaleDateString(),
    };

    setNotes((prev) => [
      newNote,
      ...prev,
    ]);

    setNote("");
  };

  const handleDeleteNote = (id) => {
    setNotes((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );
  };

  /* =========================
     STATS
  ========================= */

  const completedCount =
    tasks.filter(
      (task) => task.completed
    ).length;

  const pendingCount =
    tasks.filter(
      (task) => !task.completed
    ).length;

  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedCount /
            tasks.length) *
            100
        );

  /* =========================
     SEARCH
  ========================= */

  const filteredTasks = useMemo(() => {
    if (!search.trim()) {
      return tasks;
    }

    const value =
      search.toLowerCase();

    return tasks.filter(
      (task) =>
        task.title
          ?.toLowerCase()
          .includes(value) ||
        task.description
          ?.toLowerCase()
          .includes(value)
    );
  }, [tasks, search]);

  /* =========================
     DATE
  ========================= */

  const today = new Date();

  const formattedDate =
    today.toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

  /* =========================
     NAVIGATION
  ========================= */

  const handleNavigation = (
    section
  ) => {
    setActiveSection(section);

    setTimeout(() => {
      document
        .getElementById(section)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  return (
    <div className="task-layout">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="task-sidebar">

        <div className="sidebar-brand">
          <div className="task-logo">
            ✓
          </div>

          <div>
            <strong>
              TaskFlow
            </strong>

            <span>
              Stay productive
            </span>
          </div>
        </div>

        <div className="sidebar-menu">

          <p className="nav-title">
            WORKSPACE
          </p>

          <button
            className={
              activeSection ===
              "dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              handleNavigation(
                "dashboard"
              )
            }
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className={
              activeSection === "tasks"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              handleNavigation(
                "tasks"
              )
            }
          >
            <span>✓</span>

            My Tasks

            <b>{tasks.length}</b>
          </button>

          <button
            className={
              activeSection ===
              "birthdays"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              handleNavigation(
                "birthdays"
              )
            }
          >
            <span>🎂</span>

            Birthdays

            <b>
              {birthdays.length}
            </b>
          </button>

          <button
            className={
              activeSection === "notes"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              handleNavigation(
                "notes"
              )
            }
          >
            <span>📝</span>

            Notes

            <b>{notes.length}</b>
          </button>

        </div>

        <div className="sidebar-bottom">

          <div className="sidebar-tip">
            <span>✦</span>

            <strong>
              Stay focused
            </strong>

            <p>
              One small task at a time.
            </p>
          </div>

          <button
            className="sidebar-logout"
            onClick={onLogout}
          >
            ⇥
            <span>Logout</span>
          </button>

        </div>
      </aside>


      {/* =========================
          MAIN
      ========================= */}

      <div className="task-main">

        {/* TOP BAR */}

        <header className="task-topbar">

          <div className="mobile-brand">

            <div className="task-logo">
              ✓
            </div>

            <strong>
              TaskFlow
            </strong>

          </div>

          <div className="topbar-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search your tasks..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

          <div className="topbar-user">

            <div className="notification">
              ♧
              <i></i>
            </div>

            <div className="top-avatar">
              {firstName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {user?.name}
              </strong>

              <small>
                {user?.email}
              </small>
            </div>

          </div>

        </header>


        {/* CONTENT */}

        <main className="dashboard-content">

          {/* =========================
              HERO
          ========================= */}

          <section
            id="dashboard"
            className="hero-section"
          >

            <div className="hero-content">

              <span className="date-label">
                {formattedDate}
              </span>

              <h1>
                Good morning,{" "}
                <span>
                  {firstName}
                </span>{" "}
                👋
              </h1>

              <p>
                Organize your tasks,
                stay focused and make
                your day productive.
              </p>

              <button
                className="hero-button"
                onClick={() =>
                  handleNavigation(
                    "add-task"
                  )
                }
              >
                + Create New Task
              </button>

            </div>

            <div className="hero-image">

              <img
                src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=85"
                alt="Productivity workspace"
              />

              <div className="hero-image-card">
                <span>✓</span>

                <div>
                  <strong>
                    Today's focus
                  </strong>

                  <small>
                    Keep moving forward
                  </small>
                </div>
              </div>

            </div>

          </section>


          {/* =========================
              STATS
          ========================= */}

          <div className="stats-grid">

            <div className="stat-card">
              <div className="stat-icon blue">
                ✓
              </div>

              <div>
                <strong>
                  {tasks.length}
                </strong>

                <span>
                  Total Tasks
                </span>
              </div>
            </div>


            <div className="stat-card">
              <div className="stat-icon green">
                ✓
              </div>

              <div>
                <strong>
                  {completedCount}
                </strong>

                <span>
                  Completed
                </span>
              </div>
            </div>


            <div className="stat-card">
              <div className="stat-icon orange">
                ◷
              </div>

              <div>
                <strong>
                  {pendingCount}
                </strong>

                <span>
                  Pending
                </span>
              </div>
            </div>


            <div className="stat-card">
              <div className="stat-icon pink">
                🎂
              </div>

              <div>
                <strong>
                  {birthdays.length}
                </strong>

                <span>
                  Birthdays
                </span>
              </div>
            </div>

          </div>


          {/* =========================
              ADD TASK
          ========================= */}

          <section
            id="add-task"
            className="content-card add-task-section"
          >

            <div className="card-heading">

              <div>

                <span>
                  GET THINGS DONE
                </span>

                <h2>
                  Create a new task
                </h2>

                <p>
                  Add something you want
                  to accomplish.
                </p>

              </div>

              <div className="heading-icon">
                +
              </div>

            </div>


            <form
              onSubmit={handleAddTask}
              className="task-form"
            >

              <div className="form-field">

                <label>
                  Task title
                </label>

                <input
                  type="text"
                  placeholder="What do you need to do?"
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                />

              </div>


              <div className="form-field">

                <label>
                  Description
                </label>

                <input
                  type="text"
                  placeholder="Add some details..."
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                />

              </div>


              <div className="form-field">

                <label>
                  Due date
                </label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) =>
                    setDueDate(
                      e.target.value
                    )
                  }
                />

              </div>


              <button
                type="submit"
                className="add-task-button"
                disabled={loading}
              >
                {loading
                  ? "Adding..."
                  : "+ Add Task"}
              </button>

            </form>

          </section>


          {/* =========================
              TASKS
              NO FIXED HEIGHT
          ========================= */}

          <section
            id="tasks"
            className="content-card tasks-section"
          >

            <div className="card-heading">

              <div>

                <span>
                  YOUR WORK
                </span>

                <h2>
                  My Tasks
                </h2>

                <p>
                  Your tasks will appear
                  here as you add them.
                </p>

              </div>

              <div className="task-number">
                {filteredTasks.length}
              </div>

            </div>


            {pageLoading ? (

              <div className="empty-box">

                <div className="loader"></div>

                <p>
                  Loading your tasks...
                </p>

              </div>

            ) : filteredTasks.length === 0 ? (

              <div className="empty-box">

                <div className="empty-symbol">
                  ✓
                </div>

                <h3>
                  No tasks yet
                </h3>

                <p>
                  Add your first task above.
                </p>

              </div>

            ) : (

              <div className="task-list">

                {filteredTasks.map(
                  (task) => (

                    <div
                      key={task._id}
                      className={
                        task.completed
                          ? "task-item completed"
                          : "task-item"
                      }
                    >

                      <button
                        className={
                          task.completed
                            ? "task-check checked"
                            : "task-check"
                        }
                        onClick={() =>
                          handleComplete(
                            task._id
                          )
                        }
                      >
                        {task.completed
                          ? "✓"
                          : ""}
                      </button>


                      <div className="task-info">

                        <h3>
                          {task.title}
                        </h3>

                        {task.description && (
                          <p>
                            {
                              task.description
                            }
                          </p>
                        )}

                        <div className="task-meta">

                          <span>
                            {task.completed
                              ? "✓ Completed"
                              : "● In progress"}
                          </span>

                          {task.dueDate && (
                            <small>
                              📅{" "}
                              {new Date(
                                task.dueDate
                              ).toLocaleDateString(
                                "en-IN"
                              )}
                            </small>
                          )}

                        </div>

                      </div>


                      <div className="task-buttons">

                        <button
                          className="complete-btn"
                          onClick={() =>
                            handleComplete(
                              task._id
                            )
                          }
                        >
                          {task.completed
                            ? "Undo"
                            : "Complete"}
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(
                              task._id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </section>


          {/* =========================
              PROGRESS
          ========================= */}

          <section className="content-card progress-section">

            <div className="progress-left">

              <span>
                DAILY PROGRESS
              </span>

              <h2>
                Keep going!
              </h2>

              <p>
                You have completed{" "}
                <strong>
                  {completedCount}
                </strong>{" "}
                of{" "}
                <strong>
                  {tasks.length}
                </strong>{" "}
                tasks.
              </p>

              <div className="progress-track">

                <div
                  style={{
                    width: `${progress}%`,
                  }}
                ></div>

              </div>

            </div>

            <div className="progress-percent">
              {progress}%
            </div>

          </section>


          {/* =========================
              BIRTHDAYS
          ========================= */}

          <section
            id="birthdays"
            className="content-card birthday-section"
          >

            <div className="birthday-header">

              <div>

                <span>
                  NEVER FORGET
                </span>

                <h2>
                  🎂 Birthday Reminders
                </h2>

                <p>
                  Keep track of special
                  people and special days.
                </p>

              </div>

            </div>


            <div className="birthday-layout">

              <div className="birthday-image">

                <img
                  src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=85"
                  alt="Birthday celebration"
                />

              </div>


              <div>

                <form
                  className="birthday-form"
                  onSubmit={
                    handleAddBirthday
                  }
                >

                  <input
                    type="text"
                    placeholder="Person's name"
                    value={
                      birthdayName
                    }
                    onChange={(e) =>
                      setBirthdayName(
                        e.target.value
                      )
                    }
                  />

                  <input
                    type="date"
                    value={
                      birthdayDate
                    }
                    onChange={(e) =>
                      setBirthdayDate(
                        e.target.value
                      )
                    }
                  />

                  <button type="submit">
                    + Add Birthday
                  </button>

                </form>


                <div className="birthday-list">

                  {birthdays.length ===
                  0 ? (

                    <div className="empty-birthday">
                      🎈
                      <p>
                        No birthdays added
                        yet.
                      </p>
                    </div>

                  ) : (

                    birthdays.map(
                      (birthday) => (

                        <div
                          className="birthday-item"
                          key={
                            birthday.id
                          }
                        >

                          <div className="birthday-icon">
                            🎂
                          </div>

                          <div>

                            <strong>
                              {
                                birthday.name
                              }
                            </strong>

                            <small>
                              {new Date(
                                birthday.date
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "long",
                                }
                              )}
                            </small>

                          </div>

                          <button
                            onClick={() =>
                              handleDeleteBirthday(
                                birthday.id
                              )
                            }
                          >
                            ×
                          </button>

                        </div>

                      )
                    )

                  )}

                </div>

              </div>

            </div>

          </section>


          {/* =========================
              NOTES
          ========================= */}

          <section
            id="notes"
            className="content-card notes-section"
          >

            <div className="card-heading">

              <div>

                <span>
                  QUICK REMINDERS
                </span>

                <h2>
                  📝 My Notes
                </h2>

                <p>
                  Save anything you don't
                  want to forget.
                </p>

              </div>

            </div>


            <div className="note-editor">

              <textarea
                placeholder="Write a note, idea, reminder..."
                value={note}
                onChange={(e) =>
                  setNote(
                    e.target.value
                  )
                }
              />

              <button
                onClick={
                  handleAddNote
                }
              >
                + Save Note
              </button>

            </div>


            <div className="notes-list">

              {notes.length === 0 ? (

                <div className="empty-note">
                  📝
                  <p>
                    Your saved notes will
                    appear here.
                  </p>
                </div>

              ) : (

                notes.map((item) => (

                  <div
                    className="note-item"
                    key={item.id}
                  >

                    <div>

                      <p>
                        {item.text}
                      </p>

                      <small>
                        {item.date}
                      </small>

                    </div>

                    <button
                      onClick={() =>
                        handleDeleteNote(
                          item.id
                        )
                      }
                    >
                      ×
                    </button>

                  </div>

                ))

              )}

            </div>

          </section>


          {/* =========================
              FINAL IMAGE
          ========================= */}

          <section className="motivation-banner">

            <img
              src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=85"
              alt="Daily motivation"
            />

            <div className="motivation-overlay"></div>

            <div className="motivation-content">

              <span>
                ✦ DAILY MOTIVATION
              </span>

              <h2>
                Small steps every day
                create big results.
              </h2>

              <p>
                Focus on progress,
                not perfection.
              </p>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}

export default TaskManager;