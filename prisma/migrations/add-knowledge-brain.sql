-- Migration: add-knowledge-brain
-- Executar no Supabase SQL Editor: https://supabase.com/dashboard/project/*/sql
-- Cria tabelas KnowledgeBase (cérebro persistente) e KeywordHistory (histórico de keywords)

-- Tabela KnowledgeBase: memória persistente de fontes oficiais e notícias
CREATE TABLE IF NOT EXISTS "knowledge_base" (
    "id"          TEXT NOT NULL,
    "sourceUrl"   TEXT NOT NULL,
    "sourceTitle" TEXT,
    "content"     TEXT NOT NULL,
    "category"    TEXT NOT NULL,
    "year"        INTEGER,
    "fetchedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt"   TIMESTAMP(3) NOT NULL,
    "isActive"    BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "knowledge_base_pkey" PRIMARY KEY ("id")
);

-- Index para busca por categoria/ano/ativo
CREATE INDEX IF NOT EXISTS "knowledge_base_category_year_isActive_idx"
    ON "knowledge_base"("category", "year", "isActive");

-- Unique: não duplicar mesma URL+categoria
CREATE UNIQUE INDEX IF NOT EXISTS "knowledge_base_sourceUrl_category_key"
    ON "knowledge_base"("sourceUrl", "category");

-- Tabela KeywordHistory: histórico de keywords usadas (evita repetição 7 dias)
CREATE TABLE IF NOT EXISTS "keyword_history" (
    "id"      TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "cluster" TEXT NOT NULL,
    "postId"  TEXT,
    "usedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "keyword_history_pkey" PRIMARY KEY ("id")
);

-- Index para busca por data e keyword
CREATE INDEX IF NOT EXISTS "keyword_history_usedAt_idx"
    ON "keyword_history"("usedAt");

CREATE INDEX IF NOT EXISTS "keyword_history_keyword_idx"
    ON "keyword_history"("keyword");
