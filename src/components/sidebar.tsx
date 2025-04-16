"use client";

import { useSidebar } from "@/components/sidebar-provider";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth-supabase";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ClipboardList,
  Database,
  LayoutDashboard,
  LogOut,
  Menu,
  PenToolIcon as Tool,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { isOpen, toggle, isAdmin, setIsAdmin } = useSidebar();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Garantir que o componente só seja renderizado no cliente
  useEffect(() => {
    setIsClient(true);

    // Verificar se o usuário está autenticado no cliente
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/check-auth");
        const data = await response.json();

        if (data.isAuthenticated) {
          setIsAdmin(data.isAdmin);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
      }
    };

    checkAuth();
  }, [setIsAdmin, router]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const result = await logout();
      if (result.success) {
        router.push("/login");
      } else {
        console.error("Erro ao fazer logout");
        alert("Erro ao fazer logout. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!isClient) return null;

  return (
    <>
      <div className="h-16 items-center gap-2 px-4 md:h-[60px] flex sticky top-0 z-30 bg-background">
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          onClick={toggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex-1 flex items-center justify-between">
          <Link
            href={isAdmin ? "/admin/dashboard" : "/dashboard"}
            className="flex items-center gap-2 font-semibold"
          >
            <Tool className="h-5 w-5" />
            <span className="font-bold">Reparion</span>
          </Link>
        </div>
      </div>
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-[270px] border-r bg-background pt-16 transition-transform md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex h-full flex-col gap-4 px-3 py-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Tool className="h-5 w-5" />
              <span className="font-semibold">Reparion</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="md:hidden"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-auto py-2">
            <nav className="grid gap-1 px-2">
              <Link
                href={isAdmin ? "/admin/dashboard" : "/dashboard"}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === "/dashboard" || pathname === "/admin/dashboard"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>

              <Link
                href={isAdmin ? "/admin/chamados" : "/chamados"}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname.includes("/chamados")
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <ClipboardList className="h-5 w-5" />
                Chamados
              </Link>

              {isAdmin && (
                <Link
                  href="/admin/equipamentos"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname.includes("/equipamentos")
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <Database className="h-5 w-5" />
                  Equipamentos
                </Link>
              )}
            </nav>
          </div>

          <div className="mt-auto border-t pt-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="h-5 w-5" />
              {isLoggingOut ? "Saindo..." : "Sair"}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
