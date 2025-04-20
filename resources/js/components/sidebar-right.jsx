import * as React from "react"
import { Plus, BellOff } from "lucide-react"

import { usePage } from "@inertiajs/react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function SidebarRight(props) {
  const { tickets } = usePage().props

  return (
    <Sidebar
      collapsible="none"
      className="sticky hidden lg:flex top-0 h-svh border-l"
      {...props}
    >
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser
          user={{
            name: "shadcn",
            email: "m@example.com",
            avatar: "/avatars/shadcn.jpg",
          }}
        />
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto overflow-x-hidden pr-2">
        <div className="flex flex-col gap-4 p-2 max-h-min">
          {tickets?.length === 0 && (
          <div className="flex items-center justify-center h-[60vh]">
            <BellOff className="w-4 h-4 mr-2"/>
            <p className="text-muted-foreground text-center text-sm">
              Заявок Нет
            </p>
          </div> )}
          {tickets?.map((ticket, idx) => (
            <Card key={idx}>
              <CardContent>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <p>{ticket[8]}</p>
                  <Badge variant="outline" className="text-[10px]">
                    ID: {ticket[2]}
                  </Badge>
                </div>
              </CardContent>
              <CardHeader>
                <h2 className="text-xs font-bold uppercase">
                  {ticket[1]}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {ticket[15]}
                </p>
              </CardHeader>
            </Card>
          ))}
        </div>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Plus className="w-4 h-4" />
              <span className="text-sm">Новая заявка</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
