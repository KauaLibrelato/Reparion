"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addEquipamento } from "@/lib/data-supabase"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NovoEquipamentoPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
    setor: "",
    dataAquisicao: new Date().toISOString().split("T")[0],
    status: "ativo" as "ativo" | "inativo" | "em_manutencao",
  })

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
      await addEquipamento(formData)
      router.push("/admin/equipamentos")
    } catch (error) {
      console.error("Erro ao criar equipamento:", error)
    } finally {
      setIsSubmitting(false)
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
        <h1 className="text-3xl font-bold tracking-tight">Novo Equipamento</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Cadastro de Equipamento</CardTitle>
          <CardDescription>Preencha os dados abaixo para cadastrar um novo equipamento.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Equipamento</Label>
              <Input
                id="nome"
                name="nome"
                placeholder="Ex: Impressora HP LaserJet"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                name="codigo"
                placeholder="Ex: IMP001"
                value={formData.codigo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="setor">Setor</Label>
              <Input
                id="setor"
                name="setor"
                placeholder="Ex: Administrativo"
                value={formData.setor}
                onChange={handleChange}
                required
              />
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
              {isSubmitting ? "Cadastrando..." : "Cadastrar Equipamento"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </DashboardShell>
  )
}
