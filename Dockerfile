# Use a multi-stage build to optimize the final image size

# Stage 1: Build the frontend
FROM node:14 AS frontend-builder
WORKDIR /app
COPY swapify-frontend/package*.json ./
RUN npm install
COPY swapify-frontend/ .
RUN npm run build

# Stage 2: Build the backend
FROM maven:3.8.1-openjdk-11 AS backend-builder
WORKDIR /app
COPY SwapifyAPI/pom.xml ./
COPY SwapifyAPI/src ./src
RUN mvn clean package

# Stage 3: Final image
FROM openjdk:11-jre-slim
WORKDIR /app

# Copy backend
COPY --from=backend-builder /app/target/SwapifyAPI.jar ./SwapifyAPI.jar

# Copy frontend
COPY --from=frontend-builder /app/dist ./frontend

# Expose ports
EXPOSE 8080

# Command to run the application
CMD ["java", "-jar", "SwapifyAPI.jar"]