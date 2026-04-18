# Backend Server

Simple Node.js/Express backend for the Notes & Tasks application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on `http://localhost:5000`

## Sample Users for Testing

You can login with these pre-configured users:

### User 1
- **Email:** user1@example.com
- **Password:** password123

### User 2
- **Email:** user2@example.com
- **Password:** password456

## Features

- User authentication with JWT tokens
- Create, read, and delete notes
- Create, read, update, and delete todos (tasks)
- Token-based authorization for protected endpoints
- In-memory data storage (resets on server restart)

## API Endpoints

### Authentication
- `POST /api/login` - Login with email and password
- `POST /api/register` - Register a new user

### Notes (Protected)
- `GET /api/notes` - Get all notes for logged-in user
- `POST /api/notes` - Create a new note
- `DELETE /api/notes/:id` - Delete a note

### Todos (Protected)
- `GET /api/todos` - Get all todos for logged-in user
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo (mark as done/undone)
- `DELETE /api/todos/:id` - Delete a todo

## Notes

- Data is stored in memory and will be reset when the server restarts
- For production use, connect a real database
- Change the JWT_SECRET in server.js for security
