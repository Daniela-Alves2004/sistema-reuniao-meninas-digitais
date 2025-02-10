# Use a imagem base do Node.js
FROM node:18

# Definir o diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json para o backend
COPY backend/package*.json ./backend/

# Instalar dependências do backend
RUN cd backend && npm install --force

# Copiar o código do backend
COPY backend ./backend

# Copiar package.json e package-lock.json para o frontend
COPY frontend/package*.json ./frontend/

# Limpar cache do npm e instalar dependências do frontend, incluindo o plugin Babel
RUN cd frontend && npm cache clean --force \
    && npm install --force \
    && npm install --save-dev @babel/plugin-proposal-private-property-in-object

# Copiar o código do frontend
COPY frontend ./frontend

# Expor portas para backend e frontend
EXPOSE 3000 3001

# Instalar o `concurrently` globalmente para rodar backend e frontend juntos
RUN npm install -g concurrently

# Aumentar o limite de memória para evitar falha de build
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Iniciar tanto o backend quanto o frontend
CMD ["concurrently", "\"cd backend && npm run dev\"", "\"cd frontend && npm run dev\""]
