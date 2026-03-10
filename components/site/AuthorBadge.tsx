import Link from "next/link";

interface AuthorBadgeProps {
  readTime?: number;
  publishedAt?: string | Date;
}

export default function AuthorBadge({ readTime, publishedAt }: AuthorBadgeProps) {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  const isoDate =
    publishedAt instanceof Date
      ? publishedAt.toISOString()
      : publishedAt ?? undefined;

  return (
    <div className="flex items-center gap-4 py-4 border-y border-gray-200 my-6">
      <div
        className="w-10 h-10 rounded-full overflow-hidden bg-verde flex items-center justify-center flex-shrink-0"
        aria-hidden="true"
      >
        <span className="text-white font-bold text-sm">NB</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/sobre"
            className="font-semibold text-sm hover:text-verde transition-colors"
            rel="author"
          >
            Nilson Brites
          </Link>
          <span className="text-xs opacity-40" aria-hidden="true">·</span>
          <span className="text-xs opacity-60">Analista Financeiro · Especialista IRPF</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {formattedDate && (
            <time dateTime={isoDate} className="text-xs opacity-50">
              {formattedDate}
            </time>
          )}
          {readTime && readTime > 0 && (
            <>
              <span className="text-xs opacity-40" aria-hidden="true">·</span>
              <span className="text-xs opacity-50">{readTime} min de leitura</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
