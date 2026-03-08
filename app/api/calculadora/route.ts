import { NextResponse } from "next/server";
import { z } from "zod";
import { calcularIR } from "@/lib/ir-calculations";

export const dynamic = "force-dynamic";

const schema = z.object({
  rendaBrutaAnual: z.number().min(0),
  numeroDependentes: z.number().int().min(0).default(0),
  inssPago: z.number().min(0).default(0),
  gastosSaude: z.number().min(0).default(0),
  gastosEducacao: z.number().min(0).default(0),
  irRetidoFonte: z.number().min(0).default(0),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const resultado = calcularIR(data);

    return NextResponse.json({ success: true, ...resultado });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados invalidos", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Calculadora API error:", error);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}
