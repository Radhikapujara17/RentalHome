# ==============================================================================
# RentNest Frontend Client Multi-Stage Dockerfile
# Stage 1: Build Vite React SPA
# Stage 2: Serve via Nginx Alpine Web Server
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Application
# ------------------------------------------------------------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy client source code
COPY . .

# Build arguments for Vite environment variables
ARG VITE_API_BASE_URL=http://localhost:5000/api/v1
ARG VITE_SOCKET_URL=http://localhost:5000
ARG VITE_DEFAULT_CITY=Rajkot
ARG VITE_DEFAULT_LAT=22.3039
ARG VITE_DEFAULT_LNG=70.8022

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL
ENV VITE_DEFAULT_CITY=$VITE_DEFAULT_CITY
ENV VITE_DEFAULT_LAT=$VITE_DEFAULT_LAT
ENV VITE_DEFAULT_LNG=$VITE_DEFAULT_LNG

# Build production bundle
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Serve via Nginx
# ------------------------------------------------------------------------------
FROM nginx:alpine AS production

# Remove default nginx configuration
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration with SPA routing and gzip
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose standard HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
