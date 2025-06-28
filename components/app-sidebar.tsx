import * as React from "react"

import { SearchForm } from "@/components/search-form"
import { VersionSwitcher } from "@/components/version-switcher"
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

// This is sample data.
const data = {
  versions: ["v1.0.0", "v1.1.0", "v2.0.0-beta"],
  navMain: [
    {
      title: "Main",
      url: "#",
      items: [
        { title: "Dashboard", url: "/dashboard" },
        { title: "Compose Email", url: "/dashboard/compose" },
        { title: "Inbox", url: "/dashboard/inbox" },
        { title: "Sent", url: "/dashboard/sent" },
        { title: "Archived", url: "/dashboard/archived" },
      ],
    },
    {
      title: "Insights",
      url: "#",
      items: [
        { title: "Email Analytics", url: "/analytics" },
        { title: "Open & Click Rates", url: "/analytics/engagement" },
      ],
    },
    {
      title: "Resources",
      url: "#",
      items: [
        { title: "Templates", url: "/templates" },
        { title: "Contacts", url: "/contacts" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      items: [
        { title: "Account Settings", url: "/settings/account" },
        { title: "Billing", url: "/settings/billing" },
      ],
    },
  ],
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={false}>
                      <a href={item.url}>{item.title}</a>
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
