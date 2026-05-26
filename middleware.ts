import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAINS = new Set(["qaplay.com.br", "www.qaplay.com.br"]);
const TARGET_HOST = "irpf.qaplay.com.br";

export default function middleware(request: NextRequest) {
  const rawHostHeader =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    request.nextUrl.host;
  const host = rawHostHeader
    .split(",")[0]
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "");

  if (host && ROOT_DOMAINS.has(host)) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = TARGET_HOST;

    // Redirecionamento temporário para o domínio principal do projeto IRPF.
    return NextResponse.redirect(url, 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
