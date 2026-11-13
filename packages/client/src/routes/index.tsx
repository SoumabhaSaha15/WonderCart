import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ComponentProps, type ReactNode } from "react";
import { LuArrowRight, LuHeart, LuMenu, LuShoppingBag, LuStar, LuX } from "react-icons/lu";
// import {Link} from "@tanstack/react-router";
import { useInView } from "react-intersection-observer";

type Category = "All picks" | "Fashion" | "Home" | "Beauty" | "Tech";
const currentYear = new Date().getFullYear();

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

const products: {
  id: number;
  name: string;
  category: Exclude<Category, "All picks">;
  description: string;
  price: string;
  rating: string;
  image: string;
  color: string;
  tag?: string;
}[] = [
  {
    id: 1,
    name: "Everyday carryall",
    category: "Fashion",
    description: "Soft vegan leather · 3 colors",
    price: "$48",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85",
    color: "bg-muted",
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
    color: "bg-muted",
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
    color: "bg-muted",
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
    color: "bg-muted",
  },
];

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.12 });

  return (
    <div
      ref={ref}
      className={`${className} transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
        inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
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

function RouteComponent() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All picks");
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

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
            <a
              href="#shop"
              className="hidden rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:border-primary hover:bg-card sm:inline-flex"
            >
              Explore finds
            </a>
            <button
              type="button"
              className="relative flex size-11 items-center justify-center rounded-full border border-border bg-card transition hover:border-primary"
              aria-label={`Shopping bag with ${cartCount} items`}
            >
              <LuShoppingBag className="size-5" />
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {cartCount}
              </span>
            </button>
            <button
              type="button"
              className="flex size-11 items-center justify-center rounded-full border border-border bg-card md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <LuX className="size-5" /> : <LuMenu className="size-5" />}
            </button>
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
              <div className="max-w-xl lg:col-span-5">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-semibold uppercase tracking-widest text-secondary-foreground">
                  <span className="size-1.5 rounded-full bg-primary" />
                  Good things, found here
                </div>
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
                  <a
                    href="#shop"
                    className="inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                  >
                    Shop the good stuff
                    <LuArrowRight className="size-4" />
                  </a>
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

              <div className="relative mx-auto w-full max-w-2xl lg:col-span-7 lg:ml-auto">
                <div className="absolute -right-2 top-6 z-10 flex size-24 rotate-6 flex-col items-center justify-center rounded-full bg-accent text-center text-accent-foreground shadow-lg sm:-right-5 sm:top-10 sm:size-28">
                  <span className="text-xs font-bold uppercase tracking-widest">Little joys</span>
                  <span className="font-heading text-2xl font-bold leading-tight">15% off</span>
                  <span className="text-xs font-medium">your first order</span>
                </div>
                <div className="relative overflow-hidden rounded-3xl bg-muted sm:rounded-4xl">
                  <img
                    src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1500&q=90"
                    alt="A thoughtfully styled spring outfit"
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
                      className="aspect-4/5 w-full object-cover transition duration-500 group-hover:scale-105 md:aspect-square"
                    />
                    <span className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute bottom-4 left-4 text-white sm:bottom-6 sm:left-6">
                      <span className="block font-heading text-xl font-semibold sm:text-2xl">
                        {category.name}
                      </span>
                      <span className="mt-1 block text-xs text-white/80">{category.note}</span>
                    </span>
                    <span className="absolute bottom-4 right-4 flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground transition group-hover:bg-background sm:bottom-6 sm:right-6">
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
                <div className="flex flex-wrap gap-2">
                  {(["All picks", "Fashion", "Home", "Beauty", "Tech"] as Category[]).map(
                    (category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        className={`rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                          selectedCategory === category
                            ? "bg-primary text-primary-foreground"
                            : "border border-border bg-card/70 text-muted-foreground hover:border-primary hover:text-foreground"
                        }`}
                      >
                        {category}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-4">
                {visibleProducts.map((product) => (
                  <article key={product.id} className="group min-w-0">
                    <div
                      className={`relative overflow-hidden rounded-2xl ${product.color} sm:rounded-3xl`}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="aspect-4/5 w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      {product.tag && (
                        <span className="absolute left-3 top-3 rounded-full bg-background px-3 py-1.5 text-xs font-bold tracking-wide text-muted-foreground sm:left-4 sm:top-4 sm:text-xs">
                          {product.tag}
                        </span>
                      )}
                      <button
                        type="button"
                        aria-label={
                          favorites.includes(product.id)
                            ? `Remove ${product.name} from wishlist`
                            : `Add ${product.name} to wishlist`
                        }
                        aria-pressed={favorites.includes(product.id)}
                        onClick={() =>
                          setFavorites((current) =>
                            current.includes(product.id)
                              ? current.filter((id) => id !== product.id)
                              : [...current, product.id],
                          )
                        }
                        className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/90 text-muted-foreground transition hover:bg-background hover:text-primary sm:right-4 sm:top-4"
                      >
                        <LuHeart
                          className={`size-4 ${favorites.includes(product.id) ? "fill-primary text-primary" : ""}`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => setCartCount((count) => count + 1)}
                        className="absolute bottom-3 left-3 right-3 rounded-full bg-background px-3 py-2.5 text-xs font-semibold text-foreground opacity-100 shadow-sm transition hover:bg-primary hover:text-primary-foreground sm:bottom-4 sm:left-4 sm:right-4 sm:py-3 sm:text-sm sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
                      >
                        Add to bag
                      </button>
                    </div>
                    <div className="px-1 pt-3 sm:px-2 sm:pt-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold leading-5 sm:text-base">
                          {product.name}
                        </h3>
                        <span className="shrink-0 text-sm font-bold">{product.price}</span>
                      </div>
                      <p className="mt-1 truncate text-xs text-muted-foreground sm:text-sm">
                        {product.description}
                      </p>
                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <LuStar className="size-3 fill-primary text-primary" />
                        {product.rating}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </Container>
          </Section>
        </Reveal>

        <Reveal>
          <Section id="story">
            <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1300&q=85"
                  alt="Warm, welcoming home filled with thoughtful details"
                  loading="lazy"
                  className="aspect-4/3 w-full rounded-3xl object-cover sm:rounded-4xl"
                />
                <div className="absolute -bottom-5 right-4 rounded-2xl bg-accent px-5 py-4 text-accent-foreground shadow-lg sm:right-8 sm:px-7 sm:py-5">
                  <p className="font-heading text-2xl font-bold tracking-tight">Made with care.</p>
                  <p className="mt-1 text-xs font-medium text-accent-foreground/80">
                    Chosen with you in mind.
                  </p>
                </div>
              </div>
              <div className="pt-4">
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
              <div className="overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:rounded-4xl sm:px-10 sm:py-16">
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
                  <button
                    type="submit"
                    className="rounded-full bg-secondary px-5 py-3 text-xs font-bold text-secondary-foreground transition hover:bg-secondary/80 sm:text-sm"
                  >
                    Count me in
                  </button>
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
