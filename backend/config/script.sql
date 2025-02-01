CREATE TABLE "Setor"(
    "id" SERIAL PRIMARY KEY, 
    "nome" TEXT NOT NULL
);

CREATE TABLE "Usuario"(
    "id" SERIAL PRIMARY KEY, 
    "ra" INTEGER NOT NULL UNIQUE,
    "primeiro_nome" TEXT NOT NULL,
    "ultimo_nome" TEXT NOT NULL,
    "papel" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "telefone" TEXT,
    "senha" TEXT NOT NULL,
    "id_setor" INTEGER, 
    FOREIGN KEY ("id_setor") REFERENCES "Setor"("id")
);

CREATE TABLE "Local"(
    "id" SERIAL PRIMARY KEY, 
    "tipo" TEXT NOT NULL,
    "link" TEXT,
    "sala" TEXT
);

CREATE TABLE "Reuniao"(
    "id" SERIAL PRIMARY KEY, 
    "data_reuniao" DATE NOT NULL,
    "hora_reuniao" TIME NOT NULL,
    "data_criacao" DATE NOT NULL,
    "pauta" TEXT NOT NULL,
    "id_local" INTEGER NOT NULL, 
    FOREIGN KEY ("id_local") REFERENCES "Local"("id")
);

CREATE TABLE "Participacao"(
    "id" SERIAL PRIMARY KEY, 
    "id_usuario" INTEGER NOT NULL, 
    "id_reuniao" INTEGER NOT NULL, 
    "presente" BOOLEAN NOT NULL,
    FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id"),
    FOREIGN KEY ("id_reuniao") REFERENCES "Reuniao"("id")
);

CREATE TABLE "Ata"(
    "id" SERIAL PRIMARY KEY, 
    "conteudo" TEXT NOT NULL,
    "id_reuniao" INTEGER NOT NULL,
    FOREIGN KEY ("id_reuniao") REFERENCES "Reuniao"("id")
);

CREATE TABLE "Relatorio"(
    "id" SERIAL PRIMARY KEY, 
    "data_criacao" DATE NOT NULL,
    "tipo_relatorio" TEXT NOT NULL,
    "conteudo" BYTEA NOT NULL,
    "id_usuario" INTEGER NOT NULL, 
    FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id")
);

CREATE TABLE "Convite"(
    "id" SERIAL PRIMARY KEY, 
    "id_reuniao" INTEGER NOT NULL, 
    "id_usuario" INTEGER NOT NULL, 
    FOREIGN KEY ("id_reuniao") REFERENCES "Reuniao"("id"),
    FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id")
);

-- Insira os dados iniciais

INSERT INTO "Setor" ("nome") VALUES ('Marketing');
INSERT INTO "Setor" ("nome") VALUES ('Gestão de Pessoas');
INSERT INTO "Setor" ("nome") VALUES ('Conteúdo');
INSERT INTO "Setor" ("nome") VALUES ('Instrutores');
INSERT INTO "Setor" ("nome") VALUES ('Coordenação');

INSERT INTO "Usuario" ("ra", "primeiro_nome", "ultimo_nome", "papel", "email", "telefone", "senha", "id_setor") VALUES (2465710, 'Brena', 'Santos', 'Lider', 'brenas@gmail.com', '11999999999', 'brena123', 1);
INSERT INTO "Usuario" ("ra", "primeiro_nome", "ultimo_nome", "papel", "email", "telefone", "senha", "id_setor") VALUES (1234578, 'João', 'Botter', 'Membro', 'joao@gmail.com', '11999999999', '123456', 2);
INSERT INTO "Usuario" ("ra", "primeiro_nome", "ultimo_nome", "papel", "email", "telefone", "senha", "id_setor") VALUES (1234589, 'Rosangela', 'Marquesone', 'Coordenadora', 'rosangela@gmail.com', '11999999999', '123456', 5);
INSERT INTO "Usuario" ("ra", "primeiro_nome", "ultimo_nome", "papel", "email", "telefone", "senha", "id_setor") VALUES (2476568, 'Maria Fernanda', 'Aguiar', 'Lider', 'mariaf@gmail.com', '11999999999', 'maria123', 3);
INSERT INTO "Usuario" ("ra", "primeiro_nome", "ultimo_nome", "papel", "email", "telefone", "senha", "id_setor") VALUES (2209977, 'Julia', 'Lucena', 'Lider', 'julial@gmail.com', '11999999999', 'julia123', 4);
INSERT INTO "Usuario" ("ra", "primeiro_nome", "ultimo_nome", "papel", "email", "telefone", "senha", "id_setor") VALUES (2143364, 'Maria Gabriella', 'Victor', 'Lider', 'maga@gmail.com', '11999999999', 'maga123', 1);
INSERT INTO "Usuario" ("ra", "primeiro_nome", "ultimo_nome", "papel", "email", "telefone", "senha", "id_setor") VALUES (2454319, 'Carlos', 'Yamanaka', 'Membro', 'carlosy@gmail.com', '11999999999', 'carlos123', 2);
INSERT INTO "Usuario" ("ra", "primeiro_nome", "ultimo_nome", "papel", "email", "telefone", "senha", "id_setor") VALUES (2410320, 'Mariana', 'de Oliveira', 'Membro', 'marianado@gmail.com', '11999999999', 'mariana123', 3);


INSERT INTO "Local" ("tipo", "link", "sala") VALUES ('Remoto', 'https://meet.google.com/abc-123', null);
INSERT INTO "Local" ("tipo", "link", "sala") VALUES ('Remoto', 'https://meet.google.com/abc-321', null);
INSERT INTO "Local" ("tipo", "link", "sala") VALUES ('Remoto', 'https://meet.google.com/abc-231', null);
INSERT INTO "Local" ("tipo", "link", "sala") VALUES ('Presencial', null, 'Sala K002');
INSERT INTO "Local" ("tipo", "link", "sala") VALUES ('Presencial', null, 'Sala K003');

INSERT INTO "Reuniao" ("data_reuniao", "hora_reuniao", "data_criacao", "pauta", "id_local") 
VALUES ('2025-01-28', '14:00', '2025-01-18', 'Estratégias Digitais para 2025: O Futuro do Marketing de Influência e as Tendências Emergentes', 1);

INSERT INTO "Reuniao" ("data_reuniao", "hora_reuniao", "data_criacao", "pauta", "id_local") 
VALUES ('2025-01-29', '15:00', '2025-01-19', 'Cultura Organizacional: O Papel da Liderança na Criação de Ambientes Inclusivos e Inovadores', 2);

INSERT INTO "Reuniao" ("data_reuniao", "hora_reuniao", "data_criacao", "pauta", "id_local") 
VALUES ('2025-01-30', '16:00', '2025-01-20', 'Narrativas Visuais: O Poder dos Stories e Vídeos na Construção de Conteúdo Interativo', 3);

INSERT INTO "Reuniao" ("data_reuniao", "hora_reuniao", "data_criacao", "pauta", "id_local") 
VALUES ('2025-01-31', '17:00', '2025-01-21', 'Gamificação no Ensino: Transformando Aulas em Experiências Interativas e Engajantes', 4);
