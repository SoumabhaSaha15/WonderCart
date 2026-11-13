import { useNavigate } from "@tanstack/react-router";
import { LuArrowLeft, LuHouse, LuSearch } from "react-icons/lu";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-5 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 size-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
      />
      <Card className="relative w-full max-w-lg border-border/70 shadow-xl shadow-foreground/5">
        <CardContent className="flex flex-col items-center px-6 py-10 text-center sm:px-10 sm:py-12">
          <div className="mb-8 flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground ring-1 ring-border">
            <LuSearch aria-hidden="true" className="size-7" />
          </div>
          <Badge variant="secondary" className="mb-4 font-mono tracking-widest">
            ERROR 404
          </Badge>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            This page took a wrong turn
          </h1>
          <p className="mt-3 max-w-md text-pretty leading-6 text-muted-foreground">
            We couldn't find what you were looking for. It may have moved, or the link might be
            outdated.
          </p>
          <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Button onClick={() => navigate({ to: "/" })}>
              <LuHouse data-icon="inline-start" />
              Back to home
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              <LuArrowLeft data-icon="inline-start" />
              Go back
            </Button>
          </div>
          <div className="mt-10 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            <img
              src="/logo.svg"
              alt=""
              aria-hidden="true"
              className="size-5 object-contain dark:invert"
            />
            <span>Wondercart</span>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
