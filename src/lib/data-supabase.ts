"use server";

import { createServerSupabaseClient } from "./auth-supabase";
import type { EquipamentoStatus, Prioridade, Status } from "./supabase";

// Funções para chamados
export async function getChamados() {
  const supabase = await createServerSupabaseClient();

  console.log("Buscando todos os chamados para o admin");

  const { data, error } = await supabase
    .from("chamados")
    .select(
      `
      *,
      equipamentos (id, nome, codigo),
      usuarios (id, nome)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar chamados:", error);
    return [];
  }

  console.log(`Encontrados ${data.length} chamados`);

  // Formatar os dados para o formato esperado pela aplicação
  console.log(data);
  return data.map((chamado) => ({
    id: chamado.id,
    equipamentoId: chamado.equipamento_id,
    equipamentoNome: chamado.equipamentos?.nome || "Equipamento não encontrado",
    setor: chamado.setor,
    descricao: chamado.descricao,
    prioridade: chamado.prioridade,
    status: chamado.status,
    dataCriacao: chamado.created_at,
    dataAtualizacao: chamado.updated_at,
    solicitanteId: chamado.solicitante_id,
    solicitanteNome: chamado.usuarios?.nome || "Usuário não encontrado",
    observacoes: chamado.observacoes,
  }));
}

export async function getChamadoById(id: string) {
  const supabase = await createServerSupabaseClient();

  // Buscar o chamado
  const { data: chamado, error } = await supabase
    .from("chamados")
    .select(
      `
      *,
      equipamentos (id, nome, codigo),
      usuarios (id, nome)
    `
    )
    .eq("id", id)
    .single();

  if (error || !chamado) {
    console.error("Erro ao buscar chamado:", error);
    return null;
  }

  // Buscar a timeline do chamado
  const { data: timeline, error: timelineError } = await supabase
    .from("timeline_chamados")
    .select("*")
    .eq("chamado_id", id)
    .order("created_at", { ascending: true });

  if (timelineError) {
    console.error("Erro ao buscar timeline:", timelineError);
    return null;
  }

  // Formatar os dados para o formato esperado pela aplicação
  return {
    id: chamado.id,
    equipamentoId: chamado.equipamento_id,
    equipamentoNome: chamado.equipamentos?.nome || "Equipamento não encontrado",
    setor: chamado.setor,
    descricao: chamado.descricao,
    prioridade: chamado.prioridade,
    status: chamado.status,
    dataCriacao: chamado.created_at,
    dataAtualizacao: chamado.updated_at,
    solicitanteId: chamado.solicitante_id,
    solicitanteNome: chamado.usuarios?.nome || "Usuário não encontrado",
    observacoes: chamado.observacoes,
    timeline: timeline.map((item) => ({
      data: item.created_at,
      status: item.status,
      observacao: item.observacao,
    })),
  };
}

export async function getChamadosByUsuario(usuarioId: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("chamados")
    .select(
      `
      *,
      equipamentos (id, nome, codigo),
      usuarios (id, nome)
    `
    )
    .eq("solicitante_id", usuarioId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar chamados do usuário:", error);
    return [];
  }

  // Formatar os dados para o formato esperado pela aplicação
  return data.map((chamado) => ({
    id: chamado.id,
    equipamentoId: chamado.equipamento_id,
    equipamentoNome: chamado.equipamentos?.nome || "Equipamento não encontrado",
    setor: chamado.setor,
    descricao: chamado.descricao,
    prioridade: chamado.prioridade,
    status: chamado.status,
    dataCriacao: chamado.created_at,
    dataAtualizacao: chamado.updated_at,
    solicitanteId: chamado.solicitante_id,
    solicitanteNome: chamado.usuarios?.nome || "Usuário não encontrado",
    observacoes: chamado.observacoes,
  }));
}

export async function addChamado(chamado: {
  equipamentoId: string;
  equipamentoNome?: string;
  setor: string;
  descricao: string;
  prioridade: Prioridade;
  solicitanteId: string;
}) {
  const supabase = await createServerSupabaseClient();
  console.log("Criando novo chamado com dados:", chamado);

  // Verificar se o equipamentoId é válido ou se precisa criar um novo
  let equipamentoId = chamado.equipamentoId;

  if (!equipamentoId && chamado.equipamentoNome) {
    console.log("Criando novo equipamento:", chamado.equipamentoNome);
    // Criar um novo equipamento
    const { data: novoEquipamento, error: novoEquipamentoError } =
      await supabase
        .from("equipamentos")
        .insert({
          nome: chamado.equipamentoNome,
          codigo: `EQ${Date.now().toString().slice(-6)}`,
          setor: chamado.setor,
          data_aquisicao: new Date().toISOString(),
          status: "ativo",
        })
        .select("id")
        .single();

    if (novoEquipamentoError || !novoEquipamento) {
      console.error("Erro ao criar equipamento:", novoEquipamentoError);
      throw new Error("Erro ao criar equipamento");
    }

    equipamentoId = novoEquipamento.id;
    console.log("Novo equipamento criado com ID:", equipamentoId);
  }

  // Inserir o chamado
  const now = new Date().toISOString();
  console.log("Inserindo chamado com equipamento_id:", equipamentoId);

  const { data: novoChamado, error: chamadoError } = await supabase
    .from("chamados")
    .insert({
      equipamento_id: equipamentoId,
      setor: chamado.setor,
      descricao: chamado.descricao,
      prioridade: chamado.prioridade,
      status: "novo",
      solicitante_id: chamado.solicitanteId,
      created_at: now,
      updated_at: now,
    })
    .select("id")
    .single();

  if (chamadoError || !novoChamado) {
    console.error("Erro ao criar chamado:", chamadoError);
    throw new Error("Erro ao criar chamado");
  }

  console.log("Chamado criado com ID:", novoChamado.id);

  // Inserir o primeiro item na timeline
  const { error: timelineError } = await supabase
    .from("timeline_chamados")
    .insert({
      chamado_id: novoChamado.id,
      status: "novo",
      observacao: "Chamado aberto pelo usuário",
      created_at: now,
    });

  if (timelineError) {
    console.error("Erro ao criar timeline:", timelineError);
    // Não vamos lançar erro aqui, pois o chamado já foi criado
  } else {
    console.log("Timeline criada para o chamado:", novoChamado.id);
  }

  return await getChamadoById(novoChamado.id);
}

export async function updateChamadoStatus(
  id: string,
  status: Status,
  observacao?: string
) {
  const supabase = await createServerSupabaseClient();
  const now = new Date().toISOString();

  // Atualizar o status do chamado
  const { error: chamadoError } = await supabase
    .from("chamados")
    .update({
      status,
      observacoes: observacao,
      updated_at: now,
    })
    .eq("id", id);

  if (chamadoError) {
    console.error("Erro ao atualizar chamado:", chamadoError);
    throw new Error("Erro ao atualizar chamado");
  }

  // Inserir novo item na timeline
  const { error: timelineError } = await supabase
    .from("timeline_chamados")
    .insert({
      chamado_id: id,
      status,
      observacao,
      created_at: now,
    });

  if (timelineError) {
    console.error("Erro ao criar timeline:", timelineError);
    // Não vamos lançar erro aqui, pois o chamado já foi atualizado
  }

  // Se o status for "em_andamento", atualizar o status do equipamento
  if (status === "em_andamento") {
    const { data: chamado } = await supabase
      .from("chamados")
      .select("equipamento_id")
      .eq("id", id)
      .single();

    if (chamado) {
      await supabase
        .from("equipamentos")
        .update({ status: "em_manutencao" })
        .eq("id", chamado.equipamento_id);
    }
  }

  // Se o status for "concluido", atualizar o status do equipamento e a data da última manutenção
  if (status === "concluido") {
    const { data: chamado } = await supabase
      .from("chamados")
      .select("equipamento_id")
      .eq("id", id)
      .single();

    if (chamado) {
      await supabase
        .from("equipamentos")
        .update({
          status: "ativo",
          ultima_manutencao: now,
        })
        .eq("id", chamado.equipamento_id);
    }
  }

  return await getChamadoById(id);
}

// Funções para equipamentos
export async function getEquipamentos() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("equipamentos")
    .select("*")
    .order("nome");

  if (error) {
    console.error("Erro ao buscar equipamentos:", error);
    return [];
  }

  // Formatar os dados para o formato esperado pela aplicação
  return data.map((equipamento) => ({
    id: equipamento.id,
    nome: equipamento.nome,
    codigo: equipamento.codigo,
    setor: equipamento.setor,
    dataAquisicao: equipamento.data_aquisicao,
    ultimaManutencao: equipamento.ultima_manutencao,
    status: equipamento.status,
  }));
}

export async function getEquipamentoById(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("equipamentos")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Erro ao buscar equipamento:", error);
    return null;
  }

  // Formatar os dados para o formato esperado pela aplicação
  return {
    id: data.id,
    nome: data.nome,
    codigo: data.codigo,
    setor: data.setor,
    dataAquisicao: data.data_aquisicao,
    ultimaManutencao: data.ultima_manutencao,
    status: data.status,
  };
}

export async function addEquipamento(equipamento: {
  nome: string;
  codigo: string;
  setor: string;
  dataAquisicao: string;
  status: EquipamentoStatus;
}) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("equipamentos")
    .insert({
      nome: equipamento.nome,
      codigo: equipamento.codigo,
      setor: equipamento.setor,
      data_aquisicao: equipamento.dataAquisicao,
      status: equipamento.status,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Erro ao criar equipamento:", error);
    throw new Error("Erro ao criar equipamento");
  }

  return await getEquipamentoById(data.id);
}

export async function updateEquipamento(
  id: string,
  equipamento: {
    nome: string;
    codigo: string;
    setor: string;
    dataAquisicao: string;
    ultimaManutencao?: string;
    status: EquipamentoStatus;
  }
) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("equipamentos")
    .update({
      nome: equipamento.nome,
      codigo: equipamento.codigo,
      setor: equipamento.setor,
      data_aquisicao: equipamento.dataAquisicao,
      ultima_manutencao: equipamento.ultimaManutencao,
      status: equipamento.status,
    })
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar equipamento:", error);
    throw new Error("Erro ao atualizar equipamento");
  }

  return await getEquipamentoById(id);
}

export async function deleteEquipamento(id: string) {
  const supabase = await createServerSupabaseClient();
  // Verificar se existem chamados associados a este equipamento
  const { data: chamados, error: chamadosError } = await supabase
    .from("chamados")
    .select("id")
    .eq("equipamento_id", id);

  if (chamadosError) {
    console.error("Erro ao verificar chamados:", chamadosError);
    throw new Error("Erro ao verificar chamados");
  }

  if (chamados && chamados.length > 0) {
    throw new Error(
      "Não é possível excluir um equipamento com chamados associados"
    );
  }

  // Excluir o equipamento
  const { error } = await supabase.from("equipamentos").delete().eq("id", id);

  if (error) {
    console.error("Erro ao excluir equipamento:", error);
    throw new Error("Erro ao excluir equipamento");
  }

  return true;
}

// Funções para buscar dados para os dashboards
export async function getDashboardData(usuarioId: string) {
  const supabase = await createServerSupabaseClient();
  // Buscar chamados do usuário
  const { data: chamados, error: chamadosError } = await supabase
    .from("chamados")
    .select(
      `
      *,
      equipamentos (id, nome, codigo),
      usuarios (id, nome)
    `
    )
    .eq("solicitante_id", usuarioId)
    .order("created_at", { ascending: false });

  if (chamadosError) {
    console.error("Erro ao buscar chamados:", chamadosError);
    return {
      chamados: [],
      chamadosNovos: 0,
      chamadosEmAndamento: 0,
      chamadosConcluidos: 0,
      chamadosRecentes: [],
    };
  }

  const formattedChamados = chamados.map((chamado) => ({
    id: chamado.id,
    equipamentoId: chamado.equipamento_id,
    equipamentoNome: chamado.equipamentos?.nome || "Equipamento não encontrado",
    setor: chamado.setor,
    descricao: chamado.descricao,
    prioridade: chamado.prioridade,
    status: chamado.status,
    dataCriacao: chamado.created_at,
    dataAtualizacao: chamado.updated_at,
    solicitanteId: chamado.solicitante_id,
    solicitanteNome: chamado.usuarios?.nome || "Usuário não encontrado",
    observacoes: chamado.observacoes,
  }));

  const chamadosNovos = formattedChamados.filter(
    (chamado) => chamado.status === "novo"
  ).length;
  const chamadosEmAndamento = formattedChamados.filter(
    (chamado) => chamado.status === "em_andamento"
  ).length;
  const chamadosConcluidos = formattedChamados.filter(
    (chamado) => chamado.status === "concluido"
  ).length;
  const chamadosRecentes = formattedChamados.slice(0, 5);

  return {
    chamados: formattedChamados,
    chamadosNovos,
    chamadosEmAndamento,
    chamadosConcluidos,
    chamadosRecentes,
  };
}

export async function getAdminDashboardData() {
  const supabase = await createServerSupabaseClient();
  // Buscar todos os chamados
  const { data: chamados, error: chamadosError } = await supabase
    .from("chamados")
    .select(
      `
      *,
      equipamentos (id, nome, codigo),
      usuarios (id, nome)
    `
    )
    .order("created_at", { ascending: false });

  if (chamadosError) {
    console.error("Erro ao buscar chamados:", chamadosError);
    return {
      chamados: [],
      chamadosNovos: 0,
      chamadosEmAndamento: 0,
      chamadosConcluidos: 0,
      chamadosRecentes: [],
      equipamentos: [],
      equipamentosAtivos: 0,
      equipamentosEmManutencao: 0,
      equipamentosEmManutencaoList: [],
    };
  }

  const formattedChamados = chamados.map((chamado) => ({
    id: chamado.id,
    equipamentoId: chamado.equipamento_id,
    equipamentoNome: chamado.equipamentos?.nome || "Equipamento não encontrado",
    setor: chamado.setor,
    descricao: chamado.descricao,
    prioridade: chamado.prioridade,
    status: chamado.status,
    dataCriacao: chamado.created_at,
    dataAtualizacao: chamado.updated_at,
    solicitanteId: chamado.solicitante_id,
    solicitanteNome: chamado.usuarios?.nome || "Usuário não encontrado",
    observacoes: chamado.observacoes,
  }));

  // Buscar todos os equipamentos
  const { data: equipamentos, error: equipamentosError } = await supabase
    .from("equipamentos")
    .select("*")
    .order("nome");

  if (equipamentosError) {
    console.error("Erro ao buscar equipamentos:", equipamentosError);
    return {
      chamados: formattedChamados,
      chamadosNovos: formattedChamados.filter(
        (chamado) => chamado.status === "novo"
      ).length,
      chamadosEmAndamento: formattedChamados.filter(
        (chamado) => chamado.status === "em_andamento"
      ).length,
      chamadosConcluidos: formattedChamados.filter(
        (chamado) => chamado.status === "concluido"
      ).length,
      chamadosRecentes: formattedChamados.slice(0, 5),
      equipamentos: [],
      equipamentosAtivos: 0,
      equipamentosEmManutencao: 0,
      equipamentosEmManutencaoList: [],
    };
  }

  const formattedEquipamentos = equipamentos.map((equipamento) => ({
    id: equipamento.id,
    nome: equipamento.nome,
    codigo: equipamento.codigo,
    setor: equipamento.setor,
    dataAquisicao: equipamento.data_aquisicao,
    ultimaManutencao: equipamento.ultima_manutencao,
    status: equipamento.status,
  }));

  return {
    chamados: formattedChamados,
    chamadosNovos: formattedChamados.filter(
      (chamado) => chamado.status === "novo"
    ).length,
    chamadosEmAndamento: formattedChamados.filter(
      (chamado) => chamado.status === "em_andamento"
    ).length,
    chamadosConcluidos: formattedChamados.filter(
      (chamado) => chamado.status === "concluido"
    ).length,
    chamadosRecentes: formattedChamados.slice(0, 5),
    equipamentos: formattedEquipamentos,
    equipamentosAtivos: formattedEquipamentos.filter(
      (equipamento) => equipamento.status === "ativo"
    ).length,
    equipamentosEmManutencao: formattedEquipamentos.filter(
      (equipamento) => equipamento.status === "em_manutencao"
    ).length,
    equipamentosEmManutencaoList: formattedEquipamentos
      .filter((equipamento) => equipamento.status === "em_manutencao")
      .slice(0, 5),
  };
}
