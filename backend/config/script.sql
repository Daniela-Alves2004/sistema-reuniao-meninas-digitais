CREATE TABLE "Setor"(
    "id" SERIAL PRIMARY KEY, -- Alterado para SERIAL
    "nome" TEXT NOT NULL
);

CREATE TABLE "Usuario"(
    "id" SERIAL PRIMARY KEY, -- Alterado para SERIAL
    "ra" INTEGER NOT NULL UNIQUE,
    "primeiro_nome" TEXT NOT NULL,
    "ultimo_nome" TEXT NOT NULL,
    "papel" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "telefone" TEXT,
    "senha" TEXT NOT NULL,
    "id_setor" INTEGER, -- Alterado para INTEGER (correspondente ao SERIAL)
    FOREIGN KEY ("id_setor") REFERENCES "Setor"("id")
);

CREATE TABLE "Local"(
    "id" SERIAL PRIMARY KEY, -- Alterado para SERIAL
    "tipo" TEXT NOT NULL,
    "link" TEXT,
    "sala" TEXT
);

CREATE TABLE "Reuniao"(
    "id" SERIAL PRIMARY KEY, -- Alterado para SERIAL
    "data_reuniao" DATE NOT NULL,
    "data_criacao" DATE NOT NULL,
    "pauta" TEXT NOT NULL,
    "id_local" INTEGER NOT NULL, -- Alterado para INTEGER (correspondente ao SERIAL)
    FOREIGN KEY ("id_local") REFERENCES "Local"("id")
);

CREATE TABLE "Participacao"(
    "id" SERIAL PRIMARY KEY, -- Alterado para SERIAL
    "id_usuario" INTEGER NOT NULL, -- Alterado para INTEGER (correspondente ao SERIAL)
    "id_reuniao" INTEGER NOT NULL, -- Alterado para INTEGER (correspondente ao SERIAL)
    "presente" BOOLEAN NOT NULL,
    FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id"),
    FOREIGN KEY ("id_reuniao") REFERENCES "Reuniao"("id")
);

CREATE TABLE "Ata"(
    "id" SERIAL PRIMARY KEY, -- Alterado para SERIAL
    "conteudo" BYTEA NOT NULL,
    "arquivos" BYTEA,
    "id_usuario" INTEGER NOT NULL, -- Alterado para INTEGER (correspondente ao SERIAL)
    FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id")
);

CREATE TABLE "Relatorio"(
    "id" SERIAL PRIMARY KEY, -- Alterado para SERIAL
    "data_criacao" DATE NOT NULL,
    "tipo_relatorio" TEXT NOT NULL,
    "conteudo" BYTEA NOT NULL,
    "id_usuario" INTEGER NOT NULL, -- Alterado para INTEGER (correspondente ao SERIAL)
    FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id")
);

CREATE TABLE "Convite"(
    "id" SERIAL PRIMARY KEY, -- Alterado para SERIAL
    "id_reuniao" INTEGER NOT NULL, -- Alterado para INTEGER (correspondente ao SERIAL)
    "id_usuario" INTEGER NOT NULL, -- Alterado para INTEGER (correspondente ao SERIAL)
    FOREIGN KEY ("id_reuniao") REFERENCES "Reuniao"("id"),
    FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id")
);

-- Insira os dados iniciais

INSERT INTO "Setor" ("nome") VALUES ('Marketing');
INSERT INTO "Setor" ("nome") VALUES ('Gestão de Pessoas');
INSERT INTO "Setor" ("nome") VALUES ('Conteúdo');
INSERT INTO "Setor" ("nome") VALUES ('Instrutores');
INSERT INTO "Setor" ("nome") VALUES ('Professores');

INSERT INTO "Usuario" ("ra", "primeiro_nome", "ultimo_nome", "papel", "email", "telefone", "senha", "id_setor") VALUES (2465710, 'Brena', 'Santos', 'Lider', 'brenas@gmail.com', '11999999999', 'brena123', 1);
INSERT INTO "Usuario" ("ra", "primeiro_nome", "ultimo_nome", "papel", "email", "telefone", "senha", "id_setor") VALUES (123457, 'João', 'Botter', 'Membro', 'joao@gmail.com', '11999999999', '123456', 2);
INSERT INTO "Usuario" ("ra", "primeiro_nome", "ultimo_nome", "papel", "email", "telefone", "senha", "id_setor") VALUES (123458, 'Rosangela', 'Marquesone', 'Professora', 'rosagenla@gmail.com', '11999999999', '123456', 5);

INSERT INTO "Local" ("tipo", "link", "sala") VALUES ('Remoto', 'https://meet.google.com/abc-123', null);
INSERT INTO "Local" ("tipo", "link", "sala") VALUES ('Remoto', 'https://meet.google.com/abc-321', null);
INSERT INTO "Local" ("tipo", "link", "sala") VALUES ('Remoto', 'https://meet.google.com/abc-231', null);
INSERT INTO "Local" ("tipo", "link", "sala") VALUES ('Presencial', null, 'Sala K002');
INSERT INTO "Local" ("tipo", "link", "sala") VALUES ('Presencial', null, 'Sala K003');

INSERT INTO "Reuniao" ("data_reuniao", "data_criacao", "pauta", "id_local") VALUES ('2025-01-18\', '2025-01-17\', 'Reunião de Marketing\', 1);
INSERT INTO "Reuniao" ("data_reuniao", "data_criacao", "pauta", "id_local") VALUES ('2025-01-19\', '2025-01-18\', 'Reunião de Gestão de Pessoas\', 2);
INSERT INTO "Reuniao" ("data_reuniao", "data_criacao", "pauta", "id_local") VALUES ('2025-01-20\', '2025-01-18\', 'Reunião de Conteúdo\', 3);
INSERT INTO "Reuniao" ("data_reuniao", "data_criacao", "pauta", "id_local") VALUES ('2025-01-21\', '2025-01-18\', 'Reunião de Instrutores\', 4);
INSERT INTO "Reuniao" ("data_reuniao", "data_criacao", "pauta", "id_local") VALUES ('2025-01-22\', '2025-01-18\', 'Reunião de Professores\', 5);
