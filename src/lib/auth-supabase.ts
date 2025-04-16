"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Função para criar um cliente Supabase no servidor usando a API mais recente
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
    }
  );
}

// Função para autenticar usuário
export async function authenticate(email: string, password: string) {
  const supabase = await createServerSupabaseClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Erro de autenticação:", error.message);
      return { success: false, message: error.message };
    }

    if (!data.user) {
      return { success: false, message: "Credenciais inválidas" };
    }

    // Buscar informações adicionais do usuário
    const { data: userData, error: userError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (userError) {
      console.error("Erro ao buscar dados do usuário:", userError);
      return { success: false, message: "Erro ao buscar dados do usuário" };
    }

    // Agora que você tem o role do usuário, defina o parâmetro myapp.role
    await supabase.rpc("set_myapp_role", { role: userData?.role || "user" });

    return {
      success: true,
      user: {
        id: data.user.id,
        name: userData?.nome || data.user.email?.split("@")[0] || "Usuário",
        email: data.user.email,
        role: userData?.role || "user",
      },
    };
  } catch (error) {
    console.error("Erro de autenticação:", error);
    return { success: false, message: "Erro ao processar autenticação" };
  }
}

// Função para logout
export async function logout() {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Erro ao fazer logout:", error);
    return { success: false };
  }

  return { success: true };
}

// Função para obter o usuário atual
export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.log("Nenhuma sessão encontrada");
      return null;
    }

    console.log("Sessão encontrada para o usuário:", session.user.id);

    // Buscar informações adicionais do usuário
    const { data: userData, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", session.user.id)
      .single();

    // Se não encontrar o usuário na tabela, mas tiver sessão válida,
    // retornar informações básicas do usuário
    if (error || !userData) {
      console.warn(
        "Usuário autenticado, mas não encontrado na tabela usuarios:",
        error
      );
      return {
        id: session.user.id,
        name: session.user.email?.split("@")[0] || "Usuário",
        email: session.user.email,
        role: "user", // Papel padrão
      };
    }

    return {
      id: session.user.id,
      name: userData.nome,
      email: session.user.email,
      role: userData.role,
    };
  } catch (error) {
    console.error("Erro ao obter usuário atual:", error);
    return null;
  }
}

// Middleware para verificar se o usuário está autenticado
export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    console.log("Usuário não autenticado, redirecionando para login");
    redirect("/login");
  }

  console.log("Usuário autenticado:", user.id, user.role);
  return user;
}

// Middleware para verificar se o usuário é admin
export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    console.log("Usuário não autenticado, redirecionando para login");
    redirect("/login");
  }

  if (user.role !== "admin") {
    console.log("Usuário não é admin, redirecionando para dashboard");
    redirect("/dashboard");
  }

  console.log("Usuário admin autenticado:", user.id);
  return user;
}
