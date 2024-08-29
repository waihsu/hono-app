# FROM oven/bun:1 as base

# WORKDIR /app

# COPY package.json .


# COPY . .

# EXPOSE 4000
# # required for docker desktop port mapping

# CMD ["bun", "run", "dev"]

# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
# FROM oven/bun:1 as base
FROM node:18 as build
# Bun app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY --link bun.lockb package.json ./
RUN bun install --ci
RUN npx prisma generate

# Install frontend node modules
COPY --link frontend/bun.lockb frontend/package.json ./frontend/
RUN cd frontend && bun install --ci

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
