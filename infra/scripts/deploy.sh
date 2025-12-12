#!/bin/bash
set -e

# ===========================
# Deployment script for EC2
# ===========================

# Go to the directory where docker-compose.yml is
cd /home/ec2-user/$path_to_docker_compose || exit

echo "🚀 Pulling latest Docker images from ECR..."
# Pull the latest images 
docker pull $ECR_BACKEND_REPO:latest
docker pull $ECR_FRONTEND_REPO:latest

echo "🛑 Stopping any existing containers..."
docker-compose down

echo "⬆️ Starting containers with Docker Compose..."
docker-compose up -d

echo "✅ Deployment complete!"
docker ps
