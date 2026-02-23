import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Shield, Camera, ArrowLeft, Calendar, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { mockItems } from "@/lib/mock-data";

const ItemDetail = () => {
  const { id } = useParams();
  const item = mockItems.find((i) => i.id === id);

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Вещь не найдена</h1>
          <Link to="/catalog">
            <Button className="mt-4" variant="outline">Вернуться в каталог</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <Link to="/catalog" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" /> Назад в каталог
        </Link>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Image */}
          <div className="lg:col-span-3">
            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-muted">
              <img src={item.images[0]} alt={item.title} className="h-full w-full object-cover" />
            </div>
          </div>

          {/* Info + Booking */}
          <div className="lg:col-span-2">
            <Badge variant="secondary">{item.condition}</Badge>
            <h1 className="mt-3 font-display text-2xl font-bold text-foreground md:text-3xl">
              {item.title}
            </h1>

            <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                {item.rating} ({item.reviewsCount} отзывов)
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {item.location}
              </span>
            </div>

            <p className="mt-4 text-muted-foreground">{item.description}</p>

            {/* Price card */}
            <div className="mt-6 rounded-xl border bg-card p-5 card-shadow">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-bold text-foreground">{item.pricePerDay} ₽</span>
                  <span className="text-muted-foreground"> / сутки</span>
                </div>
                <span className="text-sm text-muted-foreground">мин. {item.minDays} дн.</span>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Депозит</span>
                  <span className="font-medium text-foreground">{item.deposit.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Комиссия платформы</span>
                  <span className="font-medium text-foreground">15%</span>
                </div>
              </div>

              <Button size="lg" className="mt-5 w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Calendar className="mr-2 h-5 w-5" />
                Забронировать
              </Button>

              <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5 text-primary" /> Депозит защищён
                </span>
                <span className="flex items-center gap-1">
                  <Camera className="h-3.5 w-3.5 text-primary" /> Фотофиксация
                </span>
              </div>
            </div>

            {/* Owner */}
            <div className="mt-5 flex items-center gap-3 rounded-xl border bg-card p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">{item.owner.name}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-accent text-accent" /> {item.owner.rating}
                  </span>
                  <span>· {item.owner.rentalsCount} аренд</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ItemDetail;
