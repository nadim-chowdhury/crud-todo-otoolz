# Dockerfile for Backend

# Use the official Node.js 18 image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose port 5000 (default for the Express server)
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
