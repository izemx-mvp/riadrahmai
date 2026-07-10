import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  MessageSquareWarning,
  UserPlus,
  Briefcase,
  MessagesSquare,
  Bot,
  Users,
  ClipboardList,
} from "lucide-react";
import logo from "@/assets/logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
];

const agentItems = [
  { title: "Parents & Réclamations", url: "/reclamations", icon: MessageSquareWarning },
  { title: "Service Client & Admissions", url: "/admissions", icon: UserPlus },
  { title: "Recrutement RH", url: "/rh", icon: Briefcase },
];

const workItems = [
  { title: "Tickets & Assignation", url: "/tickets", icon: ClipboardList },
  { title: "Conversations", url: "/conversations", icon: MessagesSquare },
  { title: "Configuration IA", url: "/configuration-ia", icon: Bot },
];

const adminItems = [
  { title: "Utilisateurs", url: "/utilisateurs", icon: Users },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const renderGroup = (label: string, items: typeof mainItems) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-[0.65rem] tracking-wider">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={pathname === item.url}>
                <Link to={item.url} className="gap-3">
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2.5 px-1 py-2">
          <img src={logo} alt="G.S Riad Rahma" width={40} height={40} className="h-9 w-9 rounded-md bg-white/95 p-0.5 shrink-0" />
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold text-sidebar-foreground">Riad Rahma</span>
            <span className="text-[0.7rem] text-gold font-medium">AI Desk</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {renderGroup("Vue globale", mainItems)}
        {renderGroup("Agents IA", agentItems)}
        {renderGroup("Suivi", workItems)}
        {renderGroup("Administration", adminItems)}
      </SidebarContent>
    </Sidebar>
  );
}
