import { createClient } from "@supabase/supabase-js"

// Essas variáveis de ambiente precisam ser configuradas no seu projeto
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Tipos para as tabelas do Supabase
export type Status = "novo" | "em_andamento" | "concluido" | "cancelado"
export type Prioridade = "baixa" | "media" | "alta"
export type EquipamentoStatus = "ativo" | "inativo" | "em_manutencao"

export interface Usuario {
  id: string
  nome: string
  role: "user" | "admin"
  created_at: string
}

export interface Equipamento {
  id: string
  nome: string
  codigo: string
  setor: string
  data_aquisicao: string
  ultima_manutencao?: string
  status: EquipamentoStatus
  created_at: string
}

export interface Chamado {
  id: string
  equipamento_id: string
  setor: string
  descricao: string
  prioridade: Prioridade
  status: Status
  created_at: string
  updated_at: string
  solicitante_id: string
  observacoes?: string
}

export interface TimelineChamado {
  id: string
  chamado_id: string
  status: Status
  observacao?: string
  created_at: string
}

// Criando o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Função auxiliar para verificar se o cliente está autenticado
export const isAuthenticated = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return !!session
}
