# Todo App - Laravel + React

A full-stack todo application with user authentication, built with Laravel 11 API backend and React SPA frontend.

## Tech Stack

### Backend
- Laravel 11 with PHP 8.3
- PostgreSQL 16
- Laravel Sanctum for API authentication
- Docker (PHP-FPM + Nginx)

### Frontend
- React 18 with TypeScript
- Vite for development/bundling
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls

## Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local frontend development)

## Getting Started

### 1. Start the Docker containers

```bash
docker-compose up -d --build
```

This starts:
- **Laravel API** at http://localhost:8000
- **PostgreSQL** at localhost:5432
- **React frontend** at http://localhost:5173

### 2. Set up the Laravel backend

```bash
# Enter the app container
docker exec -it todo-app bash

# Run migrations
php artisan migrate

# Generate application key (if not already set)
php artisan key:generate
```

### 3. Access the application

Open http://localhost:5173 in your browser to access the React frontend.

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Login and get token |
| POST | `/api/logout` | Logout (requires auth) |
| GET | `/api/user` | Get current user (requires auth) |

### Todos
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | List all user's todos |
| POST | `/api/todos` | Create a new todo |
| GET | `/api/todos/{id}` | Get a single todo |
| PUT | `/api/todos/{id}` | Update a todo |
| DELETE | `/api/todos/{id}` | Delete a todo |

## Development

### Backend (Laravel)

The Laravel application is in the `backend/` directory. Any changes are automatically reflected due to volume mounting.

```bash
# Run artisan commands
docker exec -it todo-app php artisan <command>

# View logs
docker logs todo-app -f
```

### Frontend (React)

The React application is in the `frontend/` directory. Vite provides hot module replacement.

```bash
# For local development without Docker
cd frontend
npm install
npm run dev
```

## Project Structure

```
.
├── docker-compose.yml          # Docker orchestration
├── backend/                    # Laravel API
│   ├── Dockerfile
│   ├── docker/
│   │   ├── nginx.conf
│   │   └── php.ini
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   └── TodoController.php
│   │   └── Models/
│   │       ├── User.php
│   │       └── Todo.php
│   └── routes/api.php
└── frontend/                   # React SPA
    ├── Dockerfile
    └── src/
        ├── api/                # API client & types
        ├── contexts/           # React contexts
        ├── components/         # Reusable components
        └── pages/              # Page components
```

## Environment Variables

### Backend (.env)
```
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=todo_app
DB_USERNAME=todo_user
DB_PASSWORD=secret
SANCTUM_STATEFUL_DOMAINS=localhost:5173
FRONTEND_URL=http://localhost:5173
```

### Frontend
```
VITE_API_URL=http://localhost:8000
```

## Stopping the Application

```bash
docker-compose down
```

To also remove volumes (database data):

```bash
docker-compose down -v
```

