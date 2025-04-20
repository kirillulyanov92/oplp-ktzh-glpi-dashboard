import { usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TicketsIndex() {
  const { tickets } = usePage().props;

  return (
    <DashboardLayout title="Заявки" sidebar="tickets" tickets={tickets}>
      <div className="grid gap-4 md:grid-cols-2">
        {tickets.length === 0 && (
          <p className="text-muted-foreground">Заявок пока нет 💤</p>
        )}

        {tickets.map((ticket, idx) => (
          <Card key={idx}>
            <CardHeader>
              <h2 className="text-lg font-bold">#{ticket[2]} — {ticket[1]}</h2>
              <p className="text-sm text-muted-foreground">Клиент: {ticket[4]}</p>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <p>Филиал: {ticket[8]}</p>
                  <p>Статус: {ticket[12]}</p>
                  <p>Создано: {ticket[15]}</p>
                </div>
                <Badge variant="outline">ID: {ticket[2]}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
