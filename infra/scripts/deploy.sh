#!/bin/bash
set -e

# ===========================
# Deployment script for EC2
# ===========================

# Go to the directory where docker-compose.yml is
cd /home/ec2-user/Hero-blog-project || exit

echo "🚀 Pulling latest Docker images from ECR..."
# Pull the latest images 
docker pull 137345587313.dkr.ecr.eu-north-1.amazonaws.com/hero-backend:latest
docker pull 137345587313.dkr.ecr.eu-north-1.amazonaws.com/hero-frontend:latest

echo "🛑 Stopping any existing containers..."
docker-compose down

echo "⬆️ Starting containers with Docker Compose..."
docker-compose up -d

echo "✅ Deployment complete!"
docker ps
