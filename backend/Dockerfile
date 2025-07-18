# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the backend code
COPY . .

# Expose the port NestJS uses
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start:dev"]
