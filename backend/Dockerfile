FROM nikolaik/python-nodejs:python3.11-nodejs20

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Set working directory
WORKDIR /app

# Copy package files and requirements
COPY package*.json ./
COPY requirements.txt ./

# Install Node and Python dependencies
RUN npm install
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 3000

# Start the Node.js server
CMD ["npm", "start"]
