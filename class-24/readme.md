# MVC Pattern with SQLite and Node.js - Notes CRUD Operations

## Overview

This documentation explains how to implement a **Model-View-Controller (MVC)** pattern for performing CRUD (Create, Read, Update, Delete) operations on a notes application using **Node.js** and **SQLite** database.

## Table of Contents

1. [What is MVC Pattern?](#what-is-mvc-pattern)
2. [Project Structure](#project-structure)
3. [Setup and Installation](#setup-and-installation)
4. [Model Layer](#model-layer)
5. [View Layer](#view-layer)
6. [Controller Layer](#controller-layer)
7. [Database Setup](#database-setup)
8. [API Endpoints](#api-endpoints)
9. [Testing the Application](#testing-the-application)
10. [Best Practices](#best-practices)

---

## What is MVC Pattern?

The **Model-View-Controller (MVC)** is a software design pattern that separates an application into three main logical components:

### 📊 Model

- **Purpose**: Handles data logic and database operations
- **Responsibilities**:
  - Define data structure
  - Perform database queries
  - Validate data
  - Business logic implementation

### 🎨 View

- **Purpose**: Handles the presentation layer
- **Responsibilities**:
  - Display data to users
  - Handle user interface
  - Send responses (JSON/HTML)

### 🎮 Controller

- **Purpose**: Handles user input and coordinates between Model and View
- **Responsibilities**:
  - Process HTTP requests
  - Call appropriate model methods
  - Return responses to the client

---

## Project Structure

```
notes-app/
├── src/
│   ├── controllers/
│   │   └── noteController.js
│   ├── models/
│   │   └── noteModel.js
│   ├── routes/
│   │   └── noteRoutes.js
│   ├── views/
│   │   └── (for web views - optional)
│   └── database/
│       └── database.js
├── package.json
├── server.js
└── README.md
```

---

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. **Initialize the project**:

```bash
mkdir notes-app
cd notes-app
npm init -y
```

2. **Install required packages**:

```bash
npm install express sqlite3 cors dotenv
npm install --save-dev nodemon
```

3. **Update package.json scripts**:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

---

## Database Setup

### Database Configuration (`src/database/database.js`)

```javascript
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "notes.db");

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
    createTables();
  }
});

// Create notes table
function createTables() {
  const createNotesTable = `
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            category TEXT DEFAULT 'general',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;

  db.run(createNotesTable, (err) => {
    if (err) {
      console.error("Error creating table:", err.message);
    } else {
      console.log("Notes table created or already exists.");
    }
  });
}

module.exports = db;
```

---

## Model Layer

### Note Model (`src/models/noteModel.js`)

```javascript
const db = require("../database/database");

class NoteModel {
  // Create a new note
  static async create(noteData) {
    const { title, content, category = "general" } = noteData;

    return new Promise((resolve, reject) => {
      const sql = `
                INSERT INTO notes (title, content, category, updated_at)
                VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            `;

      db.run(sql, [title, content, category], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, title, content, category });
        }
      });
    });
  }

  // Get all notes
  static async getAll() {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM notes ORDER BY created_at DESC";

      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get note by ID
  static async getById(id) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM notes WHERE id = ?";

      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Update note
  static async update(id, noteData) {
    const { title, content, category } = noteData;

    return new Promise((resolve, reject) => {
      const sql = `
                UPDATE notes 
                SET title = ?, content = ?, category = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;

      db.run(sql, [title, content, category, id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, title, content, category, changes: this.changes });
        }
      });
    });
  }

  // Delete note
  static async delete(id) {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM notes WHERE id = ?";

      db.run(sql, [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, deleted: this.changes > 0 });
        }
      });
    });
  }

  // Search notes
  static async search(query) {
    return new Promise((resolve, reject) => {
      const sql = `
                SELECT * FROM notes 
                WHERE title LIKE ? OR content LIKE ? 
                ORDER BY created_at DESC
            `;

      const searchTerm = `%${query}%`;
      db.all(sql, [searchTerm, searchTerm], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = NoteModel;
```

---

## Controller Layer

### Note Controller (`src/controllers/noteController.js`)

```javascript
const NoteModel = require("../models/noteModel");

class NoteController {
  // Create a new note
  static async createNote(req, res) {
    try {
      const { title, content, category } = req.body;

      // Validation
      if (!title || !content) {
        return res.status(400).json({
          success: false,
          message: "Title and content are required",
        });
      }

      const note = await NoteModel.create({ title, content, category });

      res.status(201).json({
        success: true,
        message: "Note created successfully",
        data: note,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating note",
        error: error.message,
      });
    }
  }

  // Get all notes
  static async getAllNotes(req, res) {
    try {
      const notes = await NoteModel.getAll();

      res.json({
        success: true,
        message: "Notes retrieved successfully",
        data: notes,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving notes",
        error: error.message,
      });
    }
  }

  // Get note by ID
  static async getNoteById(req, res) {
    try {
      const { id } = req.params;
      const note = await NoteModel.getById(id);

      if (!note) {
        return res.status(404).json({
          success: false,
          message: "Note not found",
        });
      }

      res.json({
        success: true,
        message: "Note retrieved successfully",
        data: note,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving note",
        error: error.message,
      });
    }
  }

  // Update note
  static async updateNote(req, res) {
    try {
      const { id } = req.params;
      const { title, content, category } = req.body;

      // Check if note exists
      const existingNote = await NoteModel.getById(id);
      if (!existingNote) {
        return res.status(404).json({
          success: false,
          message: "Note not found",
        });
      }

      // Validation
      if (!title || !content) {
        return res.status(400).json({
          success: false,
          message: "Title and content are required",
        });
      }

      const updatedNote = await NoteModel.update(id, {
        title,
        content,
        category,
      });

      res.json({
        success: true,
        message: "Note updated successfully",
        data: updatedNote,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating note",
        error: error.message,
      });
    }
  }

  // Delete note
  static async deleteNote(req, res) {
    try {
      const { id } = req.params;

      // Check if note exists
      const existingNote = await NoteModel.getById(id);
      if (!existingNote) {
        return res.status(404).json({
          success: false,
          message: "Note not found",
        });
      }

      const result = await NoteModel.delete(id);

      res.json({
        success: true,
        message: "Note deleted successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting note",
        error: error.message,
      });
    }
  }

  // Search notes
  static async searchNotes(req, res) {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }

      const notes = await NoteModel.search(q);

      res.json({
        success: true,
        message: "Notes found",
        data: notes,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error searching notes",
        error: error.message,
      });
    }
  }
}

module.exports = NoteController;
```

---

## View Layer

### Routes (`src/routes/noteRoutes.js`)

```javascript
const express = require("express");
const NoteController = require("../controllers/noteController");

const router = express.Router();

// CRUD Routes

// CREATE - POST /api/notes
router.post("/", NoteController.createNote);

// READ - GET /api/notes
router.get("/", NoteController.getAllNotes);

// READ - GET /api/notes/:id
router.get("/:id", NoteController.getNoteById);

// UPDATE - PUT /api/notes/:id
router.put("/:id", NoteController.updateNote);

// DELETE - DELETE /api/notes/:id
router.delete("/:id", NoteController.deleteNote);

// SEARCH - GET /api/notes/search?q=query
router.get("/search", NoteController.searchNotes);

module.exports = router;
```

### Main Server File (`server.js`)

```javascript
const express = require("express");
const cors = require("cors");
const noteRoutes = require("./src/routes/noteRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Routes
app.use("/api/notes", noteRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Notes API - MVC Pattern with SQLite",
    version: "1.0.0",
    endpoints: {
      "GET /api/notes": "Get all notes",
      "GET /api/notes/:id": "Get note by ID",
      "POST /api/notes": "Create new note",
      "PUT /api/notes/:id": "Update note",
      "DELETE /api/notes/:id": "Delete note",
      "GET /api/notes/search?q=query": "Search notes",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: err.message,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}`);
});
```

---

## API Endpoints

### 📝 Note Operations

| Method   | Endpoint                    | Description     | Request Body                  |
| -------- | --------------------------- | --------------- | ----------------------------- |
| `GET`    | `/api/notes`                | Get all notes   | -                             |
| `GET`    | `/api/notes/:id`            | Get note by ID  | -                             |
| `POST`   | `/api/notes`                | Create new note | `{title, content, category?}` |
| `PUT`    | `/api/notes/:id`            | Update note     | `{title, content, category?}` |
| `DELETE` | `/api/notes/:id`            | Delete note     | -                             |
| `GET`    | `/api/notes/search?q=query` | Search notes    | -                             |

### 📊 Response Format

**Success Response:**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    /* note data or array of notes */
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## Testing the Application

### Using curl Commands

1. **Create a note**:

```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Note",
    "content": "This is the content of my first note",
    "category": "personal"
  }'
```

2. **Get all notes**:

```bash
curl http://localhost:3000/api/notes
```

3. **Get a specific note**:

```bash
curl http://localhost:3000/api/notes/1
```

4. **Update a note**:

```bash
curl -X PUT http://localhost:3000/api/notes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Note Title",
    "content": "Updated content",
    "category": "work"
  }'
```

5. **Delete a note**:

```bash
curl -X DELETE http://localhost:3000/api/notes/1
```

6. **Search notes**:

```bash
curl "http://localhost:3000/api/notes/search?q=first"
```

### Using Postman

Import the following collection to Postman:

```json
{
  "info": {
    "name": "Notes API",
    "description": "CRUD operations for notes"
  },
  "item": [
    {
      "name": "Get All Notes",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/notes"
      }
    },
    {
      "name": "Create Note",
      "request": {
        "method": "POST",
        "url": "http://localhost:3000/api/notes",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"New Note\",\n  \"content\": \"Note content\",\n  \"category\": \"general\"\n}"
        }
      }
    }
  ]
}
```

---

## Best Practices

### 🔧 Code Organization

1. **Separation of Concerns**: Each component has a single responsibility
2. **Error Handling**: Consistent error handling across all layers
3. **Validation**: Input validation at the controller level
4. **Async/Await**: Use async/await for better readability

### 🛡️ Security Considerations

1. **Input Validation**: Always validate user input
2. **SQL Injection Prevention**: Use parameterized queries
3. **Error Messages**: Don't expose sensitive information
4. **CORS**: Configure CORS properly for production

### 📈 Performance Optimization

1. **Database Indexing**: Add indexes for frequently queried columns
2. **Connection Pooling**: Consider connection pooling for production
3. **Caching**: Implement caching for frequently accessed data
4. **Pagination**: Add pagination for large datasets

### 🧪 Testing

1. **Unit Tests**: Test individual functions
2. **Integration Tests**: Test API endpoints
3. **Database Tests**: Test database operations
4. **Error Scenarios**: Test error handling

---

## Advanced Features

### 📄 Pagination

```javascript
// In NoteModel
static async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM notes
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `;

        db.all(sql, [limit, offset], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}
```

### 🏷️ Categories

```javascript
// In NoteModel
static async getByCategory(category) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM notes WHERE category = ? ORDER BY created_at DESC';

        db.all(sql, [category], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}
```

### 📊 Statistics

```javascript
// In NoteModel
static async getStats() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT
                COUNT(*) as total_notes,
                COUNT(DISTINCT category) as unique_categories,
                COUNT(CASE WHEN created_at > datetime('now', '-7 days') THEN 1 END) as notes_this_week
            FROM notes
        `;

        db.get(sql, [], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}
```

---

## Troubleshooting

### Common Issues

1. **Database Connection Error**:

   - Check if SQLite3 is installed
   - Verify file permissions
   - Ensure database path is correct

2. **Table Not Found**:

   - Run the database setup script
   - Check table creation SQL

3. **CORS Issues**:

   - Configure CORS middleware
   - Check allowed origins

4. **Async/Await Errors**:
   - Ensure all async operations are properly awaited
   - Add proper error handling

### Debugging Tips

1. **Console Logging**: Add detailed logs
2. **Database Queries**: Log SQL queries
3. **Error Stack Traces**: Use proper error handling
4. **Network Tools**: Use browser dev tools for API testing

---

## Conclusion

This MVC pattern implementation provides a solid foundation for building scalable and maintainable Node.js applications with SQLite. The separation of concerns makes the code easier to test, debug, and extend.

### Key Takeaways

1. **MVC Pattern** separates concerns effectively
2. **SQLite** is great for small to medium applications
3. **Async/Await** makes database operations clean
4. **Error Handling** is crucial for robust applications
5. **Validation** prevents data integrity issues

### Next Steps

1. Add authentication and authorization
2. Implement file uploads for note attachments
3. Add real-time features with WebSockets
4. Create a frontend interface
5. Deploy to production environment

---

**Happy Coding! 🚀**

For questions or contributions, please open an issue or submit a pull request.
