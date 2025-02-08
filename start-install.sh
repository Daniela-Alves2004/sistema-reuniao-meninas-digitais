#!/bin/bash

# Script bash para instalar dependências e abrir dois terminais para executar os servidores

# Instalar dependências no backend
echo "Instalando dependências no backend..."
cd ~/Documentos/GitHub/sistema-reuniao-meninas-digitais/backend
npm install

# Instalar dependências no frontend
echo "Instalando dependências no frontend..."
cd ../frontend
npm install

# Voltar para o diretório principal
cd ..

# Abrir dois terminais para executar os servidores
echo "Iniciando servidores em terminais separados..."
gnome-terminal -- bash -c "cd backend && npm run dev; exec bash"
sleep 2
gnome-terminal -- bash -c "cd frontend && npm run dev; exec bash"

echo "Servidores iniciados."
