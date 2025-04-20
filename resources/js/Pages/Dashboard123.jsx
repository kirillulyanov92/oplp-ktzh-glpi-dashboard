import { useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { usePage } from "@inertiajs/react";
import AddShiftDialog from "@/Pages/ShiftDialog";

export default function Dashboard() {
  const { shifts } = usePage().props;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Журнал смен</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Добавить смену</Button>
      </div>

      <div className="flex flex-col gap-4">
        {shifts.map((shift) => (
          <Card key={shift.id} className="overflow-hidden rounded-2xl border-2">
            <CardHeader className="bg-primary text-primary-foreground p-6 rounded-t-xl">
              <div>
                <h2 className="text-2xl font-bold">{shift.user.name}</h2>
                <p className="text-primary-foreground/90">{shift.date}</p>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-6 items-start">
                <div className="space-y-4">
                  {shift.comments.length > 0 ? (
                    shift.comments.map((comment, idx) => (
                      <p key={idx} className="text-lg whitespace-pre-wrap">{comment.comment}</p>
                    ))
                  ) : (
                    <p>Замечаний нет.</p>
                  )}
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2">
                <Badge variant="secondary" className="rounded-full px-4 py-2 text-sm">
                  <User className="h-4 w-4 mr-2" />
                  ЗАЯВКИ ЗА СМЕНУ (ВСЕГО: 11[15], ИЗ НИХ - ТАЛГАТ С ТУРГАНОВ: 2[2])
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddShiftDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  );
}

// Подключаем layout
Dashboard.layout = (page) => <DashboardLayout title="Смены">{page}</DashboardLayout>;
