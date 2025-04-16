"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Status } from "@/lib/supabase"

export default function AdminChamadoDetalhesPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [chamado, setChamado] = useState<any>(null)
  const [status, setStatus] = useState<Status>("novo")
  const [observacao, setObservacao] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Verificar se o usuário está autenticado e é admin
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/check-auth")
        const data = await response.json()

        if (!data.isAuthenticated) {
          router.push("/login")
          return
        }

        if (!data.isAdmin) {
          router.push("/dashboard")
          return
        }

        // Buscar dados do chamado
        fetchChamado()
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  // Adicionar logs para depuração
  const fetchChamado = async () => {
    try {
      setIsLoading(true)
      console.log("Buscando chamado:", params.id)
      const response = await fetch(`/api/chamados/${params.id}`)

      if (!response.ok) {
        console.error("Resposta não ok:", response.status, response.statusText)
        throw new Error("Erro ao buscar chamado")
      }

      const chamadoData = await response.json()
      console.log("Chamado recebido:", chamadoData)

      if (chamadoData) {
        setChamado(chamadoData)
        setStatus(chamadoData.status)
      } else {
        console.log("Chamado não encontrado, redirecionando")
        router.push("/admin/chamados")
      }
    } catch (error) {
      console.error("Erro ao buscar chamado:", error)
      setError("Erro ao carregar dados do chamado. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/chamados/${params.id}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, observacao }),
      })

      if (!response.ok) {
        throw new Error("Erro ao atualizar chamado")
      }

      const updatedChamado = await response.json()
      setChamado(updatedChamado)
      setObservacao("")
      alert("Chamado atualizado com sucesso!")
    } catch (error) {
      console.error("Erro ao atualizar chamado:", error)
      alert("Erro ao atualizar chamado. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-full">
          <p>Carregando...</p>
        </div>
      </DashboardShell>
    )
  }

  if (error) {
    return (
      <DashboardShell>
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" asChild className="mr-4">
            <Link href="/admin/chamados">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Chamado</h1>
        </div>
        <div className="p-4 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </DashboardShell>
    )
  }

  if (!chamado) {
    return (
      <DashboardShell>
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" asChild className="mr-4">
            <Link href="/admin/chamados">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Chamado</h1>
        </div>
        <div className="p-4 text-center">
          <p className="text-muted-foreground">Chamado não encontrado.</p>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-4">
          <Link href="/admin/chamados">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Chamado</h1>
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
              Solicitante: {chamado.solicitanteNome} • Aberto em{" "}
              {new Date(chamado.dataCriacao).toLocaleDateString("pt-BR")}
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
                  chamado.prioridade === "alta" ? "destructive" : chamado.prioridade === "media" ? "default" : "outline"
                }
              >
                {chamado.prioridade === "alta" ? "Alta" : chamado.prioridade === "media" ? "Média" : "Baixa"}
              </Badge>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Descrição</h3>
              <p className="whitespace-pre-line">{chamado.descricao}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Atualizar Status</CardTitle>
              <CardDescription>Atualize o status do chamado e adicione observações técnicas</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(value) => setStatus(value as Status)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="novo">Novo</SelectItem>
                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacao">Observações Técnicas</Label>
                  <Textarea
                    id="observacao"
                    placeholder="Adicione detalhes sobre o atendimento..."
                    rows={4}
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Atualizando..." : "Atualizar Chamado"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline do Chamado</CardTitle>
              <CardDescription>Histórico de atualizações</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="relative border-l border-muted">
                {chamado.timeline.map((item: any, index: number) => (
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
      </div>
    </DashboardShell>
  )
}
