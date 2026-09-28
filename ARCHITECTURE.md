# Study Planner — MERN Architecture Plan

A small full-stack app where a student logs study tasks, marks them done, and views pending and completed work.

**Stack:** MongoDB Atlas (Mongoose) · Express · React (Vite) · Node.js
**Deployment:** Render (Web Service for backend, Static Site for frontend)
**Scope decision:** single user, no login — keeps the project small enough to finish and understand end to end.

---

## 1. Features

| # | Feature | Layer | Notes |
|---|---------|-------|-------|
| 1 | Add a task | Backend + Frontend | Title is the main text of the task |
| 2 | Add course name | Field on task | e.g. "DBMS" |
| 3 | Add topic name | Field on task | e.g. "Normalization" |
| 4 | Assign a priority | Field on task | Low / Medium / High |
| 5 | Set a duration | Field on task | Whole minutes |
| 6 | Mark task as completed | Backend + Frontend | One-way: pending → completed |
| 7 | View pending and completed tasks | Backend + Frontend | Two tabs on one page |

**Optional stretch:** filter by priority, delete a task, edit a task.
**Out of scope:** login, multiple users, reminders, notifications.

---

## 2. Architecture

```text
React (Vite)  ──fetch──▶  Express API (/api/tasks)  ──Mongoose──▶  MongoDB Atlas
(browser)                 (Node.js, Render)                        (tasks collection)
```

The frontend is a single page using component state (no React Router), so there are no client-side routes to break on refresh. The Render rewrite rule is still added as a safety net.

---

## 3. Folder structure

```text
mern-study-planner/
├── ARCHITECTURE.md
├── README.md
├── backend/
│   ├── server.js              # app setup, CORS, DB connect, start server
│   ├── config/db.js           # Mongoose connection
│   ├── models/Task.js         # Task schema
│   ├── routes/taskRoutes.js   # /api/tasks routes
│   ├── .env                   # NOT committed
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx            # holds tasks state, active tab
    │   ├── api.js             # fetch helpers using VITE_API_URL
    │   ├── components/
    │   │   ├── AddTaskForm.jsx
    │   │   ├── TaskList.jsx
    │   │   └── TaskItem.jsx
    │   └── index.css          # plain CSS
    ├── .env                   # NOT committed
    ├── .env.example
    ├── .gitignore
    └── package.json
```

---

## 4. Data structure

Field | Type | Rules
---|---|---
`title` | String | Required, trimmed, 1–100 chars
`courseName` | String | Required, trimmed, 1–60 chars
`topicName` | String | Required, trimmed, 1–80 chars
`priority` | String | Enum: `Low`, `Medium`, `High`. Default `Medium`
`duration` | Number | Required, whole minutes, 1–600
`completed` | Boolean | Default `false`
`completedAt` | Date | `null` until completed
`createdAt`, `updatedAt` | Date | Added by Mongoose `timestamps: true`

---

## 5. API design

Base path: `/api/tasks`. All errors return `{ "error": "message" }`.

| Method | Path | Purpose | Success | Errors |
|---|---|---|---|---|
| `POST` | `/api/tasks` | Create task | `201` + created task | `400` |
| `GET` | `/api/tasks?status=pending|completed` | List tasks | `200` + array | `400` |
| `PUT` | `/api/tasks/:id/complete` | Mark complete | `200` + updated task | `400`, `404`, `409` |

Validation order: required fields → strings trimmed and non-empty → length limits → priority in enum → duration is a whole number in range.

---

## 6. Frontend plan

- `App` loads tasks on mount and holds state for active tab, loading, and error.
- `AddTaskForm` handles task input and inline validation.
- `TaskList` renders the active tab list or empty state.
- `TaskItem` displays task details and a complete button for pending tasks.
- On add or complete, the list refreshes from the backend.

---

## 7. Build order

1. Backend setup and MongoDB connection
2. `Task` model + `POST /api/tasks` with validation
3. `GET /api/tasks` with status filter
4. `PUT /api/tasks/:id/complete`
5. Frontend scaffold and API helper
6. Add task form
7. Task list and pending/completed tabs
8. Complete action and UI states
9. README and cleanup
10. Deployment

---

## 8. Deployment plan

**Backend — Web Service**
- Root directory: `backend`
- Build command: `npm install`
- Start command: `node server.js`
- Environment variables: `MONGO_URI`, `CLIENT_URL`, `PORT`

**Frontend — Static Site**
- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- `VITE_API_URL` is read at build time.

**MongoDB Atlas:** allow Render via `0.0.0.0/0`.
**CORS:** allow `CLIENT_URL` and `http://localhost:5173`.

---

## 9. Definition of done

- Add, complete, and view pending/completed tasks work locally
- Input validation behaves correctly
- No secrets stored in the repo
- Backend and frontend are connected and can be deployed
