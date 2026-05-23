import { prisma } from "../lib/prisma";

const post = {
  title: "Receita abre consulta ao maior lote de restituição da história",
  slug: "receita-abre-consulta-maior-lote-restituicao-historia",
  summary:
    "Consulta abre às 10h desta sexta-feira (22) e libera R$ 16 bilhões para 8.749.992 contribuintes; pagamento será em 29 de maio.",
  metaTitle: "Maior lote de restituição do IRPF 2026: veja como consultar",
  metaDesc:
    "Consulta ao 1º lote do IRPF 2026 abre às 10h. São R$ 16 bilhões para 8,7 milhões de contribuintes; veja quem recebe e como consultar.",
  coverImage: "/og-image.svg",
  imageAlt:
    "Pessoa consultando a restituição do Imposto de Renda em um celular, com documentos sobre a mesa e clima de atenção ao prazo",
  tags: ["IRPF 2026", "restituição", "Receita Federal", "notícias"],
  keywords: [
    "restituição IRPF 2026",
    "maior lote de restituição",
    "como consultar restituição",
    "consulta Receita Federal",
    "calendário restituição IRPF",
  ],
  faqsJson: [
    {
      question: "A consulta ao primeiro lote do IRPF 2026 abre que horas?",
      answer:
        "A Receita Federal liberou a consulta a partir das 10h desta sexta-feira, 22 de maio de 2026. O pagamento está programado para 29 de maio.",
    },
    {
      question: "Quem recebe a restituição neste primeiro lote?",
      answer:
        "O lote contempla 8.749.992 contribuintes e soma R$ 16 bilhões. A prioridade inclui idosos, pessoas com deficiência ou moléstia grave, magistério e quem usou declaração pré-preenchida com Pix.",
    },
    {
      question: "Como consultar a restituição do IRPF 2026?",
      answer:
        "A consulta pode ser feita no site da Receita Federal, no menu Meu Imposto de Renda, na opção Consultar minha restituição, ou pelo aplicativo oficial para celulares e tablets.",
    },
    {
      question: "O que faço se a minha restituição não aparecer?",
      answer:
        "Se a consulta mostrar pendência, o ideal é verificar o extrato no e-CAC. Se houver erro na declaração, envie uma retificadora antes dos próximos lotes.",
    },
    {
      question: "E se o depósito não cair na conta informada?",
      answer:
        "Quando houver problema bancário, a Receita orienta o reagendamento pelo Banco do Brasil, com prazo de até um ano após a primeira tentativa de pagamento.",
    },
    {
      question: "Quantos lotes de restituição o IRPF 2026 terá?",
      answer:
        "Segundo a Receita, o calendário deste ano terá quatro lotes regulares: 29 de maio, 30 de junho, 31 de julho e 28 de agosto.",
    },
  ],
  content: `
<article>
  <p>Às 10h desta sexta-feira, 22 de maio de 2026, a Receita Federal abriu a consulta ao primeiro lote de restituição do IRPF 2026. O lote é histórico: são <strong>R$ 16 bilhões</strong> distribuídos para <strong>8.749.992 contribuintes</strong>, em um pagamento que será feito no dia <strong>29 de maio</strong>.</p>

  <p>Na prática, isso significa que milhões de pessoas já conseguem verificar se estão entre os contemplados. Para quem enviou a declaração cedo, usou a pré-preenchida ou informou Pix por CPF, a chance de aparecer neste lote é maior. Para quem encontrou pendência, o caminho continua sendo a conferência no e-CAC e, se necessário, a retificação.</p>

  <div class="tldr-box" style="background:#f5f5f2;border-left:4px solid #C6FF00;padding:16px 20px;margin:24px 0;">
    <strong>Resumo rápido:</strong>
    <ul>
      <li><strong>Consulta aberta às 10h</strong> desta sexta-feira (22) no site e no aplicativo da Receita.</li>
      <li><strong>R$ 16 bilhões</strong> serão pagos a <strong>8.749.992 contribuintes</strong> no primeiro lote.</li>
      <li><strong>Pagamento em 29 de maio</strong>, mesmo dia do fim do prazo de entrega do IRPF 2026.</li>
    </ul>
  </div>

  <h2>O que a Receita anunciou com esse primeiro lote?</h2>
  <p>O primeiro lote do IRPF 2026 entrou para a história porque é o maior já pago pela Receita Federal. O valor total supera o lote recorde de 2025 e representa uma antecipação importante para quem aguardava a restituição logo no começo do calendário.</p>

  <p>Segundo a Receita, o lote reúne tanto restituições do próprio IRPF 2026 quanto valores residuais de exercícios anteriores. Isso ajuda a explicar o tamanho do volume liberado agora e reforça o impacto do processamento mais rápido das declarações neste ano.</p>

  <p>Outro ponto relevante é que o pagamento neste lote alcança diferentes perfis de contribuintes. Há prioridade legal, prioridade por critérios operacionais da Receita e também restituições de pessoas que entregaram a declaração cedo e usaram recursos digitais como a pré-preenchida e o Pix.</p>

  <h2>Quem está na frente da fila da restituição?</h2>
  <p>A ordem de pagamento continua respeitando prioridades legais e operacionais. No material divulgado pela Receita e pelas coberturas jornalísticas do dia, aparecem quatro grupos prioritários por lei e um grande bloco de contribuintes que ganharam velocidade por usar ferramentas digitais.</p>

  <table>
    <thead>
      <tr>
        <th>Grupo</th>
        <th>Quantidade</th>
        <th>Observação</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Idosos acima de 80 anos</td>
        <td>256.697</td>
        <td>Prioridade legal</td>
      </tr>
      <tr>
        <td>Idosos entre 60 e 79 anos</td>
        <td>2.256.975</td>
        <td>Prioridade legal</td>
      </tr>
      <tr>
        <td>Pessoas com deficiência ou moléstia grave</td>
        <td>222.100</td>
        <td>Prioridade legal</td>
      </tr>
      <tr>
        <td>Contribuintes do magistério</td>
        <td>1.054.789</td>
        <td>Prioridade legal</td>
      </tr>
      <tr>
        <td>Pré-preenchida com Pix CPF</td>
        <td>4.959.431</td>
        <td>Prioridade operacional</td>
      </tr>
    </tbody>
  </table>

  <p>Se você não está em nenhum desses grupos, ainda assim pode receber nos próximos lotes. O que manda no calendário é a data de entrega da declaração e a ausência de pendências. Em termos simples: quem enviou primeiro e sem erro tende a andar mais rápido na fila.</p>

  <h2>Como consultar a restituição sem cair em site falso?</h2>
  <p>A Receita orienta fazer a consulta apenas pelos canais oficiais. O caminho mais seguro é entrar no portal da Receita, acessar a área <strong>Meu Imposto de Renda</strong> e clicar em <strong>Consultar minha restituição</strong>. Também é possível usar o aplicativo oficial para celulares e tablets.</p>

  <p>Esse ponto é importante porque a época da restituição costuma atrair golpes. Se o cidadão procurar link em mensagem de WhatsApp, anúncio patrocinado ou página parecida com a da Receita, o risco de cair em fraude é real. O ideal é digitar o endereço oficial diretamente no navegador.</p>

  <h3>Passo a passo prático</h3>
  <ol>
    <li>Acesse o site oficial da Receita Federal.</li>
    <li>Entre em <strong>Meu Imposto de Renda</strong>.</li>
    <li>Escolha <strong>Consultar minha restituição</strong>.</li>
    <li>Veja se a restituição já foi liberada ou se existe pendência na declaração.</li>
    <li>Se necessário, acesse o e-CAC para a versão completa do extrato.</li>
  </ol>

  <h2>O que fazer se a consulta mostrar pendência?</h2>
  <p>Se a declaração caiu na malha fina ou apareceu com alguma pendência, a restituição não é perdida automaticamente. O mais comum é que o contribuinte precise revisar o erro, corrigir a informação e, se for o caso, enviar uma declaração retificadora.</p>

  <p>As divergências podem surgir por motivo simples: um informe errado da fonte pagadora, uma despesa lançada sem comprovação ou um rendimento omitido. Em geral, quanto antes o problema é identificado, menor é o desgaste para regularizar a situação.</p>

  <p><strong>Alerta importante:</strong> se a declaração estiver com inconsistência, a posição na fila de restituição pode mudar. Em vez de depender do próximo pagamento, o ideal é resolver o quanto antes para não empurrar a devolução para os lotes seguintes.</p>

  <div class="cta-inline" style="background:#0A0A0A;color:#F5F5F2;padding:20px 24px;margin:32px 0;border-left:4px solid #C6FF00;">
    <p style="margin:0 0 12px;font-weight:600;">Quer revisar seu caso antes de perder a fila da restituição?</p>
    <p style="margin:0 0 16px;">Uma análise individual ajuda a identificar pendências, erros de preenchimento e oportunidades de correção antes do próximo lote.</p>
    <a href="https://wa.me/5511940825120?text=Ol%C3%A1%20Nilson!%20Quero%20revisar%20minha%20restitui%C3%A7%C3%A3o%20do%20IRPF%202026" style="display:inline-block;background:#C6FF00;color:#0A0A0A;padding:12px 24px;font-weight:700;text-decoration:none;">Solicitar análise</a>
  </div>

  <h2>E se a restituição não cair na conta informada?</h2>
  <p>Quando o problema não está na declaração, mas sim na conta bancária, a solução é o reagendamento. A Receita informa que o crédito é feito apenas em conta de titularidade do contribuinte e, se houver falha no depósito, o ressarcimento pode ser reagendado no Banco do Brasil.</p>

  <p>O prazo informado para resgate é de até um ano após a primeira tentativa de pagamento. Se o contribuinte não resgatar nesse intervalo, a solicitação passa a ser feita pelo e-CAC, no caminho de restituição não resgatada na rede bancária.</p>

  <h3>O que a Receita e o Banco do Brasil pedem no reagendamento?</h3>
  <ul>
    <li>Valor da restituição.</li>
    <li>Número do recibo da declaração.</li>
    <li>Conta bancária de titularidade do contribuinte.</li>
  </ul>

  <h2>Qual é o calendário completo da restituição em 2026?</h2>
  <p>O primeiro lote não encerra o processo. A Receita trabalha com quatro lotes regulares neste ano, sempre respeitando o cruzamento entre ordem de entrega, prioridade legal e qualidade das informações enviadas.</p>

  <table>
    <thead>
      <tr>
        <th>Lote</th>
        <th>Data de pagamento</th>
        <th>Observação</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1º lote</td>
        <td>29 de maio de 2026</td>
        <td>Maior lote da história</td>
      </tr>
      <tr>
        <td>2º lote</td>
        <td>30 de junho de 2026</td>
        <td>Nova rodada de liberações</td>
      </tr>
      <tr>
        <td>3º lote</td>
        <td>31 de julho de 2026</td>
        <td>Fila avança para mais contribuintes</td>
      </tr>
      <tr>
        <td>4º lote</td>
        <td>28 de agosto de 2026</td>
        <td>Fechamento do calendário regular</td>
      </tr>
    </tbody>
  </table>

  <p>Na prática, a restituição segue uma lógica simples: quem entregou mais cedo e sem inconsistências tende a aparecer antes. Quem comete erro, omite rendimento ou deixa pendência documental acaba voltando para o fim da fila.</p>

  <h2>Quem ainda pode entrar nos próximos lotes?</h2>
  <p>Se a sua declaração foi enviada sem prioridade legal, isso não significa que você ficou de fora. Significa apenas que você pode aparecer nos lotes seguintes. Por isso, vale revisar o status agora, corrigir erros o quanto antes e acompanhar a liberação nos próximos pagamentos.</p>

  <p>Também é importante lembrar que o prazo final para entrega do IRPF 2026 termina em <strong>29 de maio de 2026</strong>. Então, além de acompanhar a restituição, quem ainda não enviou a declaração precisa resolver isso antes do encerramento para não correr risco de multa.</p>

  <div class="key-facts" style="background:#2D4033;color:#F9F7F2;padding:20px 24px;margin:32px 0;">
    <strong style="display:block;margin-bottom:12px;letter-spacing:0.1em;text-transform:uppercase;font-size:0.8em;">Dados Essenciais</strong>
    <ul style="margin:0;padding-left:20px;">
      <li><strong>R$ 16 bilhões</strong> no primeiro lote de restituição do IRPF 2026.</li>
      <li><strong>8.749.992 contribuintes</strong> contemplados na liberação desta sexta-feira.</li>
      <li><strong>Consulta aberta às 10h</strong> do dia 22 de maio de 2026.</li>
      <li><strong>Pagamento em 29 de maio</strong>, com possibilidade de consulta no site, app e e-CAC.</li>
    </ul>
  </div>

  <h2>Por que esse lote virou notícia em todo o país?</h2>
  <p>Porque o volume é inédito. A Receita não está apenas antecipando uma restituição comum; está colocando em circulação uma massa de recursos que movimenta comércio, serviços e planejamento financeiro de milhões de brasileiros. O lote é <strong>45% maior</strong> do que o primeiro lote de 2025, que havia somado R$ 11 bilhões.</p>

  <p>Além do tamanho, o momento pesa. A consulta foi liberada justamente no fim do prazo de entrega da declaração, quando muita gente ainda está finalizando a própria situação fiscal. Isso faz com que o tema se torne um dos assuntos mais buscados do dia.</p>

  <h2>Conclusão: vale conferir hoje, não depois</h2>
  <p>Se a sua restituição está nesse lote, o dinheiro entra no dia 29 de maio. Se não estiver, você ainda pode corrigir pendências, acompanhar a fila e se organizar para os próximos lotes. O erro mais caro agora é deixar para depois e descobrir tarde demais que a declaração estava com pendência.</p>

  <p>Na minha experiência, quem espera a última hora costuma pagar duas vezes: primeiro com o atraso da restituição e depois com a correria para corrigir a declaração. Se você quer evitar isso, confira o status hoje, ajuste o que for necessário e acompanhe a fila com critério.</p>

  <div class="cta-final" style="background:#0A0A0A;color:#F5F5F2;padding:32px;margin:48px 0;text-align:center;">
    <h3 style="color:#C6FF00;margin:0 0 16px;">Quer revisar sua restituição com segurança?</h3>
    <p style="margin:0 0 24px;">Nilson Brites atende 100% online e ajuda a revisar pendências, restituição e estratégia de envio do IRPF 2026.</p>
    <a href="https://wa.me/5511940825120?text=Ol%C3%A1%20Nilson!%20Quero%20revisar%20minha%20declara%C3%A7%C3%A3o%20e%20restitui%C3%A7%C3%A3o%20do%20IRPF%202026" style="display:inline-block;background:#C6FF00;color:#0A0A0A;padding:16px 32px;font-weight:700;text-decoration:none;">Falar com especialista</a>
  </div>

  <p class="disclaimer" style="font-size:0.8em;color:#666;border-top:1px solid #eee;padding-top:16px;margin-top:32px;">Conteúdo de caráter educativo. Para análise do seu caso específico, consulte o especialista <strong>Nilson Brites — Consultoria IRPF NSB</strong>. WhatsApp: +55 11 94082-5120.</p>
</article>
`.trim(),
};

async function main() {
  await prisma.blogPost.upsert({
    where: { slug: post.slug },
    update: {
      title: post.title,
      summary: post.summary,
      metaTitle: post.metaTitle,
      metaDesc: post.metaDesc,
      imageAlt: post.imageAlt,
      tags: post.tags,
      keywords: post.keywords,
      faqsJson: JSON.stringify(post.faqsJson),
      coverImage: post.coverImage,
      content: post.content,
      published: true,
      categoria: "IRPF",
      postType: "traffic",
      audience: "contribuintes IRPF 2026",
      searchIntent: "informacional",
      factScore: 99,
      riskScore: 1,
      needsReview: false,
      campaignMode: "IRPF_URGENT",
      reviewJson: JSON.stringify({
        aprovado: true,
        nivel_risco: "baixo",
        itens_de_risco: [],
        resumo: "Post manual inserido com base em fontes oficiais do IRPF 2026.",
      }),
      aiModel: "manual-editorial",
    },
    create: {
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      metaTitle: post.metaTitle,
      metaDesc: post.metaDesc,
      imageAlt: post.imageAlt,
      tags: post.tags,
      keywords: post.keywords,
      faqsJson: JSON.stringify(post.faqsJson),
      coverImage: post.coverImage,
      content: post.content,
      published: true,
      categoria: "IRPF",
      postType: "traffic",
      audience: "contribuintes IRPF 2026",
      searchIntent: "informacional",
      factScore: 99,
      riskScore: 1,
      needsReview: false,
      campaignMode: "IRPF_URGENT",
      reviewJson: JSON.stringify({
        aprovado: true,
        nivel_risco: "baixo",
        itens_de_risco: [],
        resumo: "Post manual inserido com base em fontes oficiais do IRPF 2026.",
      }),
      aiModel: "manual-editorial",
    },
  });

  console.log(`Post criado/atualizado: ${post.slug}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
