# Build stage
FROM node:20-alpine as build-stage

WORKDIR /app

COPY package*.json ./

# Install dependencies and clean cache
RUN npm install && npm cache clean --force

COPY . .

# Run type check and build
RUN npm run type-check && npm run build

# Production stage
FROM nginx:stable-alpine as production-stage

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
