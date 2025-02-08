#!/bin/bash

# Script bash para abrir dois terminais e executar comandos
gnome-terminal -- bash -c "cd ~/Documentos/GitHub/sistema-reuniao-meninas-digitais/backend && npm run dev; exec bash"
sleep 2
gnome-terminal -- bash -c "cd ~/Documentos/GitHub/sistema-reuniao-meninas-digitais/frontend && npm run dev; exec bash"
