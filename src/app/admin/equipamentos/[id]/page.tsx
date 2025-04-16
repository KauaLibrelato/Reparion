"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getEquipamentoById, updateEquipamento, deleteEquipamento } from "@/lib/data-supabase"
import { ArrowLeft, Trash } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function EditarEquipamentoPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
    setor: "",
    dataAquisicao: "",
    ultimaManutencao: "",
    status: "ativo" as "ativo" | "inativo" | "em_manutencao",
  })

  useEffect(() => {
    // Em um ambiente real, isso seria uma chamada de API
    const fetchEquipamento = async () => {
      try {
        const equipamentoData = await getEquipamentoById(params.id)
        if (equipamentoData) {
          setFormData({
            nome: equipamentoData.nome,
            codigo: equipamentoData.codigo,
            setor: equipamentoData.setor,
            dataAquisicao: equipamentoData.dataAquisicao,
            ultimaManutencao: equipamentoData.ultimaManutencao || "",
            status: equipamentoData.status,
          })
        } else {
          router.push("/admin/equipamentos")
        }
      } catch (error) {
        console.error("Erro ao buscar equipamento:", error)
        router.push("/admin/equipamentos")
      }
    }

    fetchEquipamento()
  }, [params.id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Em um ambiente real, isso seria uma chamada de API
      await updateEquipamento(params.id, formData)
      router.push("/admin/equipamentos")
    } catch (error) {
      console.error("Erro ao atualizar equipamento:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      // Em um ambiente real, isso seria uma chamada de API
      await deleteEquipamento(params.id)
      router.push("/admin/equipamentos")
    } catch (error) {
      console.error("Erro ao excluir equipamento:", error)
      alert("Erro ao excluir equipamento: " + (error as Error).message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <DashboardShell>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-4">
          <Link href="/admin/equipamentos">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Editar Equipamento</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Dados do Equipamento</CardTitle>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente este equipamento e removerá seus
                    dados do sistema.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Excluindo..." : "Sim, excluir equipamento"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <CardDescription>Atualize os dados do equipamento conforme necessário.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Equipamento</Label>
              <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input id="codigo" name="codigo" value={formData.codigo} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="setor">Setor</Label>
              <Input id="setor" name="setor" value={formData.setor} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataAquisicao">Data de Aquisição</Label>
              <Input
                id="dataAquisicao"
                name="dataAquisicao"
                type="date"
                value={formData.dataAquisicao}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ultimaManutencao">Última Manutenção</Label>
              <Input
                id="ultimaManutencao"
                name="ultimaManutencao"
                type="date"
                value={formData.ultimaManutencao}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="em_manutencao">Em Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/admin/equipamentos">Cancelar</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </DashboardShell>
  )
}
