# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:latest AS base
WORKDIR /app
FROM base AS build

# install dependencies into temp directory
# this will cache them and speed up future builds
# Install node modules
COPY --link bun.lockb package.json ./
COPY prisma ./prisma
COPY .env .env
RUN bun install 
RUN bun add @prisma/client
RUN bunx prisma generate

# Install frontend node modules
COPY --link frontend/bun.lockb frontend/package.json ./frontend/
RUN cd frontend && bun install

# Copy application code
COPY --link . .

# Change to frontend directory and build the frontend app
WORKDIR /app/frontend
RUN bun run build
# Remove all files in frontend except for the dist folder
RUN find . -mindepth 1 ! -regex '^./dist\(/.*\)?' -delete

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "bun", "run", "dev" ]