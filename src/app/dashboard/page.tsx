import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth-supabase"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getDashboardData } from "@/lib/data-supabase"
import { ClipboardList, Clock, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  try {
    const user = await requireAuth()

    if (user.role === "admin") {
      redirect("/admin/dashboard")
      return null
    }

    console.log("Carregando dashboard para o usuário:", user.id)
    const { chamados, chamadosNovos, chamadosEmAndamento, chamadosConcluidos, chamadosRecentes } =
      await getDashboardData(user.id)

    return (
      <DashboardShell>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Button asChild>
            <Link href="/chamados/novo">Novo Chamado</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Chamados</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{chamados.length}</div>
              <p className="text-xs text-muted-foreground">Todos os chamados abertos por você</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{chamadosEmAndamento}</div>
              <p className="text-xs text-muted-foreground">Chamados sendo processados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{chamadosConcluidos}</div>
              <p className="text-xs text-muted-foreground">Chamados finalizados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Novos</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{chamadosNovos}</div>
              <p className="text-xs text-muted-foreground">Chamados aguardando atendimento</p>
            </CardContent>
          </Card>
        </div>

        <h2 className="mt-8 mb-4 text-xl font-semibold">Chamados Recentes</h2>

        <div className="space-y-4">
          {chamadosRecentes.length > 0 ? (
            chamadosRecentes.map((chamado) => (
              <Card key={chamado.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{chamado.equipamentoNome}</CardTitle>
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
                    Setor: {chamado.setor} • Aberto em: {new Date(chamado.dataCriacao).toLocaleDateString("pt-BR")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{chamado.descricao}</p>
                  <div className="mt-2 flex justify-end">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/chamados/${chamado.id}`}>Ver Detalhes</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-6 text-center">
                <p className="text-muted-foreground">Você ainda não possui chamados.</p>
                <Button className="mt-4" asChild>
                  <Link href="/chamados/novo">Abrir Novo Chamado</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardShell>
    )
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error)
    return (
      <DashboardShell>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="p-4 text-center">
          <p className="text-red-500">Erro ao carregar dashboard. Tente novamente mais tarde.</p>
        </div>
      </DashboardShell>
    )
  }
}
