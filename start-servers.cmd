@echo off
start cmd /k "cd /d C:\Users\micae\OneDrive\Documentos\GitHub\sistema-reuniao-meninas-digitais\backend && npm run dev"
timeout /t 2 /nobreak >nul
start cmd /k "cd /d C:\Users\micae\OneDrive\Documentos\GitHub\sistema-reuniao-meninas-digitais\frontend && npm run dev && Y"
