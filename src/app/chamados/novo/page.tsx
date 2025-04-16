"use client";

import type React from "react";

import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addChamado } from "@/lib/data-supabase";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Equipamento {
  id: string;
  nome: string;
  codigo: string;
  setor: string;
}

export default function NovoChamadoPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);

  const [formData, setFormData] = useState({
    equipamentoId: "",
    equipamentoNome: "",
    setor: "",
    descricao: "",
    prioridade: "media" as "baixa" | "media" | "alta",
    solicitanteId: "",
  });

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/check-auth");
        const data = await response.json();

        if (!data.isAuthenticated) {
          router.push("/login");
          return;
        }

        setUserId(data.userId);
        setFormData((prev) => ({ ...prev, solicitanteId: data.userId }));

        // Buscar equipamentos
        await fetchEquipamentos();
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchEquipamentos = async () => {
    try {
      const response = await fetch("/api/equipamentos");
      if (!response.ok) {
        throw new Error("Erro ao buscar equipamentos");
      }
      const data = await response.json();
      setEquipamentos(data);
    } catch (error) {
      console.error("Erro ao buscar equipamentos:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "equipamentoId" && value === "novo") {
      setShowNovoEquipamento(true);
      setFormData((prev) => ({ ...prev, equipamentoId: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Se selecionou um equipamento existente, preencher o setor automaticamente
      if (name === "equipamentoId" && value) {
        const equipamento = equipamentos.find((eq) => eq.id === value);
        if (equipamento) {
          setFormData((prev) => ({ ...prev, setor: equipamento.setor }));
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addChamado(formData);
      router.push("/chamados");
    } catch (error) {
      console.error("Erro ao criar chamado:", error);
      alert("Erro ao criar chamado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-full">
          <p>Carregando...</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-4">
          <Link href="/chamados">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Novo Chamado</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Abertura de Chamado</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para abrir um novo chamado de manutenção.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="equipamentoId">Equipamento</Label>
              <Select
                value={formData.equipamentoId}
                onValueChange={(value) =>
                  handleSelectChange("equipamentoId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um equipamento" />
                </SelectTrigger>
                <SelectContent>
                  {equipamentos.map((equipamento) => (
                    <SelectItem key={equipamento.id} value={equipamento.id}>
                      {equipamento.nome} ({equipamento.codigo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label htmlFor="prioridade">Prioridade</Label>
              <Select
                value={formData.prioridade}
                onValueChange={(value) =>
                  handleSelectChange("prioridade", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição do Problema</Label>
              <Textarea
                id="descricao"
                name="descricao"
                placeholder="Descreva o problema em detalhes..."
                rows={5}
                value={formData.descricao}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/chamados">Cancelar</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting || !userId}>
              {isSubmitting ? "Enviando..." : "Enviar Chamado"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </DashboardShell>
  );
}
