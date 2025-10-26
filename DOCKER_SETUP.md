# Todo App - Docker Setup Guide

This is a full-stack Todo application with React frontend, Node.js/Express backend, and PostgreSQL database, all containerized with Docker.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed on your machine

## Project Structure

```
todo/
├── frontend/           # React TypeScript frontend
│   ├── Dockerfile
│   └── .dockerignore
├── backend/           # Node.js Express backend
│   ├── Dockerfile
│   ├── .dockerignore
│   └── prisma/        # Database schema and migrations
└── docker-compose.yml # Docker Compose configuration
```

## Services

The application consists of three services:

1. **Database (db)**: PostgreSQL 15
   - Port: 5432
   - Database: tododb
   - User: postgres
   - Password: postgres

2. **Backend (backend)**: Node.js Express API
   - Port: 3001
   - Built with Express and Prisma ORM

3. **Frontend (frontend)**: React Application
   - Port: 3000
   - Built with TypeScript and Tailwind CSS

## Quick Start

### 1. Clone and Navigate to the Project

```bash
cd /Users/maryamnawas/Desktop/todo
```

### 2. Build and Start All Services

```bash
docker-compose up --build
```

This command will:
- Build Docker images for frontend and backend
- Pull the PostgreSQL image
- Start all three containers
- Run database migrations automatically
- Start the development servers

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432

## Common Commands

### Start all services
```bash
docker-compose up
```

### Start all services in background (detached mode)
```bash
docker-compose up -d
```

### Stop all services
```bash
docker-compose down
```

### Stop all services and remove volumes (deletes database data)
```bash
docker-compose down -v
```

### View logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

### Restart a specific service
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Rebuild a specific service
```bash
docker-compose up --build backend
docker-compose up --build frontend
```

## Database Management

### Run Prisma Migrations

The migrations run automatically when the backend starts. To run them manually:

```bash
docker-compose exec backend npx prisma migrate deploy
```

### Access Prisma Studio (Database GUI)

```bash
docker-compose exec backend npx prisma studio
```

Then open http://localhost:5555 in your browser.

### Reset Database

```bash
docker-compose exec backend npx prisma migrate reset
```

### Create a New Migration

```bash
docker-compose exec backend npx prisma migrate dev --name your_migration_name
```

## Troubleshooting

### Port Already in Use

If you get a port conflict error:

1. Check what's using the port:
   ```bash
   lsof -i :3000  # For frontend
   lsof -i :3001  # For backend
   lsof -i :5432  # For database
   ```

2. Stop the process or change the port in `docker-compose.yml`

### Database Connection Issues

If the backend can't connect to the database:

1. Ensure the database container is running:
   ```bash
   docker-compose ps
   ```

2. Check database logs:
   ```bash
   docker-compose logs db
   ```

3. Verify the DATABASE_URL in backend/.env matches the docker-compose.yml settings

### Node Modules Issues

If you're having issues with node_modules:

1. Remove node_modules from your local directories
2. Rebuild the containers:
   ```bash
   docker-compose down
   docker-compose up --build
   ```

### Hot Reload Not Working

The containers are set up with volume mounts for hot reloading. If changes aren't reflecting:

1. For React: The WATCHPACK_POLLING environment variable is set
2. For Backend: nodemon is configured to watch for changes

If still not working, restart the specific service:
```bash
docker-compose restart frontend
```

## Development Workflow

1. **Start the application**: `docker-compose up`
2. **Make code changes**: Edit files in `frontend/` or `backend/`
3. **Changes auto-reload**: Both frontend and backend will automatically reload
4. **View logs**: `docker-compose logs -f` to see real-time logs
5. **Stop when done**: Press Ctrl+C or `docker-compose down`

## Production Deployment

For production, you should:

1. Update the Dockerfile to use multi-stage builds
2. Change `npm run dev` to `npm start` in backend
3. Build the frontend with `npm run build` and serve with nginx
4. Use environment variables for sensitive data
5. Enable SSL/TLS
6. Use managed database services

## Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://postgres:postgres@db:5432/tododb?schema=public"
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3001
```

## Notes

- The database data persists in a Docker volume named `postgres_data`
- The application uses a custom network `todo-network` for inter-container communication
- Source code is mounted as volumes for development, enabling hot reload

## Support

If you encounter any issues, check:
1. Docker is running: `docker ps`
2. All containers are up: `docker-compose ps`
3. Logs for errors: `docker-compose logs`
