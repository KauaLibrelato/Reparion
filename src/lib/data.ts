export type Status = "novo" | "em_andamento" | "concluido" | "cancelado"
export type Prioridade = "baixa" | "media" | "alta"

export interface Chamado {
  id: string
  equipamentoId: string
  equipamentoNome: string
  setor: string
  descricao: string
  prioridade: Prioridade
  status: Status
  dataCriacao: string
  dataAtualizacao: string
  solicitanteId: string
  solicitanteNome: string
  observacoes?: string
  timeline: {
    data: string
    status: Status
    observacao?: string
  }[]
}

export interface Equipamento {
  id: string
  nome: string
  codigo: string
  setor: string
  dataAquisicao: string
  ultimaManutencao?: string
  status: "ativo" | "inativo" | "em_manutencao"
}

// Dados simulados de chamados
export const chamados: Chamado[] = [
  {
    id: "1",
    equipamentoId: "1",
    equipamentoNome: "Impressora HP LaserJet",
    setor: "Administrativo",
    descricao: "Impressora não está imprimindo, mostra erro de papel atolado",
    prioridade: "alta",
    status: "novo",
    dataCriacao: "2023-05-10T10:30:00Z",
    dataAtualizacao: "2023-05-10T10:30:00Z",
    solicitanteId: "1",
    solicitanteNome: "Usuário Comum",
    timeline: [
      {
        data: "2023-05-10T10:30:00Z",
        status: "novo",
        observacao: "Chamado aberto pelo usuário",
      },
    ],
  },
  {
    id: "2",
    equipamentoId: "2",
    equipamentoNome: "Ar Condicionado Split",
    setor: "Sala de Reuniões",
    descricao: "Ar condicionado não está refrigerando adequadamente",
    prioridade: "media",
    status: "em_andamento",
    dataCriacao: "2023-05-09T14:15:00Z",
    dataAtualizacao: "2023-05-10T09:20:00Z",
    solicitanteId: "1",
    solicitanteNome: "Usuário Comum",
    observacoes: "Técnico agendado para verificar o equipamento",
    timeline: [
      {
        data: "2023-05-09T14:15:00Z",
        status: "novo",
        observacao: "Chamado aberto pelo usuário",
      },
      {
        data: "2023-05-10T09:20:00Z",
        status: "em_andamento",
        observacao: "Técnico agendado para verificar o equipamento",
      },
    ],
  },
  {
    id: "3",
    equipamentoId: "3",
    equipamentoNome: "Computador Desktop Dell",
    setor: "TI",
    descricao: "Computador apresentando tela azul frequentemente",
    prioridade: "alta",
    status: "concluido",
    dataCriacao: "2023-05-08T11:45:00Z",
    dataAtualizacao: "2023-05-09T16:30:00Z",
    solicitanteId: "1",
    solicitanteNome: "Usuário Comum",
    observacoes: "Problema resolvido com reinstalação do sistema operacional",
    timeline: [
      {
        data: "2023-05-08T11:45:00Z",
        status: "novo",
        observacao: "Chamado aberto pelo usuário",
      },
      {
        data: "2023-05-08T14:20:00Z",
        status: "em_andamento",
        observacao: "Técnico iniciou análise do problema",
      },
      {
        data: "2023-05-09T16:30:00Z",
        status: "concluido",
        observacao: "Problema resolvido com reinstalação do sistema operacional",
      },
    ],
  },
  {
    id: "4",
    equipamentoId: "4",
    equipamentoNome: "Projetor Epson",
    setor: "Auditório",
    descricao: "Projetor não liga",
    prioridade: "media",
    status: "novo",
    dataCriacao: "2023-05-10T09:00:00Z",
    dataAtualizacao: "2023-05-10T09:00:00Z",
    solicitanteId: "1",
    solicitanteNome: "Usuário Comum",
    timeline: [
      {
        data: "2023-05-10T09:00:00Z",
        status: "novo",
        observacao: "Chamado aberto pelo usuário",
      },
    ],
  },
  {
    id: "5",
    equipamentoId: "5",
    equipamentoNome: "Notebook Lenovo",
    setor: "Comercial",
    descricao: "Bateria não segura carga",
    prioridade: "baixa",
    status: "em_andamento",
    dataCriacao: "2023-05-07T16:20:00Z",
    dataAtualizacao: "2023-05-08T10:15:00Z",
    solicitanteId: "1",
    solicitanteNome: "Usuário Comum",
    observacoes: "Bateria será substituída",
    timeline: [
      {
        data: "2023-05-07T16:20:00Z",
        status: "novo",
        observacao: "Chamado aberto pelo usuário",
      },
      {
        data: "2023-05-08T10:15:00Z",
        status: "em_andamento",
        observacao: "Bateria será substituída",
      },
    ],
  },
]

// Dados simulados de equipamentos
export const equipamentos: Equipamento[] = [
  {
    id: "1",
    nome: "Impressora HP LaserJet",
    codigo: "IMP001",
    setor: "Administrativo",
    dataAquisicao: "2021-03-15",
    ultimaManutencao: "2023-01-20",
    status: "ativo",
  },
  {
    id: "2",
    nome: "Ar Condicionado Split",
    codigo: "AC001",
    setor: "Sala de Reuniões",
    dataAquisicao: "2020-07-10",
    ultimaManutencao: "2023-02-05",
    status: "em_manutencao",
  },
  {
    id: "3",
    nome: "Computador Desktop Dell",
    codigo: "PC001",
    setor: "TI",
    dataAquisicao: "2022-01-05",
    ultimaManutencao: "2023-05-09",
    status: "ativo",
  },
  {
    id: "4",
    nome: "Projetor Epson",
    codigo: "PRJ001",
    setor: "Auditório",
    dataAquisicao: "2021-11-20",
    status: "ativo",
  },
  {
    id: "5",
    nome: "Notebook Lenovo",
    codigo: "NB001",
    setor: "Comercial",
    dataAquisicao: "2022-04-18",
    ultimaManutencao: "2023-05-08",
    status: "em_manutencao",
  },
  {
    id: "6",
    nome: "Servidor Dell PowerEdge",
    codigo: "SRV001",
    setor: "TI",
    dataAquisicao: "2020-09-30",
    ultimaManutencao: "2023-03-15",
    status: "ativo",
  },
  {
    id: "7",
    nome: "Scanner Epson",
    codigo: "SCN001",
    setor: "Administrativo",
    dataAquisicao: "2021-08-12",
    status: "inativo",
  },
]

// Funções para manipular os dados (simulando operações de banco de dados)
let chamadosData = [...chamados]
let equipamentosData = [...equipamentos]

// Funções para chamados
export function getChamados() {
  return chamadosData
}

export function getChamadoById(id: string) {
  return chamadosData.find((chamado) => chamado.id === id)
}

export function getChamadosByUsuario(usuarioId: string) {
  return chamadosData.filter((chamado) => chamado.solicitanteId === usuarioId)
}

export function addChamado(chamado: Omit<Chamado, "id" | "dataCriacao" | "dataAtualizacao" | "timeline">) {
  const newChamado: Chamado = {
    id: (chamadosData.length + 1).toString(),
    ...chamado,
    dataCriacao: new Date().toISOString(),
    dataAtualizacao: new Date().toISOString(),
    status: "novo",
    timeline: [
      {
        data: new Date().toISOString(),
        status: "novo",
        observacao: "Chamado aberto pelo usuário",
      },
    ],
  }

  chamadosData = [...chamadosData, newChamado]
  return newChamado
}

export function updateChamadoStatus(id: string, status: Status, observacao?: string) {
  const chamadoIndex = chamadosData.findIndex((chamado) => chamado.id === id)

  if (chamadoIndex === -1) return null

  const updatedChamado = {
    ...chamadosData[chamadoIndex],
    status,
    dataAtualizacao: new Date().toISOString(),
    observacoes: observacao || chamadosData[chamadoIndex].observacoes,
    timeline: [
      ...chamadosData[chamadoIndex].timeline,
      {
        data: new Date().toISOString(),
        status,
        observacao,
      },
    ],
  }

  chamadosData[chamadoIndex] = updatedChamado
  return updatedChamado
}

// Funções para equipamentos
export function getEquipamentos() {
  return equipamentosData
}

export function getEquipamentoById(id: string) {
  return equipamentosData.find((equipamento) => equipamento.id === id)
}

export function addEquipamento(equipamento: Omit<Equipamento, "id">) {
  const newEquipamento: Equipamento = {
    id: (equipamentosData.length + 1).toString(),
    ...equipamento,
  }

  equipamentosData = [...equipamentosData, newEquipamento]
  return newEquipamento
}

export function updateEquipamento(id: string, data: Partial<Equipamento>) {
  const equipamentoIndex = equipamentosData.findIndex((equipamento) => equipamento.id === id)

  if (equipamentoIndex === -1) return null

  const updatedEquipamento = {
    ...equipamentosData[equipamentoIndex],
    ...data,
  }

  equipamentosData[equipamentoIndex] = updatedEquipamento
  return updatedEquipamento
}

export function deleteEquipamento(id: string) {
  const equipamentoIndex = equipamentosData.findIndex((equipamento) => equipamento.id === id)

  if (equipamentoIndex === -1) return false

  equipamentosData = equipamentosData.filter((equipamento) => equipamento.id !== id)
  return true
}
