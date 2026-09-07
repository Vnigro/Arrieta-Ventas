import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { ExternalLink, LayoutDashboard, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "./ui/sidebar";

const menuItems = [
  { icon: LayoutDashboard, label: "Gestión", path: "/admin" },
  { icon: ExternalLink, label: "Ver sitio", path: "/" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { loading, user, logout } = useAuth();
  const [location, setLocation] = useLocation();

  // 🔒 Salida forzada: si falla la petición al servidor igual limpia la sesión local
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      // Borramos cualquier rastro en localStorage/Cookies y refrescamos la app
      localStorage.clear();
      window.location.href = "/admin";
    }
  };

  if (loading) return <DashboardLayoutSkeleton />;

  // Si el usuario no está autenticado o no está en la lista blanca
  if (!user) {
    return (
      <div className="admin-login-shell">
        <div className="admin-login-card">
          <p className="admin-overline">ARRIETA · Administración</p>
          <h1>INICIÁ SESIÓN<br /><i>PARA GESTIONAR.</i></h1>
          <p>Accedé con la cuenta propietaria para administrar el stock, las consultas y los datos del negocio.</p>
          <Button onClick={() => startLogin()} className="admin-primary w-full">Iniciar sesión</Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border">
        <SidebarHeader className="h-20 justify-center px-3">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="size-8 rounded-none border border-sidebar-border" />
            <div className="group-data-[collapsible=icon]:hidden">
              <p className="font-black italic tracking-[-.08em] text-sidebar-foreground">ARRIETA</p>
              <p className="text-[9px] font-bold tracking-[.14em] text-lime-300">ADMINISTRACIÓN</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu className="px-2">
            {menuItems.map(item => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  isActive={location === item.path} 
                  onClick={() => setLocation(item.path)} 
                  tooltip={item.label} 
                  className="h-11 rounded-none"
                >
                  <item.icon className="size-4" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-3">
          <div className="group-data-[collapsible=icon]:hidden mb-2 flex items-center gap-2">
            <Avatar className="size-7 rounded-none">
              <AvatarFallback className="rounded-none bg-primary text-[10px] font-bold text-primary-foreground">
                {user.name?.charAt(0).toUpperCase() ?? "A"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-sidebar-foreground">{user.name ?? "Administrador"}</p>
              <p className="truncate text-[10px] text-muted-foreground">{user.email ?? "Cuenta propietaria"}</p>
            </div>
          </div>

          <SidebarMenuButton 
            onClick={handleLogout} 
            tooltip="Cerrar sesión" 
            className="h-10 rounded-none text-muted-foreground hover:text-primary"
          >
            <LogOut className="size-4" />
            <span>Cerrar sesión</span>
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b border-border bg-background px-3 md:hidden">
          <SidebarTrigger className="size-8 rounded-none border border-border" />
          <span className="font-black italic tracking-[-.07em]">ARRIETA · ADMIN</span>
        </header>
        <main className="min-h-screen bg-background p-4 md:p-7">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}