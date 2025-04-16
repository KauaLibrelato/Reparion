import type React from "react"
import { Sidebar } from "@/components/sidebar"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Sidebar />
      <div className="flex-1 md:ml-[270px]">
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
