"use client";
import { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  Settings,
  LogOut,
  Menu as MenuIcon,
  X,
} from "lucide-react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin/login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Menu Management", href: "/admin/menu", icon: UtensilsCrossed },
    { name: "Offer", href: "/admin/offer", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
    { name: "Menu Image", href: "/admin/menu-img", icon: Settings },
  ];

  const isActivePage = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-card border-r border-border transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && <h1 className="text-lg font-serif font-bold text-gold">Visconti Admin</h1>}
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {navigation.map((item) => (
            <Button
              key={item.name}
              variant={isActivePage(item.href) ? "default" : "ghost"}
              className={`w-full justify-start flex items-center gap-3 px-2 py-2 transition-colors ${
                isActivePage(item.href)
                  ? "bg-gold text-black hover:bg-gold-dark"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => navigate(item.href)}
            >
              <item.icon className="w-2 h-5 flex-shrink-0" />
              <span
                className={`transition-opacity duration-300 ${
                  sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                {item.name}
              </span>
            </Button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start flex items-center gap-3 text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span
              className={`transition-opacity duration-300 ${
                sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              Logout
            </span>
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-30 md:hidden transition-transform duration-300 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute inset-0 bg-black/30" onClick={() => setMobileSidebarOpen(false)} />
        <aside className="relative z-40 flex flex-col w-64 h-full bg-card border-r border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-serif font-bold text-gold">Visconti Admin</h1>
            <Button variant="ghost" size="sm" onClick={() => setMobileSidebarOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <nav className="flex-1 space-y-2">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant={isActivePage(item.href) ? "default" : "ghost"}
                className={`w-full justify-start flex items-center gap-3 px-2 py-2 transition-colors ${
                  isActivePage(item.href)
                    ? "bg-gold text-black hover:bg-gold-dark"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => {
                  navigate(item.href);
                  setMobileSidebarOpen(false);
                }}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.name}</span>
              </Button>
            ))}
          </nav>

          <div className="mt-auto">
            <Button
              variant="ghost"
              className="w-full justify-start flex items-center gap-3 text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              Logout
            </Button>
          </div>
        </aside>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="md:hidden p-1"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <MenuIcon className="w-2 h-5" />
            </Button>
            <h2 className="text-xl font-semibold text-foreground">
              {navigation.find((item) => isActivePage(item.href))?.name || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Welcome, Admin</span>
            <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-black">A</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
