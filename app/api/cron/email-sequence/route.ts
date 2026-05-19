// Sequencia de emails automatica DESABILITADA por decisao do cliente.
// Emails sao enviados apenas no momento do cadastro via formulario (notifyLead).
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ disabled: true }, { status: 410 });
}
