import { useState, useEffect } from "react";

function Dashboard() {
  const [notes,setNotes]=useState([]);
  const [todos,setTodos]=useState([]);
  const [noteInput,setNoteInput]=useState("");
  const [todoInput,setTodoInput]=useState("");
  const [activeTab, setActiveTab] = useState('notes');
  const [errorMsg, setErrorMsg] = useState("");

  const accessToken = localStorage.getItem("accessToken");

  const fetchWithAuth = async (url, options={}) => {
    options.headers = {
      ...(options.headers || {}),
      Authorization: accessToken,
      "Content-Type":"application/json"
    };
    return fetch(url, options);
  };

  useEffect(()=>{
    if (accessToken) {
      loadNotes();
      loadTodos();
    }
  },[accessToken]);

  const loadNotes = async ()=>{
    try {
      const res = await fetchWithAuth("/api/notes");
      if (!res.ok) throw new Error("Failed to load notes");
      setNotes(await res.json());
      setErrorMsg("");
    } catch (error) {
      console.error(error);
    }
  };

  const addNote = async ()=>{
    if (!accessToken) {
      setErrorMsg("❌ You must be logged in to save notes. Please log in to continue.");
      return;
    }
    if (!noteInput.trim()) return;
    try {
      const res = await fetchWithAuth("/api/notes",{
        method:"POST",
        body:JSON.stringify({text:noteInput})
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

  const deleteNote = async(id)=>{
    if(window.confirm('Are you sure you want to delete this note?')) {
      try {
        const res = await fetchWithAuth(`/api/notes/${id}`,{method:"DELETE"});
        if (!res.ok) throw new Error("Failed to delete note");
        loadNotes();
      } catch (error) {
        setErrorMsg("❌ Error deleting note. Please try again.");
        console.error(error);
      }
    }
  };

  const loadTodos = async ()=>{
    try {
      const res = await fetchWithAuth("/api/todos");
      if (!res.ok) throw new Error("Failed to load todos");
      setTodos(await res.json());
      setErrorMsg("");
    } catch (error) {
      console.error(error);
    }
  };

  const addTodo = async ()=>{
    if (!accessToken) {
      setErrorMsg("❌ You must be logged in to save tasks. Please log in to continue.");
      return;
    }
    if (!todoInput.trim()) return;
    try {
      const res = await fetchWithAuth("/api/todos",{
        method:"POST",
        body:JSON.stringify({task:todoInput})
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

  const toggleTodo = async(id,done)=>{
    try {
      const res = await fetchWithAuth(`/api/todos/${id}`,{
        method:"PUT",
        body:JSON.stringify({done:!done})
      });
      if (!res.ok) throw new Error("Failed to update todo");
      loadTodos();
    } catch (error) {
      setErrorMsg("❌ Error updating task. Please try again.");
      console.error(error);
    }
  };

  const deleteTodo = async(id)=>{
    if(window.confirm('Are you sure you want to delete this todo?')) {
      try {
        const res = await fetchWithAuth(`/api/todos/${id}`,{method:"DELETE"});
        if (!res.ok) throw new Error("Failed to delete todo");
        loadTodos();
      } catch (error) {
        setErrorMsg("❌ Error deleting task. Please try again.");
        console.error(error);
      }
    }
  };

  return (
    <div className="container" style={styles.container}>
      {!accessToken && (
        <div style={styles.alertBanner}>
          <p style={styles.alertText}>
            ⚠️ You are not logged in. Please <a href="/login" style={styles.alertLink}>log in</a> to save your notes and tasks.
          </p>
        </div>
      )}
      
      {errorMsg && (
        <div style={styles.errorBanner}>
          <p style={styles.errorText}>{errorMsg}</p>
        </div>
      )}

      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.subtitle}>Manage your notes and tasks</p>
      </div>

      <div style={styles.tabContainer}>
        <button 
          onClick={() => setActiveTab('notes')}
          style={{...styles.tabButton, ...(activeTab === 'notes' ? styles.tabButtonActive : {})}}
        >
          📝 Notes
        </button>
        <button 
          onClick={() => setActiveTab('todos')}
          style={{...styles.tabButton, ...(activeTab === 'todos' ? styles.tabButtonActive : {})}}
        >
          ✓ To-Do List
        </button>
      </div>

      {activeTab === 'notes' && (
        <div style={styles.section}>
          <div className="card" style={styles.inputCard}>
            <textarea
              value={noteInput}
              onChange={e=>setNoteInput(e.target.value)}
              placeholder="Add a new note..."
              style={styles.textarea}
            />
            <button 
              onClick={addNote}
              className="btn-primary"
              style={styles.submitButton}
            >
              + Add Note
            </button>
          </div>

          <div style={styles.gridContainer}>
            {notes.length === 0 ? (
              <p style={styles.emptyState}>No notes yet. Create your first note!</p>
            ) : (
              notes.map(n=>(
                <div key={n.id} className="card" style={styles.itemCard}>
                  <p style={styles.itemText}>{n.text}</p>
                  <button 
                    onClick={()=>deleteNote(n.id)}
                    className="btn-danger"
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'todos' && (
        <div style={styles.section}>
          <div className="card" style={styles.inputCard}>
            <input
              type="text"
              value={todoInput}
              onChange={e=>setTodoInput(e.target.value)}
              placeholder="Add a new task..."
              style={{...styles.input, marginBottom: '0'}}
            />
            <button 
              onClick={addTodo}
              className="btn-primary"
              style={styles.submitButton}
            >
              + Add Task
            </button>
          </div>

          <div style={styles.listContainer}>
            {todos.length === 0 ? (
              <p style={styles.emptyState}>No tasks yet. Create your first task!</p>
            ) : (
              todos.map(t=>(
                <div key={t.id} className="card" style={styles.todoItem}>
                  <div style={styles.todoContent}>
                    <input
                      type="checkbox"
                      checked={t.done || false}
                      onChange={()=>toggleTodo(t.id, t.done)}
                      style={styles.checkbox}
                    />
                    <span style={{...styles.itemText, textDecoration: t.done ? 'line-through' : 'none', opacity: t.done ? 0.6 : 1}}>
                      {t.task}
                    </span>
                  </div>
                  <button 
                    onClick={()=>deleteTodo(t.id)}
                    className="btn-danger"
                    style={styles.deleteButton}
                  >
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

const styles = {
  container: {
    minHeight: 'calc(100vh - 100px)',
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0 16px',
  },
  header: {
    marginBottom: '40px',
    textAlign: 'center',
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#7f8c8d',
    fontSize: '16px',
  },
  tabContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
    borderBottom: '2px solid #ecf0f1',
    justifyContent: 'center',
  },
  tabButton: {
    padding: '12px 24px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    color: '#95a5a6',
    transition: 'all 0.3s ease',
    borderBottom: '3px solid transparent',
    marginBottom: '-2px',
  },
  tabButtonActive: {
    color: '#667eea',
    borderBottomColor: '#667eea',
  },
  section: {
    marginBottom: '40px',
  },
  inputCard: {
    marginBottom: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxWidth: '600px',
    margin: '0 auto 32px',
  },
  textarea: {
    minHeight: '100px',
    padding: '14px !important',
    border: '1px solid #e0e6ed !important',
    borderRadius: '8px !important',
    fontFamily: 'inherit',
    fontSize: '14px',
    resize: 'vertical',
  },
  input: {
    width: '100%',
    padding: '12px 14px !important',
    border: '1px solid #e0e6ed !important',
    borderRadius: '8px !important',
    fontSize: '14px',
  },
  submitButton: {
    width: '100%',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '16px',
    maxWidth: '100%',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  itemCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  todoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todoContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
  },
  itemText: {
    margin: '0',
    color: '#2c3e50',
    fontSize: '15px',
    lineHeight: '1.5',
  },
  deleteButton: {
    padding: '8px 16px',
    fontSize: '13px',
  },
  emptyState: {
    textAlign: 'center',
    color: '#95a5a6',
    padding: '40px 20px',
    fontSize: '16px',
  },
  alertBanner: {
    background: '#fff3cd',
    border: '1px solid #ffc107',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  alertText: {
    margin: '0',
    color: '#856404',
    fontSize: '14px',
    fontWeight: '500',
  },
  alertLink: {
    color: '#0c5460',
    textDecoration: 'underline',
    fontWeight: '600',
    cursor: 'pointer',
  },
  errorBanner: {
    background: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  errorText: {
    margin: '0',
    color: '#721c24',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default Dashboard;