export type StatusLicitacao =
  | "ANALISAR"
  | "PARTICIPAR"
  | "MONITORAR"
  | "DESCARTADA"
  | "VENCEDOR"
  | "PERDIDA"
  | "SUSPENSA";

export type ModalidadeLicitacao =
  | "PREGÃO ELETRÔNICO"
  | "PREGÃO PRESENCIAL"
  | "DISPENSA DE LICITAÇÃO"
  | "CREDENCIAMENTO";

export type TipoDisputaLicitacao = "GLOBAL" | "POR LOTE" | "POR ITEM";

export type ModoDisputaLicitacao =
  | "ABERTO"
  | "ABERTO E FECHADO"
  | "FECHADO E ABERTO"
  | "FECHADO";

export type RegionalidadeLicitacao =
  | "NÃO"
  | "SIM - PREFERÊNCIA REGIONAL"
  | "SIM - PREFERÊNCIA LOCAL"
  | "SIM - EXCLUSIVO REGIONAL"
  | "SIM - EXCLUSIVO LOCAL";

export interface ItemLicitacao {
  lote: number | null;
  item: number | null;
  descricao: string;
  unidade: string | null;
  quantidade: number | null;
  valor_item: number | null;
}

export interface Licitacao {
  id: string;
  numero_edital: string | null;
  numero_processo: string | null;
  orgao: string | null;
  modalidade: string | null;
  tipo_disputa: string | null;
  modo_disputa: string | null;
  registro_preco: boolean | null;
  data_abertura: string | null;
  data_hora_abertura: string | null;
  objeto: string | null;
  documentos_habilitacao: string[] | null;
  itens: ItemLicitacao[] | null;
  status: StatusLicitacao;
  data_evento: string | null;
  distancia_km: number | null;
  plataforma: string | null;
  regionalidade: string | null;
  data_cadastro: string | null;
}

export interface Database {
  public: {
    Tables: {
      licitacoes: {
        Row: Licitacao;
        Insert: Omit<Licitacao, "id" | "data_cadastro"> & {
          id?: string;
          data_cadastro?: string;
        };
        Update: Partial<Omit<Licitacao, "id">>;
      };
    };
  };
}
