# Use a smaller base image for production
# FROM node:lts-alpine

# For development, you can use a larger image with additional tools if needed
FROM node:lts

WORKDIR /app

# Copy package.json and package-lock.json separately to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port
EXPOSE 3000

# Health check (optional but recommended)
# HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:3000 || exit 1

# Command to run the application
CMD ["npm", "start"]
