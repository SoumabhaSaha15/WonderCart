import { useGSAP } from "@gsap/react";
import { useBlocker, useRouterState } from "@tanstack/react-router";
import gsap from "gsap";
import { useEffect, useRef, type ReactNode } from "react";

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
  useEffect(() => {
    callbacks.current = { onEntered, onExited };
  }, [onEntered, onExited]);

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
      const animationDuration = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : duration;

      if (open) {
        gsap.to(el, {
          height: "auto",
          autoAlpha: 1,
          duration: animationDuration,
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
          duration: animationDuration,
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
  // path of the page actually on screen (changes only after loaders finish)
  const resolvedPath = useRouterState({
    select: (s) => s.resolvedLocation?.pathname ?? s.location.pathname,
  });
  const locationPath = useRouterState({
    select: (s) => s.location.pathname,
  });

  // Hold real page changes; hash links (#shop) and search-param changes pass through.
  const { status, proceed } = useBlocker({
    shouldBlockFn: ({ current, next }) => current.pathname !== next.pathname,
    withResolver: true,
    enableBeforeUnload: false,
  });

  // Scroll to top when the new route resolves.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [resolvedPath]);

  return (
    <Collapse
      in={status !== "blocked" && resolvedPath === locationPath}
      duration={0.5}
      onExited={proceed}
    >
      {children}
    </Collapse>
  );
}
