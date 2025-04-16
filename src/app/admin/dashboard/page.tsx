/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth-supabase";
import { getAdminDashboardData } from "@/lib/data-supabase";
import {
  AlertCircle,
  CheckCircle,
  ClipboardList,
  Clock,
  Database,
  PenToolIcon as Tool,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Função para carregar os dados do painel do administrador
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await requireAdmin(); // Verifica se o usuário é admin
        console.log("Carregando dashboard admin para o usuário:", user.id);

        const {
          chamadosNovos,
          chamadosEmAndamento,
          chamadosConcluidos,
          chamadosRecentes,
          equipamentos,
          equipamentosAtivos,
          equipamentosEmManutencao,
          equipamentosEmManutencaoList,
        } = await getAdminDashboardData(); // Pega os dados do painel do admin

        setDashboardData({
          chamadosNovos,
          chamadosEmAndamento,
          chamadosConcluidos,
          chamadosRecentes,
          equipamentos,
          equipamentosAtivos,
          equipamentosEmManutencao,
          equipamentosEmManutencaoList,
        });
      } catch (error) {
        console.error("Erro ao carregar dashboard admin:", error);
      }
    };

    fetchData(); // Chama a função para carregar os dados
  }, []); // Esse useEffect roda uma vez quando o componente é montado

  // Se os dados ainda não foram carregados, exibe uma mensagem de carregamento
  if (!dashboardData) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard Administrativo
          </h1>
        </div>
        <p>Carregando o dashboard...</p>
      </DashboardShell>
    );
  }

  // Dados carregados
  const {
    chamadosNovos,
    chamadosEmAndamento,
    chamadosConcluidos,
    chamadosRecentes,
    equipamentos,
    equipamentosEmManutencao,
    equipamentosEmManutencaoList,
  } = dashboardData;

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Administrativo
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Chamados
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {chamadosNovos + chamadosEmAndamento + chamadosConcluidos}
            </div>
            <p className="text-xs text-muted-foreground">
              Todos os chamados no sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Chamados Novos
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chamadosNovos}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando atendimento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chamadosEmAndamento}</div>
            <p className="text-xs text-muted-foreground">
              Chamados sendo processados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chamadosConcluidos}</div>
            <p className="text-xs text-muted-foreground">
              Chamados finalizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipamentos</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipamentos.length}</div>
            <p className="text-xs text-muted-foreground">
              Total de equipamentos cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Manutenção</CardTitle>
            <Tool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipamentosEmManutencao}</div>
            <p className="text-xs text-muted-foreground">
              Equipamentos em manutenção
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Chamados Recentes</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/chamados">Ver Todos</Link>
            </Button>
          </div>

          <div className="space-y-4">
            {chamadosRecentes.length > 0 ? (
              chamadosRecentes.map((chamado: any) => (
                <Card key={chamado.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {chamado.equipamentoNome}
                      </CardTitle>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          chamado.status === "novo"
                            ? "bg-blue-100 text-blue-800"
                            : chamado.status === "em_andamento"
                            ? "bg-yellow-100 text-yellow-800"
                            : chamado.status === "concluido"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {chamado.status === "novo"
                          ? "Novo"
                          : chamado.status === "em_andamento"
                          ? "Em Andamento"
                          : chamado.status === "concluido"
                          ? "Concluído"
                          : "Cancelado"}
                      </div>
                    </div>
                    <CardDescription>
                      Solicitante: {chamado.solicitanteNome} • Setor:{" "}
                      {chamado.setor}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-2">{chamado.descricao}</p>
                    <div className="mt-2 flex justify-end">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/chamados/${chamado.id}`}>
                          Gerenciar
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-6 text-center">
                  <p className="text-muted-foreground">
                    Não há chamados recentes no momento.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              Equipamentos em Manutenção
            </h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/equipamentos">Ver Todos</Link>
            </Button>
          </div>

          <div className="space-y-4">
            {equipamentosEmManutencaoList.length > 0 ? (
              equipamentosEmManutencaoList.map((equipamento: any) => (
                <Card key={equipamento.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {equipamento.nome}
                      </CardTitle>
                      <div className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Em Manutenção
                      </div>
                    </div>
                    <CardDescription>
                      Código: {equipamento.codigo} • Setor: {equipamento.setor}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center text-sm">
                      <span>
                        Aquisição:{" "}
                        {new Date(equipamento.dataAquisicao).toLocaleDateString(
                          "pt-BR"
                        )}
                      </span>
                      {equipamento.ultimaManutencao && (
                        <span>
                          Última manutenção:{" "}
                          {new Date(
                            equipamento.ultimaManutencao
                          ).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/equipamentos/${equipamento.id}`}>
                          Detalhes
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-6 text-center">
                  <p className="text-muted-foreground">
                    Não há equipamentos em manutenção no momento.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
