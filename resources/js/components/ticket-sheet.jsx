'use client';

import { useTicketsPolling } from "@/hooks/useTicketsPolling";
import { useState } from "react"; // Добавляем импорт useState для обработки состояния

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BellOff } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios"; // Добавляем axios для выполнения запросов

export function decodeHtmlAndParse(encodedHtml) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = encodedHtml;
  const decoded = textarea.value;

  const div = document.createElement("div");
  div.innerHTML = decoded;

  const parsedBlocks = [];

  Array.from(div.children).forEach((child) => {
    const strong = child.querySelector("strong");
    if (strong) {
      const label = strong.textContent
        .trim()
        .replace(/^(\d+\))?\s*/g, "")
        .replace(" :", "");
      const value = child.innerText.replace(strong.textContent, "").trim();
      parsedBlocks.push({ label, value });
    }
  });

  // 👉 Если не нашли структурированных блоков, просто разобьём по строкам
  if (parsedBlocks.length === 0) {
    const lines = decoded.split("\n").map((line) => line.trim()).filter(Boolean);
    return lines.map((line, index) => ({ label: `Строка ${index + 1}`, value: line }));
  }

  return parsedBlocks;
}

export function TicketSheet({ open, onOpenChange, }) {
  const { tickets, loading, error, setTickets } = useTicketsPolling(60000); // 60 сек
  const [processingIds, setProcessingIds] = useState([]); // Состояние для отслеживания процесса закрытия
  
  const handleClose = async (ticketId) => {
    // Добавляем ID в список обрабатываемых
    setProcessingIds(prev => [...prev, ticketId]);
    
    try {
      // Получаем CSRF-токен из мета-тега
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      const res = await axios.patch(`/tickets/${ticketId}/close`, {}, {
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      console.log('Закрытие тикета с ID:', ticketId);


      if (res.data.success) {
        // Обновляем список тикетов, удаляя закрытый
        setTickets(prev => prev.filter(ticket => ticket[2] !== ticketId));
        alert('Тикет закрыт');
      } else {
        alert(res.data.message || 'Ошибка при закрытии тикета');
      }
    } catch (error) {
      console.error('Ошибка при закрытии тикета:', error);
      alert('Ошибка при закрытии тикета');
    } finally {
      // Убираем ID из списка обрабатываемых
      setProcessingIds(prev => prev.filter(id => id !== ticketId));
    }
  };

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
              <Card key={idx} className="cursor-pointer group relative">
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
                <CardContent className="max-h-0 overflow-hidden opacity-0 transform scale-95 transition-all duration-300 ease-in-out
             group-hover:max-h-[500px] group-hover:opacity-100 group-hover:scale-100" >
                {decodeHtmlAndParse(ticket[21]).map((item, i) => (
                <div key={i} className="mb-1 text-xs text-muted-foreground">
                  <span className="font-semibold text-white/80">{item.label}:</span>{" "}
                  <span className="">{item.value}</span>
                </div>
                ))}
                </CardContent>
                <div className="p-4 pt-0">
                  <Button 
                    onClick={() => handleClose(ticket[2])}
                    disabled={processingIds.includes(ticket[2])}
                    variant="destructive"
                    size="sm"
                    className="w-full"
                  >
                    {processingIds.includes(ticket[2]) ? 'Закрытие...' : 'Закрыть заявку'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}