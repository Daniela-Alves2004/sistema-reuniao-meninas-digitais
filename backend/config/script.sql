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

INSERT INTO "Setor" ("nome") VALUES ('Marketing');

-- Insira 10 reunioes com datas diferentes

INSERT INTO "Local" ("tipo", "link", "sala") VALUES ('Presencial', null, 'Sala 1');
INSERT INTO "Local" ("tipo", "link", "sala") VALUES ('Presencial', null, 'Sala 2');
INSERT INTO "Local" ("tipo", "link", "sala") VALUES ('Presencial', null, 'Sala 3');

INSERT INTO "Reuniao" ("data_reuniao", "data_criacao", "pauta", "id_local") VALUES ('2025-01-18', '2025-01-01', 'Pauta 11', 1);
INSERT INTO "Reuniao" ("data_reuniao", "data_criacao", "pauta", "id_local") VALUES ('2025-01-20', '2025-01-01', 'Pauta 12', 2);
INSERT INTO "Reuniao" ("data_reuniao", "data_criacao", "pauta", "id_local") VALUES ('2025-01-22', '2025-01-01', 'Pauta 13', 3);
INSERT INTO "Reuniao" ("data_reuniao", "data_criacao", "pauta", "id_local") VALUES ('2025-01-25', '2025-01-01', 'Pauta 14', 1);
INSERT INTO "Reuniao" ("data_reuniao", "data_criacao", "pauta", "id_local") VALUES ('2025-01-28', '2025-01-01', 'Pauta 15', 2);
INSERT INTO "Reuniao" ("data_reuniao", "data_criacao", "pauta", "id_local") VALUES ('2025-01-30', '2025-01-01', 'Pauta 16', 3);

