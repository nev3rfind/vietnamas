FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    && rm -rf /var/cache/apk/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Expose port for Vite dev server
EXPOSE 5173

# For development
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]