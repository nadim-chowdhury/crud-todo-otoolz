# Task Management Application

This is a task management application built with a React-based frontend and a Node.js Express backend, connected to a MongoDB database. The project is containerized using Docker for easier setup and deployment.

## Prerequisites

Ensure you have the following software installed on your machine:

- **Docker**: [Download Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: Docker Compose is included with Docker Desktop

## Setup and Running

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### Step 2: Build and Run the Docker Containers

To build and run the containers, execute the following command:

```bash
docker-compose up --build
```

### Step 3: Access the Application

- **Frontend**: Open your browser and go to [http://localhost:3000](http://localhost:3000)
- **Backend API**: You can access the API endpoints at [http://localhost:5000](http://localhost:5000)

### Step 4: Verify the MongoDB Database

The MongoDB service will be available at `mongodb://localhost:27017/todo-otoolz`. You can connect to it using a MongoDB client like MongoDB Compass or Robo 3T.

### Stopping the Application

To stop and remove the containers, use:

```bash
docker-compose down
```

This command will stop and remove all containers defined in your `docker-compose.yml` file, but data in the MongoDB volume will persist.

## Development Workflow

If you make changes to the code:

1. The changes should automatically reflect due to volume mounting.
2. If you installed new dependencies, rebuild the container with:

   ```bash
   docker-compose up --build
   ```

## Folder Structure

- **`backend/`**: Contains your Node.js Express backend. You can add new API routes or modify existing ones.
- **`frontend/`**: Contains your Next.js frontend. You can add new pages and components or update existing ones.

## Docker Details

### Docker Containers

1. **Backend**: Runs on Node.js, serving the API at port 5000.
2. **Frontend**: Runs on Next.js, serving the frontend at port 3000.
3. **MongoDB**: The database container using the latest MongoDB image.

### Volumes

- `mongo-data`: A Docker volume for persisting MongoDB data across container restarts.

## Troubleshooting

If you encounter issues:

1. Check if all containers are running:

   ```bash
   docker ps
   ```

2. View logs for any errors:

   ```bash
   docker-compose logs backend
   docker-compose logs frontend
   docker-compose logs mongo
   ```

3. If there are issues with dependencies or Docker images, try rebuilding:

   ```bash
   docker-compose down
   docker-compose up --build
   ```

## License

This project is licensed under the MIT License. Feel free to fork and modify as needed.
