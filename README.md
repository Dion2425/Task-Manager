# Task Manager

A full-stack project and task management application with JWT authentication, role-based access, project membership, Kanban task workflow, comments, labels, sprints, and dashboard reporting.

## Overview

The application consists of a React/Vite client and an ASP.NET Core Web API backed by MySQL.

### Main Features

- User registration and login
- Access and refresh token authentication
- Admin-only user management
- Project creation, editing, status, and membership management
- Kanban board with To Do, In Progress, Testing, and Done columns
- Task assignment, priority, deadlines, comments, labels, and attachments
- Sprints and project activity tracking
- Dashboard charts and project/task statistics
- Protected frontend routes and backend authorization

## Technology

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite 8, React Router, Axios, Bootstrap 5, dnd-kit, Recharts |
| Backend | ASP.NET Core 8, Entity Framework Core 8, AutoMapper, JWT Bearer, Swagger |
| Database | MySQL / Pomelo Entity Framework Core provider |
| Authentication | JWT access tokens and refresh tokens, BCrypt password hashing |

## Project Structure

```text
Task-Manager/
├── backend/
│   ├── Controllers/       # REST API controllers
│   ├── Data/              # EF Core database context
│   ├── DTOs/              # API request and response models
│   ├── Mappings/          # AutoMapper profiles
│   ├── Migrations/        # EF Core migrations
│   ├── Models/            # Domain and Identity models
│   └── Program.cs         # API setup and middleware
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       ├── styles/
│       └── utils/
└── package.json
```

## Prerequisites

- Windows 10/11 or another environment capable of running Node.js and .NET
- .NET 8 SDK
- Node.js 20 or newer
- npm
- MySQL 8 or a compatible MySQL server
- Entity Framework CLI tools

Install EF Core tools when needed:

```bash
dotnet tool install --global dotnet-ef
```

## Database Setup

Create a MySQL database matching the default connection string:

```text
task_manager_db
```

The default backend connection is configured in `backend/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "server=localhost;port=3306;database=task_manager_db;user=root;password=;"
  }
}
```

Update the connection string for your MySQL username and password. It is recommended to use environment variables or local user secrets instead of committing production credentials.

Apply migrations:

```bash
cd backend
dotnet restore
dotnet ef database update
```

## Running the Project

### 1. Start the backend

```bash
cd backend
dotnet restore
dotnet run
```

The API launch profile uses:

- HTTP: `http://localhost:5278`
- HTTPS: `https://localhost:7158`
- Swagger: `https://localhost:7158/swagger`

### 2. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5176`.

## Frontend Environment

Create `frontend/.env` if the API URL differs from the default:

```env
VITE_API_URL=https://localhost:7158/api
```

Restart Vite after modifying environment variables.

## Backend Configuration

JWT settings are in `backend/appsettings.json`:

```json
{
  "Jwt": {
    "Key": "CHANGE_THIS_IN_PRODUCTION",
    "Issuer": "TaskManagerApi",
    "Audience": "TaskManagerClient",
    "AccessTokenExpirationMinutes": 15,
    "RefreshTokenExpirationDays": 7
  }
}
```

The JWT key must be long and secret in production. The backend supports CORS through `Cors:AllowedOrigins`; if unset, it allows `http://localhost:5176`.

## API Areas

The REST API includes controllers for:

- Authentication and refresh tokens
- Users and roles
- Projects and project status
- Project members
- Tasks and task status
- Task comments
- Labels and task labels
- Sprints
- Task attachments
- Activity logs

When running in Development mode, explore and test every endpoint through Swagger at `https://localhost:7158/swagger`.

## Frontend Routes

| Route | Description | Access |
|---|---|---|
| `/` | Login | Public |
| `/register` | Registration | Public |
| `/dashboard` | Dashboard overview | Authenticated |
| `/projects` | Project list and management | Authenticated |
| `/project/:id` | Project detail | Authenticated |
| `/tasks` | Kanban task board | Authenticated |
| `/task/:id` | Task detail | Authenticated |
| `/members` | Members view | Authenticated |
| `/users` | User administration | Admin |

## NPM Scripts

```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build production assets
npm run preview  # Preview the production build
npm run lint     # Run ESLint
```

## Production Build

Build the frontend:

```bash
cd frontend
npm run build
```

The optimized application is generated in `frontend/dist`. Run the ASP.NET Core API in a production environment and configure HTTPS, CORS, database credentials, and JWT settings before deployment.

## Development Notes

- The API and frontend use separate development servers and require CORS configuration.
- A frontend `401` response triggers the refresh-token flow.
- Keep database, JWT, and local secret values out of source control.
- Run both applications with matching frontend API and backend CORS URLs.
