# Task Manager Frontend

React and Vite frontend for the Task Manager application. It provides authentication, project and task management, team members, users with role-based access, and dashboard statistics.

## Features

- JWT login and registration with automatic access-token refresh
- Protected routes and role-based administration
- Dashboard with project, task, member counts, and status charts
- Project creation and project detail views
- Task management, filtering, and task detail views
- Project member management
- Responsive Bootstrap and React Bootstrap interface
- API integration through Axios

## Tech Stack

- React 19
- Vite 8
- React Router 7
- Axios
- Bootstrap 5 / React Bootstrap
- Recharts
- dnd-kit
- React Icons
- React Toastify

## Prerequisites

- Node.js 20 or newer
- The Task Manager ASP.NET Core API running locally
- A compatible MySQL server

## Installation

```bash
cd frontend
npm install
```

## Configuration

The frontend uses `https://localhost:7158/api` by default. To use another API URL, create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=https://localhost:7158/api
```

Restart the Vite development server after changing environment variables.

## Running the Application

Start the backend first:

```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```

In a second terminal, start the frontend:

```bash
cd frontend
npm run dev
```

The application is available at `http://localhost:5176` by default.

Swagger documentation is available at `https://localhost:7158/swagger` when the backend is running in Development mode.

## Available Scripts

```bash
npm run dev      # Start the Vite development server
npm run build    # Create a production build
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```

## Project Structure

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/   # Shared UI components
│   ├── context/      # Authentication context
│   ├── pages/        # Application screens
│   ├── routes/       # Route configuration and guards
│   ├── services/     # API and token services
│   ├── styles/       # CSS styles
│   ├── utils/        # Utility helpers
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

## Authentication

JWT access and refresh tokens are stored in browser local storage by the authentication service. Axios adds the access token to API requests and attempts to refresh it after a `401` response. If refreshing fails, the application clears authentication and redirects to login.

## API Configuration

The frontend communicates with these main API areas:

- `/api/auth` — login, registration, and token refresh
- `/api/projects` — projects
- `/api/tasks` — tasks
- `/api/projectmembers` — project membership
- `/api/users` — user administration
- `/api/dashboard` — dashboard data

The exact routes and payloads are documented in the Swagger UI.

## Production Build

```bash
cd frontend
npm run build
npm run preview
```

The compiled files are written to `frontend/dist` and can be deployed to a static web host that supports SPA routing.
