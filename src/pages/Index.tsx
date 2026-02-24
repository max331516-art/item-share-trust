import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Camera, CreditCard, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ItemCard from "@/components/ItemCard";
import { categories } from "@/lib/mock-data";
import type { Item } from "@/lib/mock-data";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-rental.jpg";

const fetchPopularItems = async (): Promise<Item[]> => {
  const { data: items } = await supabase
    .from("items")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(6);

  if (!items || items.length === 0) return [];

  const ownerIds = [...new Set((items as any[]).map((i) => i.owner_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .in("user_id", ownerIds);

  const profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p]));

  return (items as any[]).map((item) => {
    const profile = profileMap.get(item.owner_id);
    return {
      id: item.id,
      title: item.title,
      category: item.category,
      description: item.description || "",
      pricePerDay: item.price_per_day,
      deposit: item.deposit,
      minDays: item.min_days,
      images: item.images?.length > 0 ? item.images : ["/placeholder.svg"],
      owner: {
        name: profile?.name || "Пользователь",
        avatar: profile?.avatar_url || "",
        rating: Number(profile?.rating) || 0,
        rentalsCount: Number(profile?.rentals_count) || 0,
      },
      location: item.location || "",
      rating: Number(item.rating) || 0,
      reviewsCount: Number(item.reviews_count) || 0,
      condition: "Хорошее",
    };
  });
};

const Index = () => {
  const { data: popularItems = [] } = useQuery({
    queryKey: ["popular-items"],
    queryFn: fetchPopularItems,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="hero-gradient absolute inset-0 opacity-5" />
        <div className="container relative py-20 md:py-28">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="animate-fade-in">
              <h1 className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
                Арендуй вещи
                <br />
                <span className="text-primary">у соседей</span>
              </h1>
              <p className="mt-5 max-w-lg text-lg text-muted-foreground">
                Зачем покупать дрель на один раз? Возьми у того, кто рядом.
                Безопасно, с депозитом и фотофиксацией.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/catalog">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 hero-shadow">
                    <Search className="mr-2 h-5 w-5" />
                    Найти вещь
                  </Button>
                </Link>
                <Link to="/create">
                  <Button size="lg" variant="outline">
                    Сдать в аренду
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-primary" /> Депозит защищён
                </span>
                <span className="flex items-center gap-1.5">
                  <Camera className="h-4 w-4 text-primary" /> Фотофиксация
                </span>
              </div>
            </div>
            <div className="animate-fade-in [animation-delay:200ms] opacity-0">
              <img src={heroImage} alt="P2P аренда вещей" className="rounded-2xl card-shadow" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-t bg-card py-16">
        <div className="container">
          <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">Категории</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalog?category=${cat.id}`}
                className="card-shadow flex flex-col items-center gap-3 rounded-xl border bg-background p-5 transition-all hover:-translate-y-1"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm font-medium text-foreground">{cat.name}</span>
                <span className="text-xs text-muted-foreground">{cat.count} вещей</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="container">
          <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">Как это работает</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {[
              { icon: <Search className="h-6 w-6" />, title: "Найди", desc: "Выбери вещь в каталоге и забронируй даты" },
              { icon: <CreditCard className="h-6 w-6" />, title: "Оплати", desc: "Аренда + депозит. Деньги в безопасности" },
              { icon: <Camera className="h-6 w-6" />, title: "Зафиксируй", desc: "Фото при передаче — твоя гарантия" },
              { icon: <Shield className="h-6 w-6" />, title: "Верни", desc: "Вещь цела — депозит возвращается" },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {step.icon}
                </div>
                <div className="mt-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular items */}
      {popularItems.length > 0 && (
        <section className="border-t bg-card py-16">
          <div className="container">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">Популярное</h2>
              <Link to="/catalog">
                <Button variant="ghost" className="text-primary">
                  Все вещи <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {popularItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16">
        <div className="container">
          <div className="hero-gradient rounded-2xl p-10 text-center md:p-16">
            <h2 className="font-display text-2xl font-bold text-primary-foreground md:text-3xl">
              У тебя есть вещи, которые пылятся?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
              Начни зарабатывать прямо сейчас. Размести объявление за 2 минуты.
            </p>
            <Link to="/create">
              <Button size="lg" className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
                Сдать вещь в аренду
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
