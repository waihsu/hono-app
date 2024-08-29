# # FROM oven/bun:1 as base

# # WORKDIR /app

# # COPY package.json .


# # COPY . .

# # EXPOSE 4000
# # # required for docker desktop port mapping

# # CMD ["bun", "run", "dev"]

# # use the official Bun image
# # see all versions at https://hub.docker.com/r/oven/bun/tags
# FROM oven/bun:1 as base
# # Bun app lives here
# WORKDIR /app

# # Set production environment
# ENV NODE_ENV="production"


# # Throw-away build stage to reduce size of final image
# FROM base as build

# # Install packages needed to build node modules
# RUN apt-get update -qq && \
#     apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# # Install node modules
# COPY --link bun.lockb package.json ./
# RUN bun install --ci

# # Install frontend node modules
# COPY --link frontend/bun.lockb frontend/package.json ./frontend/
# RUN cd frontend && bun install --ci

# # Copy application code
# COPY --link . .

# # Change to frontend directory and build the frontend app
# WORKDIR /app/frontend
# RUN bun run build
# # Remove all files in frontend except for the dist folder
# RUN find . -mindepth 1 ! -regex '^./dist\(/.*\)?' -delete

# # Final stage for app image
# FROM base

# # Copy built application
# COPY --from=build /app /app

# # Start the server by default, this can be overwritten at runtime
# EXPOSE 3000
# CMD [ "bun", "run", "dev" ]
# Use the official Bun image as the base
# FROM oven/bun:1 as base

# # Set the working directory
# WORKDIR /app

# # Set production environment
# ENV NODE_ENV="production"

# # Stage 1: Install dependencies and build the app
# FROM base as build

# # Install packages needed to build node modules
# RUN apt-get update -qq && \
#     apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# # Install node modules
# COPY --link bun.lockb package.json ./
# RUN bun install --ci

# # Install frontend node modules
# COPY --link frontend/bun.lockb frontend/package.json ./frontend/
# RUN cd frontend && bun install --ci

# # Copy the application code
# COPY --link . .

# # Generate Prisma client
# RUN bun prisma generate

# # Change to frontend directory and build the frontend app
# WORKDIR /app/frontend
# RUN bun run build

# # Remove all files in frontend except for the dist folder
# RUN find . -mindepth 1 ! -regex '^./dist\(/.*\)?' -delete

# # Stage 2: Create the final image
# FROM base

# # Copy the built application
# COPY --from=build /app /app

# # Expose the port
# EXPOSE 3000

# # Run database migrations
# CMD ["bun", "run", "migrate", "deploy"]

# # Start the server
# CMD ["bun", "run", "dev"]



# Stage 1: Use Node.js to build the application and handle Prisma
FROM node:18 as build

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Install frontend dependencies
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN cd frontend && npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client and run migrations
RUN npx prisma generate
# RUN npx prisma migrate deploy

# Build the frontend
WORKDIR /app/frontend
RUN npm run build

# Remove unnecessary files to keep the image size small
RUN find . -mindepth 1 ! -regex '^./dist\(/.*\)?' -delete

# Stage 2: Use Bun for the final runtime
FROM oven/bun:1 as runtime

# Set the working directory
WORKDIR /app

# Copy the built application from the previous stage
COPY --from=build /app /app

# Expose the port
EXPOSE 3000

# Start the server
CMD ["bun", "run", "dev"]

