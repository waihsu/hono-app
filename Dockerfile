# FROM oven/bun:1 as base

# WORKDIR /app

# COPY package.json .


# COPY . .

# EXPOSE 4000
# # required for docker desktop port mapping

# CMD ["bun", "run", "dev"]

# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM node:18 as base
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
COPY prisma ./prisma
RUN npm install
RUN npx prisma generate

# Install frontend node modules
COPY --link frontend/bun.lockb frontend/package.json ./frontend/
RUN cd frontend && npm install 

# Copy application code
COPY --link . .

# Change to frontend directory and build the frontend app
WORKDIR /app/frontend
RUN npm run build
# Remove all files in frontend except for the dist folder
RUN find . -mindepth 1 ! -regex '^./dist\(/.*\)?' -delete

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "npm", "run", "dev" ]