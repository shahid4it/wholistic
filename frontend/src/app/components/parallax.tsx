"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll parallax for every `[data-parallax="<strength>"]` element.
 *
 * The element moves from -strength/2 to +strength/2 viewport heights while it
 * crosses the viewport (top enters at the bottom -> bottom leaves at the top);
 * a negative strength reverses the direction. Desktop only, as narrow screens
 * stack the layout and the movement just looks jumpy there.
 */
export function Parallax() {
  const pathname = usePathname();

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1080px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const strength = parseFloat(el.dataset.parallax ?? "") || 0.2;
        const distance = () => strength * window.innerHeight;
        gsap.fromTo(
          el,
          { y: () => -distance() / 2 },
          {
            y: () => distance() / 2,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    });
    // images above may still be loading and shift the layout
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  }, [pathname]);

  return null;
}
