import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "@inertiajs/react";

export default function AddShiftDialog({ open, onClose }) {
  const { data, setData, post, processing } = useForm({
    type: "day",
    comment: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/shifts", {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить смену</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Select onValueChange={(value) => setData("type", value)} defaultValue={data.type}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип смены" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Дневная</SelectItem>
                <SelectItem value="night">Ночная</SelectItem>
              </SelectContent>
            </Select>

            <Textarea placeholder="Введите комментарий" value={data.comment} onChange={(e) => setData("comment", e.target.value)} />

            <DialogFooter>
              <Button type="submit" disabled={processing}>
                Сохранить
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
