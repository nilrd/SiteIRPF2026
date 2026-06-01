import { NextRequest, NextResponse } from "next/server";

// NOTA: O domínio qaplay.com.br tem seu próprio deployment na Vercel (qaplay_prod).
// O redirect foi removido para que cada domínio sirva conteúdo próprio.
// www.qaplay.com.br → qaplay.com.br deve ser configurado nas settings de domínio da Vercel.

export default function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
