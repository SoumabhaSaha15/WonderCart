import { useRef } from "react";
import { useBlocker, useRouterState } from "@tanstack/react-router";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const COVER = { duration: 0.5, ease: "power3.inOut" } as const;
const REVEAL = { duration: 0.55, ease: "power3.inOut" } as const;

/**
 * Curtain transition: the panel slides up over the old page (exit), the navigation
 * is held until it fully covers the screen, then the panel continues off the top
 * once the new route has resolved (enter).
 *
 * Render it once in the root route, next to <Outlet />.
 */
export default function PageTransition() {
  const scope = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const isCovering = useRef(false);

  // Path of the page that is actually on screen (changes only after loaders finish)
  const resolvedPath = useRouterState({
    select: (s) => s.resolvedLocation?.pathname ?? s.location.pathname,
  });

  // Hold navigation so we can play the exit animation first.
  // Only block real page changes: hash links (#shop) and search-param changes pass through.
  const { status, proceed } = useBlocker({
    shouldBlockFn: ({ current, next }) => current.pathname !== next.pathname,
    withResolver: true,
    enableBeforeUnload: false,
  });

  // Initial position: parked below the viewport
  useGSAP(
    () => {
      gsap.set(panel.current, { yPercent: 100 });
    },
    { scope },
  );

  // EXIT: cover the old page, then let the navigation continue
  useGSAP(
    () => {
      if (status !== "blocked" || isCovering.current) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        proceed();
        return;
      }

      isCovering.current = true;

      gsap
        .timeline({ onComplete: proceed })
        .set(panel.current, { yPercent: 100, pointerEvents: "auto" })
        .set(mark.current, { autoAlpha: 0, y: 16 })
        .to(panel.current, { yPercent: 0, ...COVER })
        .to(mark.current, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, "-=0.2");
    },
    { scope, dependencies: [status] },
  );

  // ENTER: new page is ready, lift the curtain off the top
  useGSAP(
    () => {
      if (!isCovering.current) return;

      window.scrollTo(0, 0); // reset scroll while the page is hidden

      gsap
        .timeline({
          onComplete: () => {
            isCovering.current = false;
            gsap.set(panel.current, { yPercent: 100, pointerEvents: "none" });
          },
        })
        .to({}, { duration: 0.15 }) // short hold so the logo registers
        .to(mark.current, { autoAlpha: 0, y: -16, duration: 0.25, ease: "power2.in" })
        .to(panel.current, { yPercent: -100, ...REVEAL }, "-=0.1");
    },
    { scope, dependencies: [resolvedPath] },
  );

  return (
    <div ref={scope} aria-hidden="true">
      <div
        ref={panel}
        className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-primary"
        style={{ transform: "translateY(100%)" }}
      >
        <div
          ref={mark}
          className="flex size-16 items-center justify-center rounded-2xl bg-background"
        >
          <img src="/logo.svg" alt="" className="size-9 object-contain dark:invert" />
        </div>
      </div>
    </div>
  );
}
