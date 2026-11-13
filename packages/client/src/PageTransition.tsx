import { useGSAP } from "@gsap/react";
import { useBlocker, useRouterState } from "@tanstack/react-router";
import gsap from "gsap";
import { useEffect, useRef, useState, type ReactNode } from "react";

gsap.registerPlugin(useGSAP);

/* -------------------------------------------------------------------------- */
/*  Collapse: GSAP version of MUI's <Collapse in>                             */
/* -------------------------------------------------------------------------- */

type CollapseProps = {
  in: boolean;
  /** seconds */
  duration?: number;
  ease?: string;
  onEntered?: () => void;
  onExited?: () => void;
  className?: string;
  children: ReactNode;
};

export function Collapse({
  in: open,
  duration = 0.5,
  ease = "power3.inOut",
  onEntered,
  onExited,
  className,
  children,
}: CollapseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  // keep the latest callbacks without re-running the animation effect
  const callbacks = useRef({ onEntered, onExited });
  callbacks.current = { onEntered, onExited };

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      // first render: show the final state, no animation (same as MUI's default)
      if (!mounted.current) {
        mounted.current = true;
        return;
      }

      gsap.killTweensOf(el);
      gsap.set(el, { overflow: "hidden" });

      if (open) {
        gsap.to(el, {
          height: "auto",
          autoAlpha: 1,
          duration,
          ease,
          onComplete: () => {
            gsap.set(el, { clearProps: "height,overflow,opacity,visibility" });
            callbacks.current.onEntered?.();
          },
        });
      } else {
        gsap.to(el, {
          height: 0,
          autoAlpha: 0,
          duration,
          ease,
          onComplete: () => callbacks.current.onExited?.(),
        });
      }
    },
    { dependencies: [open] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  PageTransition: collapse the old page, navigate, expand the new one       */
/* -------------------------------------------------------------------------- */

export default function PageTransition({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);

  // path of the page actually on screen (changes only after loaders finish)
  const resolvedPath = useRouterState({
    select: (s) => s.resolvedLocation?.pathname ?? s.location.pathname,
  });

  // Hold real page changes; hash links (#shop) and search-param changes pass through.
  const { status, proceed } = useBlocker({
    shouldBlockFn: ({ current, next }) => current.pathname !== next.pathname,
    withResolver: true,
    enableBeforeUnload: false,
  });

  // EXIT: navigation was blocked, so collapse; Collapse calls proceed() when done
  useEffect(() => {
    if (status !== "blocked") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      proceed();
      return;
    }
    setOpen(false);
  }, [status, proceed]);

  // ENTER: new route resolved, so scroll to top and expand
  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(true);
  }, [resolvedPath]);

  return (
    <Collapse in={open} duration={0.5} onExited={proceed}>
      {children}
    </Collapse>
  );
}
