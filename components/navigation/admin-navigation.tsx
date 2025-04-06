"use client"
import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { UserSwitcher } from "../common/user-switcher"
import { BookOpen, Briefcase, Church, LayoutDashboardIcon, Search, Users } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Input } from "../ui/input"

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "IRM Worker management systems",
      url: "#",
      items: [
        {
          title: "Dashboard",
          url: "/page/admin",
          isActive: true,
          icon: <LayoutDashboardIcon className="h-5 w-5" />
        },
        {
          title: "Workers",
          url: "/page/admin/worker",
          isActive: true,
          icon: <Briefcase className="h-5 w-5" />
        },
        {
          title: "Churches",
          url: "/page/admin/church",
          icon: <Church className="h-5 w-5" />,
        },
        {
          title: "Subjects",
          url: "/page/admin/subject",
          isActive: true,
          icon: <BookOpen className="h-5 w-5" />,
        },
        {
          title: "Accounts",
          url: "/page/admin/account",
          isActive: true,
          icon: <Users className="h-5 w-5" />,
        },
      ],
    },
  ],
}

export function AdminNavigation({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredNavItems = data.navMain.map((mainItem) => ({
    ...mainItem,
    items: mainItem.items.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((mainItem) => mainItem.items.length > 0) // filter out empty groups

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <UserSwitcher />
        <div className="p-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search navigation..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {filteredNavItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className={cn(
                        pathname === item.url
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                      asChild
                    >
                      <Link href={item.url}>
                        {item.icon}
                        {item.title}
                      </Link>
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
