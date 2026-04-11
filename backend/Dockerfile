# Use a lightweight Node.js image
FROM node:20-slim

# Install system dependencies (Python is REQUIRED for yt-dlp)
RUN apt-get update && apt-get install -y \
    python3 \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Download the specific LINUX-optimized binary
# We save it to /usr/bin/ which is guaranteed to be in the PATH
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux -o /usr/bin/yt-dlp \
    && chmod a+rx /usr/bin/yt-dlp

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

# Ensure we are using the correct entry point
CMD ["node", "server.js"]