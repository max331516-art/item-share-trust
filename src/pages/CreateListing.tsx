import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { categories } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const CreateListing = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [minDays, setMinDays] = useState("1");
  const [conditions, setConditions] = useState("");
  const [location, setLocation] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (imageFiles.length + files.length > 5) {
      toast({ title: "Максимум 5 фото", variant: "destructive" });
      return;
    }
    setImageFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreviews((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({ title: "Войдите в аккаунт", description: "Для создания объявления нужна авторизация", variant: "destructive" });
      navigate("/auth");
      return;
    }

    if (!confirmed) {
      toast({ title: "Ошибка", description: "Подтвердите состояние вещи", variant: "destructive" });
      return;
    }

    if (!category) {
      toast({ title: "Ошибка", description: "Выберите категорию", variant: "destructive" });
      return;
    }

    setLoading(true);

    // Upload images
    const imageUrls: string[] = [];
    for (const file of imageFiles) {
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("item-images").upload(path, file);
      if (error) {
        toast({ title: "Ошибка загрузки фото", description: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from("item-images").getPublicUrl(path);
      imageUrls.push(publicUrl);
    }

    // Insert item
    const { error } = await supabase.from("items").insert({
      owner_id: user.id,
      title,
      category,
      description,
      price_per_day: parseInt(price),
      deposit: parseInt(deposit),
      min_days: parseInt(minDays),
      conditions: conditions || null,
      location: location || null,
      images: imageUrls,
    });

    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Объявление создано!", description: "Ваша вещь появилась в каталоге." });
      navigate("/catalog");
    }
    setLoading(false);
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

        {!user && (
          <div className="mt-4 rounded-xl border border-accent bg-accent/10 p-4 text-sm">
            <Link to="/auth" className="font-medium text-primary hover:underline">Войдите в аккаунт</Link>
            {" "}чтобы создать объявление.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Название вещи</Label>
            <Input id="title" placeholder="Например: Перфоратор Bosch GBH 2-26" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label>Категория</Label>
            <Select value={category} onValueChange={setCategory} required>
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

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea id="description" placeholder="Опишите вещь, её комплектацию и особенности" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Цена за сутки (₽)</Label>
              <Input id="price" type="number" min={1} placeholder="500" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deposit">Депозит (₽)</Label>
              <Input id="deposit" type="number" min={1} placeholder="5000" value={deposit} onChange={(e) => setDeposit(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minDays">Мин. срок аренды (дней)</Label>
              <Input id="minDays" type="number" min={1} value={minDays} onChange={(e) => setMinDays(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Местоположение</Label>
              <Input id="location" placeholder="Москва, м. Таганская" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
          </div>

          {/* Photos */}
          <div className="space-y-2">
            <Label>Фото вещи (до 5 шт.)</Label>
            <div className="flex flex-wrap gap-3">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative h-28 w-28 overflow-hidden rounded-xl border">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {imageFiles.length < 5 && (
                <label className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                  <Upload className="h-6 w-6" />
                  <span className="mt-1 text-xs">Загрузить</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageAdd} multiple />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="conditions">Условия использования</Label>
            <Textarea id="conditions" placeholder="Опишите условия использования, если есть ограничения" rows={3} value={conditions} onChange={(e) => setConditions(e.target.value)} />
          </div>

          <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
            <Checkbox id="confirm" checked={confirmed} onCheckedChange={(v) => setConfirmed(v === true)} />
            <label htmlFor="confirm" className="cursor-pointer text-sm leading-relaxed text-foreground">
              Я подтверждаю, что вещь исправна и передаётся в указанном состоянии.
              Я ознакомлен с <span className="text-primary underline">офертой платформы</span>.
            </label>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={loading || !user}
          >
            {loading ? "Публикация..." : "Опубликовать объявление"}
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CreateListing;
