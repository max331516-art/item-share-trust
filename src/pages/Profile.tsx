import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ItemCard from "@/components/ItemCard";
import { ArrowLeft, Camera, Package, ShoppingBag } from "lucide-react";

interface ProfileData {
  name: string;
  phone: string;
  avatar_url: string | null;
  rating: number;
  rentals_count: number;
}

interface DbItem {
  id: string;
  title: string;
  category: string;
  description: string;
  price_per_day: number;
  deposit: number;
  min_days: number;
  images: string[];
  location: string | null;
  rating: number | null;
  reviews_count: number | null;
  status: string;
}

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [myItems, setMyItems] = useState<DbItem[]>([]);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (data) {
        setProfile(data as ProfileData);
        setName(data.name || "");
        setPhone(data.phone || "");
      }
    };

    const fetchItems = async () => {
      const { data } = await supabase
        .from("items")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setMyItems(data as DbItem[]);
    };

    fetchProfile();
    fetchItems();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ name, phone })
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Профиль обновлён" });
      setProfile((p) => (p ? { ...p, name, phone } : p));
      setEditing(false);
    }
    setSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    const path = `${user.id}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file);

    if (uploadError) {
      toast({ title: "Ошибка загрузки", description: uploadError.message, variant: "destructive" });
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);

    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("user_id", user.id);
    setProfile((p) => (p ? { ...p, avatar_url: publicUrl } : p));
    toast({ title: "Аватар обновлён" });
  };

  if (authLoading || !user) return null;

  const itemsForCard = myItems.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    description: item.description,
    pricePerDay: item.price_per_day,
    deposit: item.deposit,
    minDays: item.min_days,
    images: item.images.length > 0 ? item.images : ["/placeholder.svg"],
    owner: {
      name: profile?.name || "",
      avatar: profile?.avatar_url || "",
      rating: profile?.rating || 0,
      rentalsCount: profile?.rentals_count || 0,
    },
    location: item.location || "",
    rating: Number(item.rating) || 0,
    reviewsCount: Number(item.reviews_count) || 0,
    condition: "Хорошее",
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-3xl py-8">
        <Link to="/" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" /> На главную
        </Link>

        {/* Profile card */}
        <div className="rounded-xl border bg-card p-6 card-shadow">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-muted">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Аватар" className="h-full w-full object-cover" />
                ) : (
                  <Camera className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Camera className="h-3.5 w-3.5" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
            </div>
            <div className="flex-1">
              {editing ? (
                <div className="space-y-3">
                  <div>
                    <Label>Имя</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div>
                    <Label>Телефон</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 999 123 45 67" />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveProfile} disabled={saving}>
                      {saving ? "Сохранение..." : "Сохранить"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditing(false)}>Отмена</Button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-xl font-bold text-foreground">{profile?.name || "Без имени"}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {profile?.phone && <p className="text-sm text-muted-foreground">{profile.phone}</p>}
                  <Button size="sm" variant="outline" className="mt-2" onClick={() => setEditing(true)}>
                    Редактировать
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="items" className="mt-8">
          <TabsList className="w-full">
            <TabsTrigger value="items" className="flex-1 gap-2">
              <Package className="h-4 w-4" /> Мои вещи ({myItems.length})
            </TabsTrigger>
            <TabsTrigger value="rentals" className="flex-1 gap-2">
              <ShoppingBag className="h-4 w-4" /> Мои аренды
            </TabsTrigger>
          </TabsList>
          <TabsContent value="items" className="mt-4">
            {myItems.length === 0 ? (
              <div className="rounded-xl border bg-card p-10 text-center">
                <Package className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-3 text-muted-foreground">У вас пока нет объявлений</p>
                <Link to="/create">
                  <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                    Сдать вещь в аренду
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {itemsForCard.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="rentals" className="mt-4">
            <div className="rounded-xl border bg-card p-10 text-center">
              <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-muted-foreground">У вас пока нет аренд</p>
              <Link to="/catalog">
                <Button variant="outline" className="mt-4">Перейти в каталог</Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
