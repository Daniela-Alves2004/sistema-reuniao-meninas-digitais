#!/bin/bash

# Script bash para instalar dependências e iniciar servidores

# Instalar dependências no backend
echo "Instalando dependências no backend..."
cd /opt/render/project/src/backend || exit
npm install

# Instalar dependências no frontend
echo "Instalando dependências no frontend..."
cd ../frontend || exit
npm install

# Iniciar backend
echo "Iniciando backend..."
cd ../backend || exit
npm run dev &

# Iniciar frontend
echo "Iniciando frontend..."
cd ../frontend || exit
npm run dev &
