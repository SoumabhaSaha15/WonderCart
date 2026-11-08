import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, type ErrorComponentProps } from "@tanstack/react-router";
import axios from "axios";
import { ZodError } from "zod";
import { LuHouse, LuRefreshCw, LuTriangleAlert } from "react-icons/lu";

export default function ErrorPage({ error, reset }: ErrorComponentProps) {
  const navigate = useNavigate();

  const isValidationError = error instanceof ZodError;
  const isRequestError = axios.isAxiosError(error);
  const title = isValidationError
    ? "We could not load this information"
    : isRequestError
      ? "We couldn't reach the service"
      : "Something went wrong";
  const description = isValidationError
    ? "The information for this page was not in the expected format. Try again in a moment."
    : isRequestError
      ? "There was a problem completing your request. Check your connection and try again."
      : "An unexpected issue interrupted this page. You can try again or return to the home page.";

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-5 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 size-96 -translate-x-1/2 rounded-full bg-destructive/5 blur-3xl"
      />
      <Card className="relative w-full max-w-lg border-border/70 shadow-xl shadow-foreground/5">
        <CardContent className="flex flex-col items-center px-6 py-10 text-center sm:px-10 sm:py-12">
          <div className="mb-8 flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive ring-1 ring-destructive/15">
            <LuTriangleAlert aria-hidden="true" className="size-7" />
          </div>
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <img
              src="/logo.svg"
              alt=""
              aria-hidden="true"
              className="size-5 object-contain dark:invert"
            />
            <span>Wondercart / Error</span>
          </div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-md text-pretty leading-6 text-muted-foreground">{description}</p>
          <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Button onClick={reset}>
              <LuRefreshCw data-icon="inline-start" />
              Try again
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: "/" })}>
              <LuHouse data-icon="inline-start" />
              Back to home
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
