# TaskFlow - Full Stack Todo Application

A modern, full-stack todo application built with React, Node.js, Express, PostgreSQL, and Docker.

---

## Run Project with Docker

### Start Application
```bash
docker-compose up --build
```

### Start in Background
```bash
docker-compose up -d
```

### Stop Application
```bash
docker-compose down
```

### Stop and Remove Volumes
```bash
docker-compose down -v
```

### Restart Services
```bash
docker-compose restart
docker-compose restart backend
docker-compose restart frontend
```

---

## Run Tests

### Backend Tests

```bash
# Run all tests
docker-compose exec backend npm test

# Run integration tests
docker-compose exec backend npm run test:integration

# Run unit tests
docker-compose exec backend npm run test:unit

# Run tests in watch mode
docker-compose exec backend npm run test:watch
```

### Frontend Tests

```bash
# Run all tests
docker-compose exec frontend npm test -- --watchAll=false

# Run with coverage
docker-compose exec frontend npm test -- --watchAll=false --coverage

# Run in watch mode
docker-compose exec frontend npm test
```
---

## Access URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Database:** localhost:5432


