import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth-supabase"

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Verificar se o usuário é admin
    const { data: userData, error: userError } = await supabase
      .from("usuarios")
      .select("role")
      .eq("id", session.user.id)
      .single()

    if (userError) {
      return NextResponse.json({ error: "Erro ao verificar permissões", details: userError }, { status: 500 })
    }

    // Testar acesso à tabela de chamados
    const { data: chamados, error: chamadosError } = await supabase.from("chamados").select("id").limit(1)

    // Testar acesso à tabela de equipamentos
    const { data: equipamentos, error: equipamentosError } = await supabase.from("equipamentos").select("id").limit(1)

    return NextResponse.json({
      user: {
        id: session.user.id,
        role: userData?.role,
      },
      permissions: {
        chamados: {
          success: !chamadosError,
          error: chamadosError ? chamadosError.message : null,
          count: chamados?.length || 0,
        },
        equipamentos: {
          success: !equipamentosError,
          error: equipamentosError ? equipamentosError.message : null,
          count: equipamentos?.length || 0,
        },
      },
    })
  } catch (error) {
    console.error("Erro ao verificar permissões:", error)
    return NextResponse.json({ error: "Erro ao verificar permissões" }, { status: 500 })
  }
}
