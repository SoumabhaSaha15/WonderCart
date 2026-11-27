import { useGSAP } from "@gsap/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { cn } from "cn";
import gsap from "gsap";
import { useCallback, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { LuArrowRight, LuHeart, LuMenu, LuShoppingBag, LuStar, LuX } from "react-icons/lu";
import { useInView } from "react-intersection-observer";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

gsap.registerPlugin(useGSAP);

type Category = "All picks" | "Fashion" | "Home" | "Beauty" | "Tech";
type Product = {
  id: number;
  name: string;
  category: Exclude<Category, "All picks">;
  description: string;
  price: string;
  rating: string;
  image: string;
  tag?: string;
};
const currentYear = new Date().getFullYear();

const productFilters: Category[] = ["All picks", "Fashion", "Home", "Beauty", "Tech"];

const categories: { name: Exclude<Category, "All picks">; image: string; note: string }[] = [
  {
    name: "Fashion",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=85",
    note: "Wear on repeat",
  },
  {
    name: "Home",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=85",
    note: "Make room for joy",
  },
  {
    name: "Beauty",
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=85",
    note: "A little self-care",
  },
  {
    name: "Tech",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85",
    note: "Clever little upgrades",
  },
];

const products: Product[] = [
  {
    id: 1,
    name: "Everyday carryall",
    category: "Fashion",
    description: "Soft vegan leather · 3 colors",
    price: "$48",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85",
    tag: "Bestseller",
  },
  {
    id: 2,
    name: "Sunday ceramic set",
    category: "Home",
    description: "Hand-finished stoneware · Set of 2",
    price: "$36",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    name: "Daily ritual face oil",
    category: "Beauty",
    description: "Nourishing botanical blend · 30 ml",
    price: "$28",
    rating: "5.0",
    image:
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=85",
    tag: "New",
  },
  {
    id: 4,
    name: "Studio wireless headphones",
    category: "Tech",
    description: "All-day comfort · 24-hour battery",
    price: "$89",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
  },
];

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref: observerRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.12,
    fallbackInView: true,
  });
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      observerRef(node);
    },
    [observerRef],
  );

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!inView || !container) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const duration = prefersReducedMotion ? 0 : 0.7;
      const items = container.querySelectorAll("[data-reveal-item]");
      const visuals = container.querySelectorAll("[data-reveal-visual]");
      const timeline = gsap.timeline();

      timeline.fromTo(
        container,
        { autoAlpha: 0, y: prefersReducedMotion ? 0 : 24 },
        { autoAlpha: 1, y: 0, duration, ease: "power3.out" },
      );

      if (items.length > 0) {
        timeline.fromTo(
          items,
          { autoAlpha: 0, y: prefersReducedMotion ? 0 : 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: prefersReducedMotion ? 0 : 0.6,
            stagger: prefersReducedMotion ? 0 : 0.1,
            ease: "power3.out",
          },
          "-=0.35",
        );
      }

      if (visuals.length > 0) {
        timeline.fromTo(
          visuals,
          { scale: prefersReducedMotion ? 1 : 1.045 },
          { scale: 1, duration: prefersReducedMotion ? 0 : 1, ease: "power2.out" },
          "-=0.55",
        );
      }

      const floatingElements = container.querySelectorAll("[data-reveal-float]");
      if (!prefersReducedMotion && floatingElements.length > 0) {
        timeline.to(
          floatingElements,
          { y: -5, duration: 2.8, ease: "sine.inOut", repeat: -1, yoyo: true },
          "+=0.1",
        );
      }
    },
    { dependencies: [inView], scope: containerRef, revertOnUpdate: true },
  );

  return (
    <div
      ref={setRefs}
      className={cn("will-change-[opacity,transform]", className, !inView && "invisible opacity-0")}
    >
      {children}
    </div>
  );
}

/** Page frame: max width and horizontal padding are defined here and nowhere else. */
function Container({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 ${className}`} {...props} />
  );
}

const sectionPadding = {
  default: "py-16 sm:py-20 lg:py-24",
  hero: "pb-16 pt-9 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-14",
  closing: "pb-16 sm:pb-20 lg:pb-24",
} as const;

/** Vertical rhythm for every section: pick a variant instead of writing padding by hand. */
function Section({
  spacing = "default",
  className = "",
  ...props
}: ComponentProps<"section"> & { spacing?: keyof typeof sectionPadding }) {
  return <section className={`scroll-mt-8 ${sectionPadding[spacing]} ${className}`} {...props} />;
}

function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToBag,
}: {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAddToBag: () => void;
}) {
  return (
    <article data-reveal-item data-filter-card>
      <Card className="group min-w-0 gap-0 overflow-visible rounded-none bg-transparent py-0 ring-0">
        <div className="relative overflow-hidden rounded-2xl bg-muted sm:rounded-3xl">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            data-reveal-visual
            className="aspect-4/5 w-full object-cover transition duration-500 group-hover:scale-105"
          />
          {product.tag && (
            <Badge
              variant="secondary"
              className="absolute left-3 top-3 border-0 bg-background text-foreground sm:left-4 sm:top-4"
            >
              {product.tag}
            </Badge>
          )}
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={
              isFavorite
                ? `Remove ${product.name} from wishlist`
                : `Add ${product.name} to wishlist`
            }
            aria-pressed={isFavorite}
            onClick={onToggleFavorite}
            className="absolute right-3 top-3 size-9 rounded-full bg-background/90 text-muted-foreground transition-transform hover:scale-105 hover:bg-background hover:text-primary active:scale-95 sm:right-4 sm:top-4"
          >
            <LuHeart className={cn(isFavorite && "fill-primary text-primary")} />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onAddToBag}
            className="absolute bottom-3 left-3 right-3 rounded-full bg-background text-foreground shadow-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground sm:bottom-4 sm:left-4 sm:right-4 sm:h-10 sm:translate-y-2 sm:text-sm sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:focus-visible:translate-y-0 sm:focus-visible:opacity-100"
          >
            Add to bag
          </Button>
        </div>
        <CardHeader className="grid-cols-[1fr_auto] px-1 pt-3 sm:px-2 sm:pt-4">
          <CardTitle className="text-sm font-semibold leading-5 sm:text-base">
            {product.name}
          </CardTitle>
          <CardAction className="font-bold">{product.price}</CardAction>
          <CardDescription className="col-span-2 truncate text-xs sm:text-sm">
            {product.description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="gap-1 px-1 pt-2 text-xs text-muted-foreground sm:px-2">
          <LuStar className="size-3 fill-primary text-primary" />
          {product.rating}
        </CardFooter>
      </Card>
    </article>
  );
}

function RouteComponent() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All picks");
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const productGridRef = useRef<HTMLDivElement>(null);
  const previousCategoryRef = useRef(selectedCategory);

  useGSAP(
    () => {
      if (previousCategoryRef.current === selectedCategory) return;
      previousCategoryRef.current = selectedCategory;

      const cards = productGridRef.current?.querySelectorAll<HTMLElement>("[data-filter-card]");
      if (!cards?.length) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: prefersReducedMotion ? 0 : 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: prefersReducedMotion ? 0 : 0.4,
          stagger: prefersReducedMotion ? 0 : 0.07,
          ease: "power3.out",
        },
      );
    },
    { dependencies: [selectedCategory], scope: productGridRef, revertOnUpdate: true },
  );

  const visibleProducts =
    selectedCategory === "All picks"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="bg-primary px-4 py-2.5 text-center text-xs font-medium tracking-wide text-primary-foreground sm:text-sm">
        A little something for your first order: take 15% off with{" "}
        <span className="font-bold">HELLO15</span>
      </div>

      <header className="relative z-10 border-b border-border bg-background">
        <Container className="flex items-center justify-between py-5">
          <a href="#" className="flex items-center gap-2.5" aria-label="WonderCart home">
            <img src="/logo.svg" alt="" className="size-10 object-contain dark:invert" />
            <span className="font-heading text-xl font-bold tracking-tighter">wondercart</span>
          </a>

          <nav className="hidden items-center gap-9 text-sm font-medium text-muted-foreground md:flex">
            <a className="transition-colors hover:text-primary" href="#shop">
              Shop
            </a>
            <a className="transition-colors hover:text-primary" href="#categories">
              Categories
            </a>
            <a className="transition-colors hover:text-primary" href="#story">
              Our little story
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })
              }
              className="hidden rounded-full px-5 sm:inline-flex"
            >
              Explore finds
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="relative size-11 rounded-full bg-card"
              aria-label={`Shopping bag with ${cartCount} items`}
            >
              <LuShoppingBag />
              <Badge className="absolute -right-1 -top-1 size-5 justify-center rounded-full p-0 text-[10px]">
                {cartCount}
              </Badge>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-11 rounded-full bg-card md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <LuX /> : <LuMenu />}
            </Button>
          </div>
        </Container>
        {menuOpen && (
          <nav className="flex flex-col gap-1 border-t border-border px-5 py-3 text-sm font-medium md:hidden">
            <a className="rounded-lg px-3 py-2.5 hover:bg-muted" href="#shop" onClick={closeMenu}>
              Shop
            </a>
            <a
              className="rounded-lg px-3 py-2.5 hover:bg-muted"
              href="#categories"
              onClick={closeMenu}
            >
              Categories
            </a>
            <a className="rounded-lg px-3 py-2.5 hover:bg-muted" href="#story" onClick={closeMenu}>
              Our little story
            </a>
          </nav>
        )}
      </header>

      <main>
        <Reveal>
          <Section spacing="hero">
            <Container className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
              <div data-reveal-item className="max-w-xl lg:col-span-5">
                <Badge
                  variant="secondary"
                  className="mb-6 h-auto gap-2 rounded-full px-4 py-2 font-semibold uppercase tracking-widest"
                >
                  <span className="size-1.5 rounded-full bg-primary" />
                  Good things, found here
                </Badge>
                <h1 className="font-heading text-6xl font-semibold leading-none tracking-tighter sm:text-7xl lg:text-8xl text-foreground">
                  Find your
                  <br />
                  next <span className="font-serif font-normal italic text-primary">favorite</span>
                  <br />
                  thing.
                </h1>
                <p className="mt-7 max-w-md text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                  Thoughtful little upgrades, everyday essentials, and the kind of gifts you'll want
                  to keep for yourself.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Button
                    type="button"
                    size="lg"
                    onClick={() =>
                      document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="h-12 rounded-full px-6 text-sm font-semibold"
                  >
                    Shop the good stuff
                    <LuArrowRight data-icon="inline-end" />
                  </Button>
                  <Link to="/about">
                    <span className="text-sm text-muted-foreground">Free shipping over $50</span>
                  </Link>
                </div>
                <div className="mt-10 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[
                      "photo-1534528741775-53994a69daeb",
                      "photo-1500648767791-00dcc994a43e",
                      "photo-1531123897727-8f129e1688ce",
                    ].map((photo) => (
                      <img
                        key={photo}
                        className="size-9 rounded-full border-2 border-background object-cover"
                        src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=100&h=100&q=80`}
                        alt=""
                      />
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-sm font-bold">
                      <LuStar className="size-4 fill-primary text-primary" />
                      4.9 out of 5
                    </div>
                    <p className="text-xs text-muted-foreground">From 2,400+ happy shoppers</p>
                  </div>
                </div>
              </div>

              <div
                data-reveal-item
                className="relative mx-auto w-full max-w-2xl lg:col-span-7 lg:ml-auto"
              >
                <div
                  data-reveal-float
                  className="absolute -right-2 top-6 z-10 flex size-24 rotate-6 flex-col items-center justify-center rounded-full bg-accent text-center text-accent-foreground shadow-lg sm:-right-5 sm:top-10 sm:size-28"
                >
                  <span className="text-xs font-bold uppercase tracking-widest">Little joys</span>
                  <span className="font-heading text-2xl font-bold leading-tight">15% off</span>
                  <span className="text-xs font-medium">your first order</span>
                </div>
                <div className="relative overflow-hidden rounded-3xl bg-muted sm:rounded-4xl">
                  <img
                    src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1500&q=90"
                    alt="A thoughtfully styled spring outfit"
                    data-reveal-visual
                    className="aspect-4/5 w-full object-cover object-center sm:aspect-5/4 lg:aspect-square"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white sm:bottom-8 sm:left-8">
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
                      The spring edit
                    </p>
                    <p className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                      A fresh start
                      <br />
                      looks good on you.
                    </p>
                  </div>
                  <a
                    href="#shop"
                    className="absolute bottom-6 right-6 flex size-12 items-center justify-center rounded-full bg-background text-foreground transition hover:scale-105 sm:bottom-8 sm:right-8"
                    aria-label="Shop the spring edit"
                  >
                    <LuArrowRight className="size-5" />
                  </a>
                </div>
              </div>
            </Container>
          </Section>
        </Reveal>

        <Reveal>
          <section className="border-y border-border bg-card/70">
            <Container className="grid grid-cols-2 gap-y-5 py-6 md:grid-cols-4">
              {[
                ["A better kind of find", "Small makers, good materials"],
                ["Easy on the planet", "Less waste, more thought"],
                ["Made to make you smile", "The little details matter"],
                ["Here when you need us", "Real people, real help"],
              ].map(([title, detail], index) => (
                <div
                  key={title}
                  data-reveal-item
                  className={`px-3 md:px-5 ${index > 0 ? "md:border-l md:border-border" : ""}`}
                >
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
                </div>
              ))}
            </Container>
          </section>
        </Reveal>

        <Reveal>
          <Section id="categories">
            <Container>
              <div className="mb-8 flex items-end justify-between gap-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">
                    Browse by mood
                  </p>
                  <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tighter sm:text-4xl">
                    A little bit of everything.
                  </h2>
                </div>
                <a
                  href="#shop"
                  className="hidden items-center gap-2 pb-1 text-sm font-semibold text-muted-foreground transition hover:text-primary sm:flex"
                >
                  See all finds <LuArrowRight className="size-4" />
                </a>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    type="button"
                    data-reveal-item
                    onClick={() => {
                      setSelectedCategory(category.name);
                      document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="group relative overflow-hidden rounded-2xl text-left sm:rounded-3xl"
                  >
                    <img
                      src={category.image}
                      alt=""
                      loading="lazy"
                      data-reveal-visual
                      className="aspect-4/5 w-full object-cover transition duration-500 group-hover:scale-105 md:aspect-square"
                    />
                    <span className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute bottom-4 left-4 text-white sm:bottom-6 sm:left-6">
                      <span className="block font-heading text-xl font-semibold sm:text-2xl">
                        {category.name}
                      </span>
                      <span className="mt-1 block text-xs text-white/80">{category.note}</span>
                    </span>
                    <span className="absolute bottom-4 right-4 flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground transition-transform group-hover:translate-x-0.5 group-hover:bg-background sm:bottom-6 sm:right-6">
                      <LuArrowRight className="size-4" />
                    </span>
                  </button>
                ))}
              </div>
            </Container>
          </Section>
        </Reveal>

        <Reveal>
          <Section id="shop" className="bg-muted">
            <Container>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">
                    The good stuff
                  </p>
                  <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tighter sm:text-4xl">
                    Little things, big love.
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Considered favorites for your everyday.
                  </p>
                </div>
                <ToggleGroup
                  aria-label="Filter products by category"
                  value={[selectedCategory]}
                  onValueChange={(value) => {
                    const category = productFilters.find((filter) => filter === value[0]);
                    if (category) setSelectedCategory(category);
                  }}
                  variant="outline"
                  size="sm"
                  className="flex flex-wrap"
                >
                  {productFilters.map((category) => (
                    <ToggleGroupItem
                      key={category}
                      value={category}
                      className="rounded-full bg-card/70 text-xs aria-pressed:bg-primary aria-pressed:text-primary-foreground sm:text-sm"
                    >
                      {category}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              <div
                ref={productGridRef}
                className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-4"
              >
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={() =>
                      setFavorites((current) =>
                        current.includes(product.id)
                          ? current.filter((id) => id !== product.id)
                          : [...current, product.id],
                      )
                    }
                    onAddToBag={() => setCartCount((count) => count + 1)}
                  />
                ))}
              </div>
            </Container>
          </Section>
        </Reveal>

        <Reveal>
          <Section id="story">
            <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div data-reveal-item className="relative">
                <img
                  src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1300&q=85"
                  alt="Warm, welcoming home filled with thoughtful details"
                  loading="lazy"
                  data-reveal-visual
                  className="aspect-4/3 w-full rounded-3xl object-cover sm:rounded-4xl"
                />
                <div className="absolute -bottom-5 right-4 rounded-2xl bg-accent px-5 py-4 text-accent-foreground shadow-lg sm:right-8 sm:px-7 sm:py-5">
                  <p className="font-heading text-2xl font-bold tracking-tight">Made with care.</p>
                  <p className="mt-1 text-xs font-medium text-accent-foreground/80">
                    Chosen with you in mind.
                  </p>
                </div>
              </div>
              <div data-reveal-item className="pt-4">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  A little about us
                </p>
                <h2 className="mt-3 max-w-xl font-heading text-4xl font-semibold leading-tight tracking-tighter sm:text-5xl">
                  Shopping should feel like finding a{" "}
                  <span className="font-serif italic">gem.</span>
                </h2>
                <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
                  We bring together independent makers and everyday essentials that earn their place
                  in your home. No endless scrolling. Just good things, picked with a little more
                  care.
                </p>
                <a
                  href="#categories"
                  className="mt-7 inline-flex items-center gap-2 border-b border-foreground pb-1.5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
                >
                  Get to know our picks <LuArrowRight className="size-4" />
                </a>
              </div>
            </Container>
          </Section>
        </Reveal>

        <Reveal>
          <Section spacing="closing">
            <Container>
              <div
                data-reveal-item
                className="overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:rounded-4xl sm:px-10 sm:py-16"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-primary-foreground/70">
                  A note from us
                </p>
                <h2 className="mx-auto mt-3 max-w-xl font-heading text-3xl font-semibold tracking-tighter sm:text-4xl">
                  Good finds. Good feelings. Straight to your inbox.
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-primary-foreground/70">
                  Get first dibs on new favorites, thoughtful gift ideas, and the occasional little
                  treat.
                </p>
                <form
                  className="mx-auto mt-7 flex max-w-md rounded-full bg-background p-1.5"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const email = new FormData(event.currentTarget).get("email");
                    if (typeof email === "string") {
                      window.location.href = `mailto:hello@wondercart.com?subject=Join%20WonderCart%20notes&body=${encodeURIComponent(email)}`;
                    }
                  }}
                >
                  <label htmlFor="newsletter-email" className="sr-only">
                    Your email address
                  </label>
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    placeholder="Your email address"
                    className="min-w-0 flex-1 bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    required
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    className="h-auto rounded-full px-5 py-3 text-xs font-bold sm:text-sm"
                  >
                    Count me in
                  </Button>
                </form>
                <p className="mt-3 text-xs text-primary-foreground/50">
                  Only the good stuff. Unsubscribe anytime.
                </p>
              </div>
            </Container>
          </Section>
        </Reveal>
      </main>

      <footer className="border-t border-border">
        <Container className="flex flex-col gap-5 py-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <a
            href="#"
            className="flex items-center gap-2 font-heading text-base font-bold tracking-tight text-foreground"
          >
            <img src="/logo.svg" alt="" className="size-5 object-contain dark:invert" />
            wondercart
          </a>
          <p>Good things for the everyday. © {currentYear} WonderCart</p>
          <div className="flex gap-5">
            <a className="transition hover:text-foreground" href="#shop">
              Shop
            </a>
            <a className="transition hover:text-foreground" href="#story">
              Our story
            </a>
            <a className="transition hover:text-foreground" href="mailto:hello@wondercart.com">
              Say hello
            </a>
          </div>
        </Container>
      </footer>
    </div>
  );
}
