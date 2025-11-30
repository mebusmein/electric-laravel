# Todo App - Laravel + React + ElectricSQL

A full-stack todo application demonstrating real-time sync with ElectricSQL, Laravel API backend with authentication, and React SPA frontend.

## Key Demo Files

### Backend: ElectricSQL Shape Proxy with Auth

[`backend/app/Http/Controllers/Api/ShapeController.php`](backend/app/Http/Controllers/Api/ShapeController.php)

This controller demonstrates how to proxy ElectricSQL shape requests through Laravel with:
- **Authentication** - Validates Sanctum bearer token before allowing access
- **User-level data filtering** - Adds `WHERE user_id = {user_id}` to ensure users only see their own todos
- **Protocol parameter forwarding** - Passes through Electric protocol params (`offset`, `handle`, `live`, etc.)
- **Server-side table specification** - Sets the table name server-side for security

```php
// Filter by user_id - users can only see their own todos
$queryParams['where'] = "user_id = {$user->id}";
```

### Frontend: Live Query Integration

[`frontend/src/pages/TodosPage.tsx`](frontend/src/pages/TodosPage.tsx)

The TodosPage demonstrates real-time data sync using `@tanstack/react-db` with ElectricSQL:

```tsx
const { data: todos, isLoading } = useLiveQuery((q) =>
  q.from({ todos: todosCollection })
);
```

[`frontend/src/api/todos.ts`](frontend/src/api/todos.ts)

Configures the ElectricSQL collection with authenticated shape requests:

```ts
export const todosCollection = createCollection(
  electricCollectionOptions({
    id: 'todos',
    schema: todoShape,
    shapeOptions: {
      url: `${API_URL}/api/shape/todos`,
      headers: {
        Authorization: getAuthToken,
      },
    },
    getKey: (item) => item.id,
  })
)
```

---

## Tech Stack

### Backend
- Laravel 11 with PHP 8.4
- PostgreSQL 16
- Laravel Sanctum for API authentication
- ElectricSQL shape proxy
- Docker (PHP-FPM + Nginx)

### Frontend
- React 18 with TypeScript
- Vite for development/bundling
- Tailwind CSS for styling
- `@tanstack/react-db` + `@tanstack/electric-db-collection` for real-time sync
- React Router for navigation

## Prerequisites

- Docker & Docker Compose
- ElectricSQL running (default: http://localhost:3000)
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
- **Adminer (DB UI)** at http://localhost:8080

### 2. Set up the Laravel backend

```bash
# Run migrations and seed test data
docker exec todo-app php artisan migrate:fresh --seed
```

### 3. Start ElectricSQL

Make sure ElectricSQL is running and connected to the same PostgreSQL database.

### 4. Access the application

Open http://localhost:5173 in your browser.

**Test accounts:**
| Email | Password |
|-------|----------|
| john@example.com | password |
| jane@example.com | password |

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

### ElectricSQL Shape Proxy
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shape/todos` | Proxied shape endpoint with user filtering |

## Project Structure

```
.
├── docker-compose.yml
├── backend/
│   ├── app/Http/Controllers/Api/
│   │   ├── AuthController.php
│   │   ├── ShapeController.php    # <-- ElectricSQL proxy
│   │   └── TodoController.php
│   ├── app/Models/
│   │   ├── User.php
│   │   └── Todo.php
│   └── routes/api.php
└── frontend/
    └── src/
        ├── api/
        │   └── todos.ts           # <-- Electric collection config
        └── pages/
            └── TodosPage.tsx      # <-- Live query usage
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
ELECTRIC_URL=http://host.docker.internal:3000
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
