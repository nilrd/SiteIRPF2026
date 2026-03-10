import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const alt = "Artigo — Consultoria IRPF NSB";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  let title = "Blog · Consultoria IRPF NSB";
  let tag = "IRPF";

  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
      select: { title: true, tags: true },
    });
    if (post) {
      title = post.title;
      tag = post.tags?.[0] ?? "IRPF";
    }
  } catch {
    // usa defaults
  }

  const displayTitle = title.length > 80 ? title.slice(0, 80) + "..." : title;
  const fontSize = displayTitle.length > 60 ? 42 : 50;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "#2D4033",
        }}
      >
        {/* Tag badge */}
        <div style={{ display: "flex" }}>
          <div
            style={{
              background: "#C9A84C",
              color: "#1A1A1A",
              padding: "6px 18px",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            {tag}
          </div>
        </div>

        {/* Título */}
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            paddingTop: "24px",
            paddingBottom: "24px",
          }}
        >
          <div
            style={{
              color: "#F9F7F2",
              fontSize: `${fontSize}px`,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              maxWidth: "1000px",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {displayTitle}
          </div>
        </div>

        {/* Rodapé com branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(249,247,242,0.2)",
            paddingTop: "24px",
          }}
        >
          <div
            style={{
              color: "rgba(249,247,242,0.75)",
              fontSize: "18px",
              fontWeight: 600,
              letterSpacing: "0.04em",
              display: "flex",
            }}
          >
            Consultoria IRPF NSB
          </div>
          <div
            style={{
              color: "rgba(249,247,242,0.4)",
              fontSize: "15px",
              display: "flex",
            }}
          >
            irpf.qaplay.com.br
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
