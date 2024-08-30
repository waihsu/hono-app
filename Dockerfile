# Stage 1: Build the frontend using Node.js
FROM node:18 as build

# Set the working directory
WORKDIR /app

# Copy frontend package.json and package-lock.json
COPY frontend/package.json frontend/package-lock.json ./frontend/

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm install

# Copy all frontend files
COPY frontend/ .

# Build the frontend
RUN npm run build

# Stage 2: Create the final image with only the necessary files
FROM node:18-slim as runtime

# Set the working directory
WORKDIR /app

# Copy the built frontend files from the build stage
COPY --from=build /app/frontend/dist ./frontend/dist

# Install only production dependencies for the backend
COPY package.json package-lock.json ./
RUN npm install --only=production

# Copy the rest of the backend application code
COPY . .

# Expose the port
EXPOSE 3000

# Start the backend server
CMD ["npm", "start"]
