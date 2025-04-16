import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth-supabase"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { getChamadosByUsuario } from "@/lib/data-supabase"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function ChamadosPage() {
  try {
    const user = await requireAuth()

    if (!user) {
      console.log("Usuário não autenticado na página de chamados")
      redirect("/login")
      return null
    }

    console.log("Buscando chamados para o usuário:", user.id)
    const chamados = await getChamadosByUsuario(user.id)

    return (
      <DashboardShell>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Meus Chamados</h1>
          <Button asChild>
            <Link href="/chamados/novo">Novo Chamado</Link>
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Equipamento</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chamados.length > 0 ? (
                chamados.map((chamado) => (
                  <TableRow key={chamado.id}>
                    <TableCell className="font-medium">{chamado.id.substring(0, 8)}</TableCell>
                    <TableCell>{chamado.equipamentoNome}</TableCell>
                    <TableCell>{chamado.setor}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>{new Date(chamado.dataCriacao).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/chamados/${chamado.id}`}>Ver</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Nenhum chamado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DashboardShell>
    )
  } catch (error) {
    console.error("Erro ao carregar página de chamados:", error)
    return (
      <DashboardShell>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Meus Chamados</h1>
          <Button asChild>
            <Link href="/chamados/novo">Novo Chamado</Link>
          </Button>
        </div>
        <div className="p-4 text-center">
          <p className="text-red-500">Erro ao carregar chamados. Tente novamente mais tarde.</p>
        </div>
      </DashboardShell>
    )
  }
}
