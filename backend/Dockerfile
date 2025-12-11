# Stage 1 — base image
FROM node:20-alpine

WORKDIR /app

# Add postgres client + bash
RUN apk add --no-cache postgresql-client bash

# Copy package files first for cache
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy full app
COPY . .

# Make wait script executable
RUN chmod +x wait-for-postgres.sh

# Expose backend port
EXPOSE 8080

# Start backend after Postgres is ready

ENTRYPOINT ["./wait-for-postgres.sh", "db", "npm", "run", "start"]
