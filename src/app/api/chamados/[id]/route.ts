import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth-supabase"
import { getChamadoById } from "@/lib/data-supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
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

    console.log("Admin buscando chamado:", params.id)
    const chamado = await getChamadoById(params.id)

    if (!chamado) {
      console.log("Chamado não encontrado:", params.id)
      return NextResponse.json({ error: "Chamado não encontrado" }, { status: 404 })
    }

    console.log("Chamado encontrado:", chamado.id)
    return NextResponse.json(chamado)
  } catch (error) {
    console.error("Erro ao buscar chamado:", error)
    return NextResponse.json({ error: "Erro ao buscar chamado" }, { status: 500 })
  }
}
