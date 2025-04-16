import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth-supabase"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { getChamadoById } from "@/lib/data-supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function ChamadoDetalhesPage({ params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()

    if (!user) {
      redirect("/login")
      return null
    }

    console.log("Buscando detalhes do chamado:", params.id)
    const chamado = await getChamadoById(params.id)

    if (!chamado) {
      console.log("Chamado não encontrado:", params.id)
      redirect("/chamados")
      return null
    }

    // Verificar se o chamado pertence ao usuário atual (para usuários comuns)
    if (user.role !== "admin" && chamado.solicitanteId !== user.id) {
      console.log("Usuário não tem permissão para ver este chamado")
      redirect("/chamados")
      return null
    }

    return (
      <DashboardShell>
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" asChild className="mr-4">
            <Link href="/chamados">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Detalhes do Chamado</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Chamado #{chamado.id}</CardTitle>
                <Badge
                  variant={
                    chamado.status === "novo"
                      ? "secondary"
                      : chamado.status === "em_andamento"
                        ? "default"
                        : chamado.status === "concluido"
                          ? "success"
                          : "outline"
                  }
                >
                  {chamado.status === "novo"
                    ? "Novo"
                    : chamado.status === "em_andamento"
                      ? "Em Andamento"
                      : chamado.status === "concluido"
                        ? "Concluído"
                        : "Cancelado"}
                </Badge>
              </div>
              <CardDescription>
                Aberto em {new Date(chamado.dataCriacao).toLocaleDateString("pt-BR")} às{" "}
                {new Date(chamado.dataCriacao).toLocaleTimeString("pt-BR")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Equipamento</h3>
                <p>{chamado.equipamentoNome}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Setor</h3>
                <p>{chamado.setor}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Prioridade</h3>
                <Badge
                  variant={
                    chamado.prioridade === "alta"
                      ? "destructive"
                      : chamado.prioridade === "media"
                        ? "default"
                        : "outline"
                  }
                >
                  {chamado.prioridade === "alta" ? "Alta" : chamado.prioridade === "media" ? "Média" : "Baixa"}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Descrição</h3>
                <p className="whitespace-pre-line">{chamado.descricao}</p>
              </div>

              {chamado.observacoes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Observações Técnicas</h3>
                  <p className="whitespace-pre-line">{chamado.observacoes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline do Chamado</CardTitle>
              <CardDescription>Histórico de atualizações do chamado</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="relative border-l border-muted">
                {chamado.timeline.map((item, index) => (
                  <li key={index} className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-background bg-primary text-primary-foreground">
                      {index + 1}
                    </span>
                    <h3 className="flex items-center mb-1 text-lg font-semibold">
                      {item.status === "novo"
                        ? "Chamado Aberto"
                        : item.status === "em_andamento"
                          ? "Em Andamento"
                          : item.status === "concluido"
                            ? "Concluído"
                            : "Cancelado"}
                    </h3>
                    <time className="block mb-2 text-sm font-normal leading-none text-muted-foreground">
                      {new Date(item.data).toLocaleDateString("pt-BR")} às{" "}
                      {new Date(item.data).toLocaleTimeString("pt-BR")}
                    </time>
                    {item.observacao && <p className="mb-4 text-sm font-normal">{item.observacao}</p>}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    )
  } catch (error) {
    console.error("Erro ao carregar detalhes do chamado:", error)
    return (
      <DashboardShell>
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" asChild className="mr-4">
            <Link href="/chamados">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Detalhes do Chamado</h1>
        </div>
        <div className="p-4 text-center">
          <p className="text-red-500">Erro ao carregar detalhes do chamado. Tente novamente mais tarde.</p>
        </div>
      </DashboardShell>
    )
  }
}
