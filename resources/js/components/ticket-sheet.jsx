'use client';

import { useTicketsPolling } from "@/hooks/useTicketsPolling";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { BellOff } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TicketSheet({ open, onOpenChange, }) {
  const { tickets, loading } = useTicketsPolling(60000); // 60 сек

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[340px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Детали заявок</SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto overflow-x-hidden pr-2 h-full">
          <div className="flex flex-col gap-4 p-2 max-h-min">
          {loading && (
              <p className="text-sm text-muted-foreground text-center">Загрузка...</p>
            )}
            {!loading && tickets?.length === 0 && (
              <div className="flex items-center justify-center h-[60vh]">
                <BellOff className="w-4 h-4 mr-2" />
                <p className="text-muted-foreground text-center text-sm">
                  Заявок нет
                </p>
              </div>
            )}

            {!loading && tickets?.map((ticket, idx) => (
              <Card key={idx} className="cursor-pointer">
                <CardContent>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <p>{ticket[8]}</p>
                    <Badge variant="outline" className="text-[10px]">
                      ID: {ticket[2]}
                    </Badge>
                  </div>
                </CardContent>
                <CardHeader>
                  <h2 className="text-xs font-bold uppercase">{ticket[1]}</h2>
                  <p className="text-xs text-muted-foreground">{ticket[15]}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
