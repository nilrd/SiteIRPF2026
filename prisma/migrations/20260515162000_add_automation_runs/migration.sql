CREATE TABLE IF NOT EXISTS "automation_runs" (
  "id" TEXT NOT NULL,
  "automation_key" TEXT NOT NULL,
  "trigger" TEXT NOT NULL DEFAULT 'cron',
  "status" TEXT NOT NULL DEFAULT 'started',
  "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "finished_at" TIMESTAMP(3),
  "duration_ms" INTEGER,
  "generated_count" INTEGER NOT NULL DEFAULT 0,
  "published_count" INTEGER NOT NULL DEFAULT 0,
  "retained_count" INTEGER NOT NULL DEFAULT 0,
  "error_count" INTEGER NOT NULL DEFAULT 0,
  "metadata_json" TEXT NOT NULL DEFAULT '{}',

  CONSTRAINT "automation_runs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "automation_runs_automation_key_started_at_idx"
  ON "automation_runs"("automation_key", "started_at");

CREATE INDEX IF NOT EXISTS "automation_runs_status_started_at_idx"
  ON "automation_runs"("status", "started_at");