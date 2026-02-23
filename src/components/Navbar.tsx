import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Plus, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">R</span>
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            RentIt
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/catalog" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Каталог
          </Link>
          <Link to="/how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Как это работает
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/catalog">
            <Button variant="ghost" size="sm">
              <Search className="mr-2 h-4 w-4" />
              Поиск
            </Button>
          </Link>
          <Link to="/create">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Сдать вещь
            </Button>
          </Link>
          <Button variant="outline" size="sm">
            Войти
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-card p-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link to="/catalog" className="text-sm font-medium text-foreground" onClick={() => setMobileOpen(false)}>
              Каталог
            </Link>
            <Link to="/how-it-works" className="text-sm font-medium text-foreground" onClick={() => setMobileOpen(false)}>
              Как это работает
            </Link>
            <Link to="/create" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="w-full bg-primary text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Сдать вещь
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="w-full">
              Войти
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
