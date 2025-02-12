# Sistema de Agendamento das Meninas Digitais

### Tecnologias necessarias: 

- Node JS
- PostgresSQL

### Como rodar?

1. Faça o clone do repositorio.
2. Crie um .env nas pastas './backend' e './frontend'

- Conteudo do .env do './backend':
```
POSTGRES_DB=oficina_4nmy
POSTGRES_USER=oficina_4nmy_user
POSTGRES_PASSWORD=8gZrhb7WlpdgtlhFmld5mskcI4V0Q0LY
POSTGRES_HOST=dpg-cujcnol6l47c73d2bbl0-a.oregon-postgres.render.com
PORT=3000
JWT_SECRET=secret
ORIGIN=http://localhost:3001
```

- Conteudo do .env do './frontend':
```
REACT_APP_API_URL=http://localhost:3000
```
   
4. Entre no diretorio './backend' e execute os comandos: ```npm install --force``` e ```npm run dev```.
5. Depois entre no diretorio .'./frontend' e execute o mesmos comandos
