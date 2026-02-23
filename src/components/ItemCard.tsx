import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Item } from "@/lib/mock-data";

const ItemCard = ({ item }: { item: Item }) => (
  <Link to={`/item/${item.id}`} className="group block">
    <div className="card-shadow overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={item.images[0]}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge className="absolute left-3 top-3 bg-card/90 text-foreground backdrop-blur-sm border-0">
          {item.condition}
        </Badge>
      </div>
      <div className="p-4">
        <h3 className="font-display text-base font-semibold text-foreground line-clamp-1">
          {item.title}
        </h3>
        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span className="line-clamp-1">{item.location}</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-foreground">{item.pricePerDay} ₽</span>
            <span className="text-sm text-muted-foreground"> / сутки</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-medium text-foreground">{item.rating}</span>
            <span className="text-muted-foreground">({item.reviewsCount})</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Депозит: {item.deposit.toLocaleString()} ₽
        </div>
      </div>
    </div>
  </Link>
);

export default ItemCard;
