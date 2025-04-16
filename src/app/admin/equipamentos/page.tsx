import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth-supabase"
import { DashboardShell } from "@/components/dashboard-shell"
import { getEquipamentos } from "@/lib/data-supabase"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AdminEquipamentosPage() {
  const user = await requireAdmin()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/dashboard")
  }

  const equipamentos = await getEquipamentos()

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Equipamentos</h1>
        <Button asChild>
          <Link href="/admin/equipamentos/novo">Novo Equipamento</Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Setor</TableHead>
              <TableHead>Data de Aquisição</TableHead>
              <TableHead>Última Manutenção</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipamentos.length > 0 ? (
              equipamentos.map((equipamento) => (
                <TableRow key={equipamento.id}>
                  <TableCell className="font-medium">{equipamento.codigo}</TableCell>
                  <TableCell>{equipamento.nome}</TableCell>
                  <TableCell>{equipamento.setor}</TableCell>
                  <TableCell>{new Date(equipamento.dataAquisicao).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>
                    {equipamento.ultimaManutencao
                      ? new Date(equipamento.ultimaManutencao).toLocaleDateString("pt-BR")
                      : "Nunca realizada"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        equipamento.status === "ativo"
                          ? "success"
                          : equipamento.status === "em_manutencao"
                            ? "default"
                            : "outline"
                      }
                    >
                      {equipamento.status === "ativo"
                        ? "Ativo"
                        : equipamento.status === "em_manutencao"
                          ? "Em Manutenção"
                          : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/equipamentos/${equipamento.id}`}>Editar</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum equipamento encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </DashboardShell>
  )
}
