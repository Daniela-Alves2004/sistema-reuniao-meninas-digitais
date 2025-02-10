# Use a imagem base do Node.js
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json for backend
COPY backend/package*.json ./backend/

# Install backend dependencies
RUN cd backend && npm install --force

# Copy backend code
COPY backend ./backend

# Copy package.json and package-lock.json for frontend
COPY frontend/package*.json ./frontend/

# Install frontend dependencies
RUN cd frontend && npm install --force

# Copy frontend code
COPY frontend ./frontend

# Expose ports for backend and frontend
EXPOSE 3000 3001

# Install concurrently to run both backend and frontend
RUN npm install -g concurrently

# Start both backend and frontend
CMD ["concurrently", "\"cd backend && npm run dev\"", "\"cd frontend && npm run dev\""]