# Docker Setup for DesignSight

## Quick Start

### 1. Setup Environment
```bash
# Copy environment file
cp backend/env.example backend/.env

# Edit with your API keys
nano backend/.env
```

### 2. Run with Docker
```bash
# Start all services
docker-compose up --build

# Or use the script
./run-docker.sh
```

### 3. Access the Application
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **MongoDB Express**: http://localhost:8081 (admin/admin123)

## Required Environment Variables

Edit `backend/.env` with your API keys:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_jwt_secret_key_here
```

## Services

- **mongo**: MongoDB database
- **backend**: Node.js API server
- **frontend**: React application
- **mongo-express**: Database admin UI

## Development Mode

For development with hot reload:
```bash
docker-compose -f docker-compose.yml -f docker-compose.override.yml up
```

## Stop Services

```bash
docker-compose down
```

## Clean Up

```bash
# Remove containers and volumes
docker-compose down -v

# Remove images
docker-compose down --rmi all
```
