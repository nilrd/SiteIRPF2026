export type AdminPipelineItemType = "lead" | "contato";

export type AdminPipelineRelatedItem = {
  id: string;
  itemType: AdminPipelineItemType;
  nome: string;
  email: string;
  telefone?: string | null;
  tipoDecl?: string | null;
  servico?: string | null;
  assunto?: string | null;
  origem: string;
  status: string;
  createdAt: string | Date;
  mensagem: string;
};

export type AdminPipelineItem = {
  id: string;
  itemType: AdminPipelineItemType;
  latestSourceId: string;
  latestSourceType: AdminPipelineItemType;
  nome: string;
  email: string;
  telefone?: string | null;
  tipoDecl?: string | null;
  servico?: string | null;
  assunto?: string | null;
  origem: string;
  status: string;
  createdAt: string | Date;
  mensagem: string;
  sourceTypes: AdminPipelineItemType[];
  origens: string[];
  servicos: string[];
  registrationCount: number;
  messageCount: number;
  hasDuplicate: boolean;
  relatedItems: AdminPipelineRelatedItem[];
};

export type AdminPipelineResponse = {
  items: AdminPipelineItem[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
  counters: {
    novos: number;
    em_contato: number;
    convertidos: number;
    perdidos: number;
    nao_lidos: number;
  };
};
