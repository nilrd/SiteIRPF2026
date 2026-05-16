-- AlterTable
ALTER TABLE "blog_posts" ADD COLUMN "post_type" TEXT;
ALTER TABLE "blog_posts" ADD COLUMN "audience" TEXT;
ALTER TABLE "blog_posts" ADD COLUMN "search_intent" TEXT;
ALTER TABLE "blog_posts" ADD COLUMN "fact_score" INTEGER;
ALTER TABLE "blog_posts" ADD COLUMN "risk_score" INTEGER;
ALTER TABLE "blog_posts" ADD COLUMN "needs_review" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "blog_posts" ADD COLUMN "campaign_mode" TEXT;

-- CreateTable
CREATE TABLE "trend_keywords" (
    "id" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "audience" TEXT,
    "intent" TEXT,
    "post_type" TEXT,
    "trend_score" INTEGER,
    "business_score" INTEGER,
    "urgency_score" INTEGER,
    "seo_score" INTEGER,
    "risk_score" INTEGER,
    "breakout_status" BOOLEAN NOT NULL DEFAULT false,
    "geo" TEXT NOT NULL DEFAULT 'BR',
    "related_queries_json" TEXT,
    "cached_until" TIMESTAMP(3) NOT NULL,
    "used_in_post_id" TEXT,
    "raw_payload" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trend_keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_quotas" (
    "id" TEXT NOT NULL,
    "api_name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "calls_used" INTEGER NOT NULL DEFAULT 0,
    "calls_limit" INTEGER NOT NULL DEFAULT 8,
    "month_calls_used" INTEGER NOT NULL DEFAULT 0,
    "month_calls_limit" INTEGER NOT NULL DEFAULT 250,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_quotas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "trend_keywords_keyword_idx" ON "trend_keywords"("keyword");

-- CreateIndex
CREATE INDEX "trend_keywords_category_cached_until_idx" ON "trend_keywords"("category", "cached_until");

-- CreateIndex
CREATE INDEX "trend_keywords_source_created_at_idx" ON "trend_keywords"("source", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "api_quotas_api_name_date_key" ON "api_quotas"("api_name", "date");

-- CreateIndex
CREATE INDEX "api_quotas_api_name_date_idx" ON "api_quotas"("api_name", "date");

-- AddForeignKey
ALTER TABLE "trend_keywords" ADD CONSTRAINT "trend_keywords_used_in_post_id_fkey" FOREIGN KEY ("used_in_post_id") REFERENCES "blog_posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

