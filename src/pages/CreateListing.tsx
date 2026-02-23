import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { categories } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

const CreateListing = () => {
  const { toast } = useToast();
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) {
      toast({ title: "Ошибка", description: "Подтвердите состояние вещи", variant: "destructive" });
      return;
    }
    toast({ title: "Объявление создано!", description: "Ваша вещь появится в каталоге после проверки." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-2xl py-8">
        <Link to="/catalog" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" /> Назад
        </Link>

        <h1 className="font-display text-3xl font-bold text-foreground">Сдать вещь в аренду</h1>
        <p className="mt-2 text-muted-foreground">Заполните информацию о вещи. Все поля обязательны.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Название вещи</Label>
            <Input id="title" placeholder="Например: Перфоратор Bosch GBH 2-26" required />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Категория</Label>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea id="description" placeholder="Опишите вещь, её комплектацию и особенности" rows={4} required />
          </div>

          {/* Price + Deposit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Цена за сутки (₽)</Label>
              <Input id="price" type="number" min={1} placeholder="500" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deposit">Депозит (₽)</Label>
              <Input id="deposit" type="number" min={1} placeholder="5000" required />
            </div>
          </div>

          {/* Min days */}
          <div className="space-y-2">
            <Label htmlFor="minDays">Минимальный срок аренды (дней)</Label>
            <Input id="minDays" type="number" min={1} defaultValue={1} required />
          </div>

          {/* Photos */}
          <div className="space-y-2">
            <Label>Фото вещи</Label>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex h-28 w-28 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Upload className="h-6 w-6" />
                <span className="mt-1 text-xs">Загрузить</span>
              </button>
              <button
                type="button"
                className="flex h-28 w-28 items-center justify-center rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Plus className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Conditions */}
          <div className="space-y-2">
            <Label htmlFor="conditions">Условия использования</Label>
            <Textarea id="conditions" placeholder="Опишите условия использования, если есть ограничения" rows={3} />
          </div>

          {/* Confirm checkbox */}
          <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
            <Checkbox
              id="confirm"
              checked={confirmed}
              onCheckedChange={(v) => setConfirmed(v === true)}
            />
            <label htmlFor="confirm" className="text-sm leading-relaxed text-foreground cursor-pointer">
              Я подтверждаю, что вещь исправна и передаётся в указанном состоянии. 
              Я ознакомлен с{" "}
              <span className="text-primary underline">офертой платформы</span>.
            </label>
          </div>

          <Button type="submit" size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Опубликовать объявление
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CreateListing;
