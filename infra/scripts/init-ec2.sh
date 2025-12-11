#!/bin/bash
# This script sets up an EC2 instance with Docker, Docker Compose, git, and curl
# Ready to run your Hero Blog project

set -e  # exit immediately if a command fails

echo "🛠 Updating system packages..."
sudo dnf update -y

echo "🐳 Installing Docker..."
sudo dnf install -y docker

echo "✅ Enabling and starting Docker service..."
sudo systemctl enable docker
sudo systemctl start docker

echo "🔧 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/v2.26.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

echo "📝 Installing git and curl..."
sudo dnf install -y git curl

echo "🎉 Setup complete!"
echo "You can now clone your project, build images, and run docker-compose."
