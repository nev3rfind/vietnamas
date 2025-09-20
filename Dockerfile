FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    && rm -rf /var/cache/apk/*

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Expose port for Vite dev server
EXPOSE 5173

# For development, run dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]