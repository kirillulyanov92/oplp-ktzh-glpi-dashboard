'use client';

import { Button } from "@/components/ui/button";
import { PanelRightOpen } from "lucide-react";

export function SidebarRightTrigger({ onClick }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="text-muted-foreground"
    >
      <PanelRightOpen className="h-4 w-4" />
      <span className="sr-only">Открыть правую панель</span>
    </Button>
  );
}
