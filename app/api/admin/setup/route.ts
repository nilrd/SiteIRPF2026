import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // Só funciona se não existir nenhum admin cadastrado (segurança)
    const count = await prisma.adminUser.count();
    if (count > 0) {
      return NextResponse.json(
        { error: "Setup ja realizado." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { username, password, name, setupKey } = body;

    // Chave de setup obrigatória (definida na env SETUP_KEY)
    const expectedKey = process.env.SETUP_KEY;
    if (!expectedKey || setupKey !== expectedKey) {
      return NextResponse.json({ error: "Chave invalida." }, { status: 401 });
    }

    if (!username || !password || password.length < 8) {
      return NextResponse.json(
        { error: "Usuario e senha (min 8 chars) obrigatorios." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const admin = await prisma.adminUser.create({
      data: {
        username: String(username).trim(),
        passwordHash,
        name: String(name || username).trim(),
        active: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Admin criado com sucesso.",
      username: admin.username,
    });
  } catch (error) {
    console.error("Admin setup error:", error);
    return NextResponse.json(
      { error: "Erro interno." },
      { status: 500 }
    );
  }
}
