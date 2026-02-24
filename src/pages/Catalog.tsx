import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ItemCard from "@/components/ItemCard";
import { categories } from "@/lib/mock-data";
import { supabase } from "@/integrations/supabase/client";
import type { Item } from "@/lib/mock-data";

const fetchItems = async (): Promise<Item[]> => {
  const { data: items, error } = await supabase
    .from("items")
    .select("*, profiles!items_owner_id_fkey(name, avatar_url, rating, rentals_count)")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    // Fallback: fetch without join if FK doesn't exist
    const { data: itemsOnly } = await supabase
      .from("items")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (!itemsOnly) return [];

    // Fetch profiles separately
    const ownerIds = [...new Set((itemsOnly as any[]).map((i) => i.owner_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .in("user_id", ownerIds);

    const profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p]));

    return (itemsOnly as any[]).map((item) => {
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
  }

  return (items as any[]).map((item) => {
    const profile = item.profiles;
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

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const [searchQuery, setSearchQuery] = useState("");

  const { data: dbItems = [], isLoading } = useQuery({
    queryKey: ["catalog-items"],
    queryFn: fetchItems,
  });

  const filtered = dbItems.filter((item) => {
    const matchCategory = activeCategory === "all" || item.category === activeCategory;
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Каталог</h1>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск вещей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Фильтры
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setSearchParams({})}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground hover:text-foreground border-border"
            }`}
          >
            Все
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSearchParams({ category: cat.id })}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground hover:text-foreground border-border"
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground">Загрузка...</div>
        ) : (
          <>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="py-20 text-center text-muted-foreground">
                {dbItems.length === 0
                  ? "Пока нет объявлений. Будьте первым!"
                  : "Ничего не найдено. Попробуйте изменить фильтры."}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Catalog;
