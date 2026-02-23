import { Shield, Camera, CreditCard, Search, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const steps = [
  {
    icon: <Search className="h-7 w-7" />,
    title: "1. Найди нужную вещь",
    desc: "Ищи по категориям или ключевым словам. Смотри рейтинг владельца, состояние вещи и отзывы.",
  },
  {
    icon: <CreditCard className="h-7 w-7" />,
    title: "2. Забронируй и оплати",
    desc: "Выбери даты, оплати аренду и депозит. Деньги блокируются на платформе до завершения сделки.",
  },
  {
    icon: <Camera className="h-7 w-7" />,
    title: "3. Зафиксируй передачу",
    desc: "При получении вещи сделай фото: общий вид, повреждения, серийные номера. Это твоя защита при спорах.",
  },
  {
    icon: <Shield className="h-7 w-7" />,
    title: "4. Верни и получи депозит",
    desc: "Владелец проверяет вещь и подтверждает возврат. Если всё ок — депозит возвращается полностью.",
  },
];

const rules = [
  { icon: <CheckCircle className="h-5 w-5 text-primary" />, text: "Фотофиксация обязательна при передаче и возврате" },
  { icon: <CheckCircle className="h-5 w-5 text-primary" />, text: "Депозит блокируется на платформе" },
  { icon: <CheckCircle className="h-5 w-5 text-primary" />, text: "Споры решаются в течение 48 часов" },
  { icon: <AlertTriangle className="h-5 w-5 text-accent" />, text: "Платформа не проверяет вещи и не участвует в передаче" },
  { icon: <AlertTriangle className="h-5 w-5 text-accent" />, text: "Ответственность за состояние — на владельце и арендаторе" },
];

const HowItWorks = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container max-w-3xl py-12">
      <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Как это работает</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Простая процедура, которая защищает обе стороны.
      </p>

      <div className="mt-10 space-y-8">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-5 rounded-xl border bg-card p-6 card-shadow">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              {step.icon}
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-1 text-muted-foreground">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl border bg-card p-6">
        <h2 className="font-display text-xl font-bold text-foreground">Правила платформы</h2>
        <div className="mt-4 space-y-3">
          {rules.map((rule, i) => (
            <div key={i} className="flex items-start gap-3">
              {rule.icon}
              <span className="text-sm text-foreground">{rule.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link to="/catalog">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Перейти в каталог
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
    <Footer />
  </div>
);

export default HowItWorks;
