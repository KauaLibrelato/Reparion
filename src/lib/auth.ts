"use server"

import { cookies } from "next/headers"

// Simulação de banco de dados de usuários
const users = [
  {
    id: "1",
    email: "usuario@exemplo.com",
    password: "senha123",
    name: "Usuário Comum",
    role: "user",
  },
  {
    id: "2",
    email: "admin@exemplo.com",
    password: "admin123",
    name: "Administrador",
    role: "admin",
  },
]

export async function authenticate(email: string, password: string) {
  // Em produção, use bcrypt para comparar senhas e um banco de dados real
  const user = users.find((user) => user.email === email && user.password === password)

  if (!user) {
    return { success: false, message: "Credenciais inválidas" }
  }

  // Armazenar informações do usuário em cookies
  const cookieStore = cookies()
  cookieStore.set("user-id", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 semana
    path: "/",
  })
  cookieStore.set("user-role", user.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }
}

export async function logout() {
  const cookieStore = cookies()
  cookieStore.delete("user-id")
  cookieStore.delete("user-role")
  return { success: true }
}

export async function getCurrentUser() {
  const cookieStore = cookies()
  const userId = cookieStore.get("user-id")?.value
  const userRole = cookieStore.get("user-role")?.value

  if (!userId) return null

  const user = users.find((user) => user.id === userId)
  if (!user) return null

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: userRole || user.role,
  }
}
