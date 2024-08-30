# # FROM oven/bun:1 as base

# # WORKDIR /app

# # COPY package.json .


# # COPY . .

# # EXPOSE 4000
# # # required for docker desktop port mapping

# # CMD ["bun", "run", "dev"]

# # use the official Bun image
# # see all versions at https://hub.docker.com/r/oven/bun/tags
# FROM node:18 as base
# # Bun app lives here
# WORKDIR /app

# # Set production environment
# ENV NODE_ENV="production"


# # Throw-away build stage to reduce size of final image
# FROM base as build

# # Install packages needed to build node modules
# # RUN apt-get update -qq && \
# #     apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# # Install node modules
# COPY --link bun.lockb package.json ./
# COPY prisma ./prisma
# RUN npm install
# RUN npx prisma generate

# # Install frontend node modules
# COPY --link frontend/bun.lockb frontend/package.json ./frontend/


# # Copy application code
# COPY --link . .

# # Change to frontend directory and build the frontend app
# COPY --link bun.lockb package.json ./
# WORKDIR /app/frontend
# RUN npm install 
# RUN npm run build
# # Remove all files in frontend except for the dist folder
# RUN find . -mindepth 1 ! -regex '^./dist\(/.*\)?' -delete

# # Final stage for app image
# FROM base

# # Copy built application
# COPY --from=build /app /app

# # Start the server by default, this can be overwritten at runtime
# EXPOSE 3000
# CMD [ "bun", "run", "dev" ]
# Stage 1: Use Node.js to build the application and handle Prisma
FROM node:18 as build



# Set the working directory
WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./frontend/
WORKDIR /app/frontend
RUN rm -rf node_modules
RUN rm -f package-lock.json
RUN npm install
RUN npm install -g rollup
RUN npm run build

# Copy the main package.json and install dependencies for the backend
COPY package.json package-lock.json ./
RUN npm install

# Copy Prisma schema and other necessary files
COPY prisma ./prisma

# Install frontend dependencies and build frontend


# Copy the rest of the application code
WORKDIR /app
COPY . .

# Generate Prisma client and run migrations
RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npx prisma migrate deploy --schema=./prisma/schema.prisma

# Remove unnecessary files to reduce image size
WORKDIR /app/frontend
RUN find . -mindepth 1 ! -regex '^./dist\(/.*\)?' -delete

# Stage 2: Use Bun for the final runtime
FROM oven/bun:1 as runtime

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app /app

# Install Bun dependencies if necessary (skip Prisma)
COPY bun.lockb ./
RUN bun install --production --no-save

# Expose the port
EXPOSE 3000

# Start the server using Bun
CMD ["bun", "run", "dev"]
