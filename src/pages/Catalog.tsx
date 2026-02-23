import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ItemCard from "@/components/ItemCard";
import { categories, mockItems } from "@/lib/mock-data";

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockItems.filter((item) => {
    const matchCategory = activeCategory === "all" || item.category === activeCategory;
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Каталог</h1>

        {/* Search & filters */}
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

        {/* Category chips */}
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

        {/* Results */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            Ничего не найдено. Попробуйте изменить фильтры.
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Catalog;
