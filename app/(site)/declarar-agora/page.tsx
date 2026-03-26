import type { Metadata } from "next";
import DeclaracaoLandingClient from "./DeclaracaoLandingClient";

export const metadata: Metadata = {
  title: "Declare seu IRPF 2026 Agora — Prazo: 29 de Maio",
  description:
    "Declare seu Imposto de Renda 2026 com segurança e sem complicação. Especialista com 10+ anos, 100% online, entrega em 24h. Prazo IRPF 2026: 29 de maio. Evite multa mínima de R$ 165,74.",
  keywords: [
    "declarar IRPF 2026",
    "declaração imposto de renda online",
    "prazo IRPF 2026",
    "como declarar IR 2026",
    "malha fina imposto de renda",
    "multa IRPF 2026",
    "declaração atrasada IR",
    "retificação imposto de renda",
  ],
  openGraph: {
    title: "Declare seu IRPF 2026 — Prazo 29 de Maio | Consultoria Nilson Brites",
    description:
      "Declarações novas, atrasadas e retificações. Atendimento 100% online, todo Brasil. Entrega em 24h.",
    url: "https://irpf.qaplay.com.br/declarar-agora",
  },
};

export default function DeclaracaoAgoraPage() {
  return <DeclaracaoLandingClient />;
}
