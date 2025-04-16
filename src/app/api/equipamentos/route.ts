import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth-supabase"
import { getEquipamentos } from "@/lib/data-supabase"

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const equipamentos = await getEquipamentos()
    return NextResponse.json(equipamentos)
  } catch (error) {
    console.error("Erro ao buscar equipamentos:", error)
    return NextResponse.json({ error: "Erro ao buscar equipamentos" }, { status: 500 })
  }
}
