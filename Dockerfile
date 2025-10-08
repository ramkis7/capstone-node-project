# Use Node.js 20 lightweight version as base image
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose port 3000 for the application
EXPOSE 3000

# Start the Node.js application
CMD ["node", "index.js"]
