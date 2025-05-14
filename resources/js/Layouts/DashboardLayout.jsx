import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavActions } from "@/components/nav-actions";
import { SidebarRightTrigger } from "@/components/sidebar-right-trigger";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { TicketSheet } from "@/components/ticket-sheet";


export default function DashboardLayout({ children, title = "Панель", sidebar = "default" }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isTicketsLayout = sidebar === "tickets";

  return (
    <>
      <SidebarProvider>
        <div className="flex w-full h-full">
          <AppSidebar />
          <SidebarContent title={title} onOpenRight={() => setIsSheetOpen(true)}>
            {children}
          </SidebarContent>
        </div>
      </SidebarProvider>

      {isTicketsLayout && (
        <TicketSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
      )}
    </>
  );
}

function SidebarContent({ title, children, onOpenRight }) {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Главная</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto px-3">
          <NavActions>
          {title === "Заявки" && (
            <SidebarRightTrigger onClick={onOpenRight} />
          )}
          </NavActions>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {children}
      </div>
    </SidebarInset>
  );
}
