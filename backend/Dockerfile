FROM node:20-slim

# 1. Install system dependencies
# We need python3 for yt-dlp and ffmpeg for the MP3 conversion
RUN apt-get update && apt-get install -y \
    python3 \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 2. Install the specific LINUX binary for yt-dlp
# Using 'yt-dlp_linux' ensures compatibility with Render's architecture
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

# 3. Setup app directory
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

EXPOSE 5000
CMD ["node", "server.js"]