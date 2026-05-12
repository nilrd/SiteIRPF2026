-- Add contato CRM fields
ALTER TABLE "contatos"
ADD COLUMN IF NOT EXISTS "origem" TEXT NOT NULL DEFAULT 'site',
ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'novo';

-- Support filtered pipeline queries
CREATE INDEX IF NOT EXISTS "contatos_status_idx" ON "contatos"("status");
CREATE INDEX IF NOT EXISTS "contatos_createdAt_idx" ON "contatos"("createdAt");
