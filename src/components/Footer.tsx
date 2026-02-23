import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t bg-card">
    <div className="container py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">R</span>
            </div>
            <span className="font-display text-lg font-bold">RentIt</span>
          </div>
          <p className="text-sm text-muted-foreground">
            P2P аренда вещей. Делитесь тем, что есть, берите то, что нужно.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Платформа</h4>
          <div className="flex flex-col gap-2">
            <Link to="/catalog" className="text-sm text-muted-foreground hover:text-foreground">Каталог</Link>
            <Link to="/create" className="text-sm text-muted-foreground hover:text-foreground">Сдать вещь</Link>
            <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground">Как это работает</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Поддержка</h4>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Помощь</span>
            <span className="text-sm text-muted-foreground">Оферта</span>
            <span className="text-sm text-muted-foreground">Политика конфиденциальности</span>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Контакты</h4>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">support@rentit.ru</span>
            <span className="text-sm text-muted-foreground">Telegram: @rentit</span>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
        © 2026 RentIt. Платформа не несёт ответственности за состояние вещей.
      </div>
    </div>
  </footer>
);

export default Footer;
