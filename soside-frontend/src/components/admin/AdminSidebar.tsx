"use client"

import * as React from "react"
import {
    LayoutDashboard,
    Briefcase,
    BookOpen,
    Users,
    MessageSquare,
    FileText,
    UserPlus,
    Settings,
    ShieldCheck,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/admin/dashboard",
            icon: LayoutDashboard,
        },
    ],
    modules: [
        {
            title: "Projets",
            url: "/admin/projects",
            icon: Briefcase,
        },
        {
            title: "Formations (LMS)",
            url: "/admin/learning",
            icon: BookOpen,
        },
        {
            title: "Blog",
            url: "/admin/blog",
            icon: FileText,
        },
        {
            title: "Communauté",
            url: "/admin/community",
            icon: MessageSquare,
        },
        {
            title: "Recrutement",
            url: "/admin/recruitment",
            icon: UserPlus,
        },
    ],
    management: [
        {
            title: "Utilisateurs",
            url: "/admin/users",
            icon: Users,
        },
        {
            title: "Rôles & Permissions",
            url: "/admin/roles",
            icon: ShieldCheck,
        },
        {
            title: "Paramètres",
            url: "/admin/settings",
            icon: Settings,
        },
    ],
}

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar variant="inset" collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <ShieldCheck className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">SOSIDE Admin</span>
                                    <span className="text-xs text-muted-foreground">v1.0.0</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarHeader>
                        <SidebarGroupLabel>Général</SidebarGroupLabel>
                    </SidebarHeader>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {data.navMain.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Modules</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {data.modules.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname.startsWith(item.url)}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-auto">
                    <SidebarGroupLabel>Système</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {data.management.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname.startsWith(item.url)}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                {/* User profile section could go here */}
            </SidebarFooter>
        </Sidebar>
    )
}
