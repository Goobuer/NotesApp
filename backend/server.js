const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;
const JWT_SECRET = "your-secret-key-change-in-production";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock data - 2 sample users
const users = [
  { id: 1, email: "user1@example.com", password: "password123" },
  { id: 2, email: "user2@example.com", password: "password456" },
];

// Mock notes storage (in-memory)
const notes = {};
const todos = {};

// Initialize storage for users
users.forEach((user) => {
  notes[user.id] = [];
  todos[user.id] = [];
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Login endpoint
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ accessToken, refreshToken });
});

// Register endpoint
app.post("/api/register", (req, res) => {
  const { email, password } = req.body;

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ error: "User already exists" });
  }

  const newUser = {
    id: users.length + 1,
    email,
    password,
  };

  users.push(newUser);
  notes[newUser.id] = [];
  todos[newUser.id] = [];

  res.status(201).json({ message: "User registered successfully" });
});

// Get all notes for logged-in user
app.get("/api/notes", verifyToken, (req, res) => {
  res.json(notes[req.userId] || []);
});

// Add a new note
app.post("/api/notes", verifyToken, (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  const newNote = {
    id: Date.now(),
    text,
    createdAt: new Date(),
  };

  if (!notes[req.userId]) {
    notes[req.userId] = [];
  }

  notes[req.userId].push(newNote);
  res.status(201).json(newNote);
});

// Delete a note
app.delete("/api/notes/:id", verifyToken, (req, res) => {
  const noteId = parseInt(req.params.id);
  notes[req.userId] = notes[req.userId].filter((n) => n.id !== noteId);
  res.json({ message: "Note deleted" });
});

// Get all todos for logged-in user
app.get("/api/todos", verifyToken, (req, res) => {
  res.json(todos[req.userId] || []);
});

// Add a new todo
app.post("/api/todos", verifyToken, (req, res) => {
  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }

  const newTodo = {
    id: Date.now(),
    task,
    done: false,
    createdAt: new Date(),
  };

  if (!todos[req.userId]) {
    todos[req.userId] = [];
  }

  todos[req.userId].push(newTodo);
  res.status(201).json(newTodo);
});

// Update a todo
app.put("/api/todos/:id", verifyToken, (req, res) => {
  const todoId = parseInt(req.params.id);
  const { done } = req.body;

  const todo = todos[req.userId].find((t) => t.id === todoId);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todo.done = done;
  res.json(todo);
});

// Delete a todo
app.delete("/api/todos/:id", verifyToken, (req, res) => {
  const todoId = parseInt(req.params.id);
  todos[req.userId] = todos[req.userId].filter((t) => t.id !== todoId);
  res.json({ message: "Todo deleted" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("\n📝 Sample Users for Testing:");
  console.log("User 1:");
  console.log("  Email: user1@example.com");
  console.log("  Password: password123");
  console.log("\nUser 2:");
  console.log("  Email: user2@example.com");
  console.log("  Password: password456");
});
