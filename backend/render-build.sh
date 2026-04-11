#!/usr/bin/env bash
# exit on error
set -o errexit

npm install

# Download yt-dlp if it doesn't exist
if ! command -v yt-dlp &> /dev/null
then
    echo "yt-dlp not found, downloading..."
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o ./yt-dlp
    chmod a+rx ./yt-dlp
else
    echo "yt-dlp already installed"
fi

# Note: ffmpeg is often available in some Render images, 
# but if not, it's harder to install without root. 
# We assume it might be available or use a buildpack.
# For now, we focus on making yt-dlp available locally if needed.
