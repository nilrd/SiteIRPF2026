import { prisma } from "@/lib/prisma";

type StartAutomationRunParams = {
  automationKey: string;
  trigger?: string;
  metadata?: Record<string, unknown>;
};

type FinishAutomationRunParams = {
  generatedCount: number;
  publishedCount: number;
  retainedCount: number;
  errorCount: number;
  durationMs?: number;
  metadata?: Record<string, unknown>;
};

function getRunStatus({ generatedCount, retainedCount, errorCount }: FinishAutomationRunParams) {
  if (generatedCount === 0 && errorCount > 0) return "failed";
  if (errorCount > 0 || retainedCount > 0) return "partial";
  return "success";
}

export async function startAutomationRun({
  automationKey,
  trigger = "cron",
  metadata = {},
}: StartAutomationRunParams) {
  return prisma.automationRun.create({
    data: {
      automationKey,
      trigger,
      status: "started",
      metadataJson: JSON.stringify(metadata),
    },
    select: {
      id: true,
      startedAt: true,
    },
  });
}

export async function finishAutomationRun(
  runId: string,
  { generatedCount, publishedCount, retainedCount, errorCount, durationMs, metadata = {} }: FinishAutomationRunParams
) {
  const finishedAt = new Date();

  return prisma.automationRun.update({
    where: { id: runId },
    data: {
      status: getRunStatus({ generatedCount, publishedCount, retainedCount, errorCount }),
      finishedAt,
      durationMs,
      generatedCount,
      publishedCount,
      retainedCount,
      errorCount,
      metadataJson: JSON.stringify(metadata),
    },
  });
}

export async function failAutomationRun(runId: string, error: unknown, metadata: Record<string, unknown> = {}) {
  const message = error instanceof Error ? error.message : String(error);

  return prisma.automationRun.update({
    where: { id: runId },
    data: {
      status: "failed",
      finishedAt: new Date(),
      errorCount: 1,
      metadataJson: JSON.stringify({
        ...metadata,
        fatalError: message,
      }),
    },
  });
}