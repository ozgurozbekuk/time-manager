# Time Manager

Full-stack productivity suite that combines task planning, time tracking, and focus tools in one place. The project ships a React + Vite single-page application backed by an Express API with MongoDB persistence and JWT-secured authentication.

## Features
- **Unified workspace** – Task board, timer, Pomodoro, and detailed time tracker accessible from one responsive UI.
- **Kanban Task Flow** – Create, drag-and-drop, and edit tasks with priority and status management (`todo`, `doing`, `done`), backed by MongoDB.
- **Time Tracker** – Start/stop live timers, add manual entries, edit durations inline, and group work by project with automatic duration calculations.
- **Focus Tools** – Standalone chronometer with alarms and a configurable Pomodoro timer for preset focus/break intervals.
- **User Accounts** – JWT cookie-based auth with registration, login, profile editing, password updates, and account deletion.
- **Insights Dashboard** – Profile page aggregates task completion counts and visualizes tracked time distribution per project.

## Tech Stack
- **Frontend:** React 19, Vite 6, React Router 7, Zustand (with persistence), Axios, Tailwind CSS 4, @dnd-kit/core for drag & drop, Lucide + MUI icon sets, react-hot-toast notifications.
- **Backend:** Node.js, Express 5, MongoDB with Mongoose 8, JSON Web Tokens, bcrypt for password hashing, cookie-parser, cors, dotenv.
- **Tooling:** ESLint, Tailwind/PostCSS toolchain, Nodemon for backend development.

## Project Structure
```
time-manager/
├── backend/        # Express API, MongoDB models, authentication, and business logic
│   ├── controller/ # Auth, task, tracker, user controllers
│   ├── routes/     # REST route definitions under /api
│   ├── models/     # Mongoose schemas for User, Task, Tracker
│   └── server.js   # App entry point, CORS config, static frontend serving
└── frontend/       # Vite React SPA with productivity UI
    ├── src/
    │   ├── pages/        # Task board, tracker, timer, pomodoro, auth, profile
    │   ├── components/   # Navbar, cards, utilities
    │   └── store/        # Zustand auth store
    └── vite.config.js
```

## Prerequisites
- Node.js ≥ 18 and npm.
- Running MongoDB instance (local or hosted).

## Configuration
Create `backend/.env` with:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/time-manager
JWT_SECRET=replace_me
# Optional: comma-separated origins (without trailing slash) allowed by CORS
CORS_ORIGIN=http://localhost:5173
```

Create `frontend/.env` if you need to override the default API proxy:
```
VITE_API_BASE_URL=http://localhost:5000/api
```
(When omitted, the frontend proxies to `/api`, which works when Vite dev server and backend run on the same host.)

## Local Development
Install dependencies in each workspace:
```bash
cd backend
npm install

cd ../frontend
npm install
```

Run the backend API:
```bash
cd backend
npm run dev
```

Run the frontend SPA:
```bash
cd frontend
npm run dev
```

The frontend defaults to http://localhost:5173 and communicates with the API at `/api`.

## Production Build
1. Build the frontend bundle:
   ```bash
   cd frontend
   npm run build
   ```
2. Copy or leave the generated `dist/` folder in `frontend/`.  
   The Express server automatically serves static assets from `frontend/dist` when they exist.
3. Start the backend in production mode:
   ```bash
   cd backend
   npm run start
   ```

All protected routes require the `jwt` http-only cookie set during authentication.

## Notes
- The project relies on `axios.defaults.withCredentials = true` to send cookies; ensure same-site/CORS settings line up with your deployment.
- Tailwind CSS 4 (`@tailwindcss/vite`) powers the UI styling alongside some custom class utilities in `src/index.css`.
- The tracker page calculates durations client-side for running tasks and renders project distribution charts without external charting libraries.
