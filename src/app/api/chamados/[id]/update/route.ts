import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth-supabase"
import { updateChamadoStatus } from "@/lib/data-supabase"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerSupabaseClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Verificar se o usuário é admin
    const { data: userData } = await supabase.from("usuarios").select("role").eq("id", session.user.id).single()

    if (userData?.role !== "admin") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    const { status, observacao } = await request.json()

    const chamado = await updateChamadoStatus(params.id, status, observacao)

    if (!chamado) {
      return NextResponse.json({ error: "Chamado não encontrado" }, { status: 404 })
    }

    return NextResponse.json(chamado)
  } catch (error) {
    console.error("Erro ao atualizar chamado:", error)
    return NextResponse.json({ error: "Erro ao atualizar chamado" }, { status: 500 })
  }
}
