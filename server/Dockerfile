# ==============================================================================
# RentNest Backend Server Dockerfile
# Production-ready, lightweight Node.js 20 Alpine container
# ==============================================================================

FROM node:20-alpine AS production

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Expose backend port
EXPOSE 5000

# Set default production runtime environment variables
ENV NODE_ENV=production
ENV PORT=5000
ENV MONGO_URI=mongodb://mongodb:27017/rentnest

# Start server
CMD ["node", "server.js"]
