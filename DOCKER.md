# Docker Setup Documentation

This project uses Docker for containerized development and production environments. The setup includes separate configurations for development and production environments.

## Project Structure

```
youtube-backend/
├── docker-compose.yml          # Base configuration
├── docker-compose.override.yml # Development overrides
├── docker-compose.prod.yml     # Production configuration
├── backend/
│   └── Dockerfile             # Backend container
└── frontend/
    ├── Dockerfile.dev         # Development frontend container
    └── Dockerfile.prod        # Production frontend container
```

## Docker Compose Files

### 1. Base Configuration (`docker-compose.yml`)
- Defines the basic service structure
- Uses development Dockerfile by default
- Establishes service dependencies

### 2. Development Override (`docker-compose.override.yml`)
- **Purpose**: Development environment with hot reloading
- **Features**:
  - Volume mounts for live code changes
  - Development commands (`npm run dev`)
  - Host binding for frontend (`--host` flag)
  - Node modules volume to preserve dependencies

### 3. Production Configuration (`docker-compose.prod.yml`)
- **Purpose**: Production-ready deployment
- **Features**:
  - Production environment files
  - Built frontend with preview server
  - Optimized for performance

## Services

### Backend Service
- **Port**: 8000
- **Technology**: Node.js 20 Alpine
- **Development**: Hot reloading with volume mounts
- **Production**: Optimized build

### Frontend Service
- **Development Port**: 5173
- **Production Port**: 4173
- **Technology**: Node.js 20 Alpine + Vite
- **Development**: Live reload with host binding
- **Production**: Built and served with preview

## Usage

### Development Environment

```bash
# Start development environment
docker-compose up

# Start in background
docker-compose up -d

# Rebuild containers
docker-compose build --no-cache

# Stop services
docker-compose down
```

### Production Environment

```bash
# Start production environment
docker-compose -f docker-compose.prod.yml up

# Start in background
docker-compose -f docker-compose.prod.yml up -d

# Stop production services
docker-compose -f docker-compose.prod.yml down
```

### Individual Services

```bash
# Start only backend
docker-compose up backend

# Start only frontend
docker-compose up frontend

# Rebuild specific service
docker-compose build backend
docker-compose build frontend
```

## Environment Files

### Development
- `backend/.env.local`
- `frontend/.env.local`

### Production
- `backend/.env.prod`
- `frontend/.env.prod`

## Volume Mounts (Development)

### Backend
- `./backend:/app` - Live code changes
- `/app/node_modules` - Preserve dependencies

### Frontend
- `./frontend:/app` - Live code changes
- `/app/node_modules` - Preserve dependencies

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check if ports are in use
   lsof -i :8000
   lsof -i :5173
   ```

2. **Node Modules Issues**
   ```bash
   # Remove node_modules and rebuild
   docker-compose down
   docker-compose build --no-cache
   ```

3. **Permission Issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

4. **Docker Cache Issues**
   ```bash
   # Clear Docker cache
   docker system prune -f
   docker-compose build --no-cache
   ```

### Vite Issues
- **Node.js Version**: Ensure Node.js 20+ for Vite 7+
- **Crypto Errors**: Usually resolved by using Node.js 20
- **Host Binding**: Frontend uses `--host` flag for container access

## Development Workflow

1. **Start Development Environment**
   ```bash
   docker-compose up
   ```

2. **Access Applications**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8000

3. **Make Changes**
   - Code changes are automatically reflected due to volume mounts
   - No need to rebuild containers for most changes

4. **Rebuild When Needed**
   ```bash
   # After package.json changes
   docker-compose build
   docker-compose up
   ```

## Production Deployment

1. **Build Production Images**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Start Production Services**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Access Production**
   - Frontend: http://localhost:4173
   - Backend: http://localhost:8000

## Docker Commands Reference

```bash
# View logs
docker-compose logs
docker-compose logs frontend
docker-compose logs backend

# Execute commands in containers
docker-compose exec backend npm install
docker-compose exec frontend npm install

# View running containers
docker-compose ps

# Stop and remove containers
docker-compose down

# Remove volumes
docker-compose down -v

# View container resources
docker stats
```

## Notes

- **Node.js Version**: Both services use Node.js 20 Alpine for compatibility with Vite 7+
- **Hot Reloading**: Development environment supports live code changes
- **Environment Separation**: Clear separation between development and production configs
- **Volume Mounts**: Development uses volume mounts for live editing
- **Build Optimization**: Production uses multi-stage builds for smaller images
