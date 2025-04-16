"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

type SidebarContextType = {
  isOpen: boolean
  toggle: () => void
  isAdmin: boolean
  setIsAdmin: (value: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(true)
  const [isAdmin, setIsAdmin] = React.useState(false)
  const pathname = usePathname()

  // Close sidebar on mobile when route changes
  React.useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false)
    }
  }, [pathname])

  const toggle = React.useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  return <SidebarContext.Provider value={{ isOpen, toggle, isAdmin, setIsAdmin }}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
