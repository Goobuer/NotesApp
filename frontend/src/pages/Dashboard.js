import { useState, useEffect, useCallback } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [todos, setTodos] = useState([]);
  const [noteInput, setNoteInput] = useState("");
  const [todoInput, setTodoInput] = useState("");
  const [activeTab, setActiveTab] = useState("notes");
  const [errorMsg, setErrorMsg] = useState("");

  const accessToken = localStorage.getItem("accessToken");

  const fetchWithAuth = async (url, options = {}) => {
    options.headers = {
      ...(options.headers || {}),
      Authorization: accessToken,
      "Content-Type": "application/json",
    };
    return fetch(url, options);
  };

  const loadNotes = useCallback(async () => {
    try {
      const res = await fetchWithAuth("http://localhost:5000/api/notes");
      if (!res.ok) throw new Error("Failed to load notes");
      setNotes(await res.json());
      setErrorMsg("");
    } catch (error) {
      console.error(error);
    }
  }, [accessToken]);

  const addNote = async () => {
    if (!accessToken) {
      setErrorMsg("❌ You must be logged in to save notes. Please log in to continue.");
      return;
    }
    if (!noteInput.trim()) return;
    try {
      const res = await fetchWithAuth("http://localhost:5000/api/notes", {
        method: "POST",
        body: JSON.stringify({ text: noteInput }),
      });
      if (!res.ok) throw new Error("Failed to add note");
      setNoteInput("");
      loadNotes();
      setErrorMsg("");
    } catch (error) {
      setErrorMsg("❌ Error saving note. Please try again.");
      console.error(error);
    }
  };

  const deleteNote = async (id) => {
    try {
      const res = await fetchWithAuth(`http://localhost:5000/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete note");
      loadNotes();
    } catch (error) {
      setErrorMsg("❌ Error deleting note. Please try again.");
      console.error(error);
    }
  };

  const loadTodos = useCallback(async () => {
    try {
      const res = await fetchWithAuth("http://localhost:5000/api/todos");
      if (!res.ok) throw new Error("Failed to load todos");
      setTodos(await res.json());
      setErrorMsg("");
    } catch (error) {
      console.error(error);
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      loadNotes();
      loadTodos();
    }
  }, [accessToken, loadNotes, loadTodos]);

  const addTodo = async () => {
    if (!accessToken) {
      setErrorMsg("❌ You must be logged in to save tasks. Please log in to continue.");
      return;
    }
    if (!todoInput.trim()) return;
    try {
      const res = await fetchWithAuth("http://localhost:5000/api/todos", {
        method: "POST",
        body: JSON.stringify({ task: todoInput }),
      });
      if (!res.ok) throw new Error("Failed to add todo");
      setTodoInput("");
      loadTodos();
      setErrorMsg("");
    } catch (error) {
      setErrorMsg("❌ Error saving task. Please try again.");
      console.error(error);
    }
  };

  const toggleTodo = async (id, done) => {
    try {
      const res = await fetchWithAuth(`http://localhost:5000/api/todos/${id}`, {
        method: "PUT",
        body: JSON.stringify({ done: !done }),
      });
      if (!res.ok) throw new Error("Failed to update todo");
      loadTodos();
    } catch (error) {
      setErrorMsg("❌ Error updating task. Please try again.");
      console.error(error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const res = await fetchWithAuth(`http://localhost:5000/api/todos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete todo");
      loadTodos();
    } catch (error) {
      setErrorMsg("❌ Error deleting task. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="container dashboard-container">
      {!accessToken && (
        <div className="alert-banner">
          <p className="alert-text">
            ⚠️ You are not logged in. Please <a className="alert-link" href="/login">log in</a> to save your notes and tasks.
          </p>
        </div>
      )}
    

      {errorMsg && (
        <div className="error-banner">
          <p className="error-text">{errorMsg}</p>
        </div>
      )}

      <div className="header">
        <h1 className="title">Dashboard</h1>
        <p className="subtitle">Manage your notes and tasks</p>
      </div>

      <div className="tab-container">
        <button
          className={`tab-button${activeTab === "notes" ? " active" : ""}`}
          onClick={() => setActiveTab("notes")}
          type="button"
        >
          📝 Notes
        </button>
        <button
          className={`tab-button${activeTab === "todos" ? " active" : ""}`}
          onClick={() => setActiveTab("todos")}
          type="button"
        >
          ✓ To-Do List
        </button>
      </div>

      {activeTab === "notes" && (
        <div className="section">
          <div className="card input-card">
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Add a new note..."
              className="textarea"
            />
            <button onClick={addNote} className="btn-primary submit-button" type="button">
              + Add Note
            </button>
          </div>

          <div className="grid-container">
            {notes.length === 0 ? (
              <p className="empty-state">No notes yet. Create your first note!</p>
            ) : (
              notes.map((n) => (
                <div key={n.id} className="card item-card">
                  <p className="item-text">{n.text}</p>
                  <button onClick={() => deleteNote(n.id)} className="btn-danger delete-button" type="button">
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "todos" && (
        <div className="section">
          <div className="card input-card">
            <input
              type="text"
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              placeholder="Add a new task..."
              className="input-field"
            />
            <button onClick={addTodo} className="btn-primary submit-button" type="button">
              + Add Task
            </button>
          </div>

          <div className="list-container">
            {todos.length === 0 ? (
              <p className="empty-state">No tasks yet. Create your first task!</p>
            ) : (
              todos.map((t) => (
                <div key={t.id} className="card todo-item">
                  <div className="todo-content">
                    <input
                      type="checkbox"
                      checked={t.done || false}
                      onChange={() => toggleTodo(t.id, t.done)}
                      className="checkbox"
                    />
                    <span className={`item-text${t.done ? " checked" : ""}`}>
                      {t.task}
                    </span>
                  </div>
                  <button onClick={() => deleteTodo(t.id)} className="btn-danger delete-button" type="button">
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
