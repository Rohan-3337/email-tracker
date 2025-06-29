'use client'

import * as React from "react"
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
  SidebarRail,
} from "@/components/ui/sidebar"

import {
  LayoutDashboard,
  Pencil,
  Inbox,
  Send,
  Archive,
  BarChart2,
  PieChart,
  FileText,
  Users,
  Settings,
  CreditCard,
} from "lucide-react"

const iconMap: Record<string, React.ReactNode> = {
  Dashboard: <LayoutDashboard className="w-4 h-4 mr-2" />,
  "Compose Email": <Pencil className="w-4 h-4 mr-2" />,
  Inbox: <Inbox className="w-4 h-4 mr-2" />,
  Sent: <Send className="w-4 h-4 mr-2" />,
  Archived: <Archive className="w-4 h-4 mr-2" />,
  "Email Analytics": <BarChart2 className="w-4 h-4 mr-2" />,
  "Open & Click Rates": <PieChart className="w-4 h-4 mr-2" />,
  Templates: <FileText className="w-4 h-4 mr-2" />,
  Contacts: <Users className="w-4 h-4 mr-2" />,
  "Account Settings": <Settings className="w-4 h-4 mr-2" />,
  Billing: <CreditCard className="w-4 h-4 mr-2" />,
}

const data = {
  navMain: [
    {
      title: "Main",
      items: [
        { title: "Dashboard", url: "/dashboard" },
        { title: "Compose Email", url: "/dashboard/compose" },
        // { title: "Inbox", url: "/dashboard/inbox" },
        { title: "Sent", url: "/dashboard/sent" },
        // { title: "Archived", url: "/dashboard/archived" },
      ],
    },
    {
      title: "Insights",
      items: [
        { title: "Email Analytics", url: "/dashboard/analytics" },
        // { title: "Open & Click Rates", url: "/analytics/engagement" },
      ],
    },
    {
      title: "Resources",
      items: [
        { title: "Templates", url: "/dashboard/template" },
        // { title: "Contacts", url: "/contacts" },
      ],
    },
    // {
    //   title: "Settings",
    //   items: [
    //     { title: "Account Settings", url: "/settings/account" },
    //     { title: "Billing", url: "/settings/billing" },
    //   ],
    // },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-4 border-b">
        <div className="text-xl font-bold tracking-tight text-primary">
         <span className=" text-blue-400">AI</span> Cold Mail
        </div>
        <p className="text-xs text-muted-foreground -mt-1">Smart Outreach. Real Results.</p>
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={false}>
                      <a href={item.url} className="flex items-center hover:text-blue-600 transition-colors">
                        {iconMap[item.title]}
                        {item.title}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
