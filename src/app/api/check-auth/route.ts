import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth-supabase"

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ isAuthenticated: false })
    }

    // Verificar se o usuário é admin
    const { data: userData } = await supabase.from("usuarios").select("role").eq("id", session.user.id).single()

    return NextResponse.json({
      isAuthenticated: true,
      isAdmin: userData?.role === "admin",
      userId: session.user.id,
    })
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error)
    return NextResponse.json({ isAuthenticated: false, error: "Erro ao verificar autenticação" }, { status: 500 })
  }
}
