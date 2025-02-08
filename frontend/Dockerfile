# frontend/Dockerfile
FROM node:16

# Define o diretório de trabalho
WORKDIR /app

# Copia o package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código, incluindo wait-for-it.sh
COPY . .

# Dá permissão de execução ao wait-for-it.sh
RUN chmod +x wait-for-it.sh

# Expõe a porta 3000
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["./wait-for-it.sh", "backend:3000", "--", "npm", "start"]