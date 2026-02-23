export interface Item {
  id: string;
  title: string;
  category: string;
  description: string;
  pricePerDay: number;
  deposit: number;
  minDays: number;
  images: string[];
  owner: {
    name: string;
    avatar: string;
    rating: number;
    rentalsCount: number;
  };
  location: string;
  rating: number;
  reviewsCount: number;
  condition: string;
}

export const categories = [
  { id: "tools", name: "Инструменты", icon: "🔧", count: 124 },
  { id: "sports", name: "Спорт", icon: "⚽", count: 89 },
  { id: "kids", name: "Детские товары", icon: "👶", count: 67 },
  { id: "events", name: "Для мероприятий", icon: "🎉", count: 45 },
  { id: "electronics", name: "Техника", icon: "📷", count: 156 },
  { id: "household", name: "Бытовая техника", icon: "🏠", count: 78 },
];

export const mockItems: Item[] = [
  {
    id: "1",
    title: "Перфоратор Bosch GBH 2-26",
    category: "tools",
    description: "Профессиональный перфоратор в отличном состоянии. Полный комплект свёрл в кейсе.",
    pricePerDay: 500,
    deposit: 5000,
    minDays: 1,
    images: ["/placeholder.svg"],
    owner: { name: "Алексей М.", avatar: "", rating: 4.8, rentalsCount: 32 },
    location: "Москва, м. Таганская",
    rating: 4.9,
    reviewsCount: 18,
    condition: "Отличное",
  },
  {
    id: "2",
    title: "Горный велосипед Trek X-Caliber",
    category: "sports",
    description: "Горный велосипед 29 дюймов. Размер рамы L. Гидравлические тормоза.",
    pricePerDay: 1200,
    deposit: 15000,
    minDays: 1,
    images: ["/placeholder.svg"],
    owner: { name: "Мария К.", avatar: "", rating: 4.6, rentalsCount: 15 },
    location: "Москва, м. Парк Культуры",
    rating: 4.7,
    reviewsCount: 12,
    condition: "Хорошее",
  },
  {
    id: "3",
    title: "Детская коляска Bugaboo Fox 3",
    category: "kids",
    description: "Премиальная коляска, полный комплект. Чистая, ухоженная.",
    pricePerDay: 800,
    deposit: 10000,
    minDays: 3,
    images: ["/placeholder.svg"],
    owner: { name: "Елена В.", avatar: "", rating: 5.0, rentalsCount: 8 },
    location: "Москва, м. Бауманская",
    rating: 5.0,
    reviewsCount: 6,
    condition: "Отличное",
  },
  {
    id: "4",
    title: "Проектор Epson EH-TW750",
    category: "electronics",
    description: "Full HD проектор для домашнего кинотеатра. HDMI кабель в комплекте.",
    pricePerDay: 1500,
    deposit: 12000,
    minDays: 1,
    images: ["/placeholder.svg"],
    owner: { name: "Дмитрий Л.", avatar: "", rating: 4.9, rentalsCount: 45 },
    location: "Москва, м. Тверская",
    rating: 4.8,
    reviewsCount: 28,
    condition: "Отличное",
  },
  {
    id: "5",
    title: "Шуруповёрт Makita DDF484",
    category: "tools",
    description: "Аккумуляторный шуруповёрт 18V. Два аккумулятора + зарядка.",
    pricePerDay: 400,
    deposit: 4000,
    minDays: 1,
    images: ["/placeholder.svg"],
    owner: { name: "Игорь С.", avatar: "", rating: 4.5, rentalsCount: 22 },
    location: "Москва, м. Сокольники",
    rating: 4.6,
    reviewsCount: 14,
    condition: "Хорошее",
  },
  {
    id: "6",
    title: "Палатка Outwell 4-местная",
    category: "sports",
    description: "Семейная палатка, быстрая сборка. Тент + колышки в комплекте.",
    pricePerDay: 700,
    deposit: 6000,
    minDays: 2,
    images: ["/placeholder.svg"],
    owner: { name: "Анна Р.", avatar: "", rating: 4.7, rentalsCount: 11 },
    location: "Москва, м. Речной вокзал",
    rating: 4.5,
    reviewsCount: 9,
    condition: "Хорошее",
  },
];
