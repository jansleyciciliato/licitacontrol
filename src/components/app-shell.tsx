"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { href: "/dashboard",  label: "Dashboard",  icon: LayoutDashboard },
  { href: "/licitacoes", label: "Licitações", icon: FileText },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) setCollapsed(saved === "true");
    setMounted(true);
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      localStorage.setItem("sidebar-collapsed", String(!prev));
      return !prev;
    });
  };

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  // Evita flash de layout antes de ler o localStorage
  const sidebarW = !mounted ? "w-56" : collapsed ? "w-14" : "w-56";
  const mainML  = !mounted ? "ml-56" : collapsed ? "ml-14" : "ml-56";

  return (
    <div className="flex min-h-screen bg-background">

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col overflow-hidden border-r border-border bg-card transition-[width] duration-200 ease-in-out ${sidebarW}`}
      >

        {/* Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-3">
          <span
            className={`font-heading text-base font-bold text-foreground tracking-tight whitespace-nowrap overflow-hidden transition-all duration-200 ${
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            LicitaControl
          </span>
          <button
            onClick={toggle}
            title={collapsed ? "Expandir menu" : "Recolher menu"}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5 px-2 py-4">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={`flex items-center gap-2.5 rounded-lg py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                } ${collapsed ? "justify-center px-2" : "px-3"}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-200 ${
                    collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="flex flex-col gap-2 border-t border-border px-2 py-4">
          {collapsed ? (
            <Link
              href="/licitacoes/nova"
              title="Nova Licitação"
              className="flex items-center justify-center rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href="/licitacoes/nova"
              className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">Nova Licitação</span>
            </Link>
          )}
          <div className={`flex pt-1 ${collapsed ? "justify-center" : "justify-end pr-1"}`}>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className={`flex-1 transition-[margin] duration-200 ease-in-out ${mainML}`}>
        {children}
      </main>
    </div>
  );
}
