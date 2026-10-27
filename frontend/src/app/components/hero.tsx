"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

import { StrapiImage } from "./StrapiImage";

gsap.registerPlugin(SplitText);

export default function Hero({
  title = "",
  content = "",
  backdrop = { url: "" },
  cta = { title: "", href: "" },
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Lines of the title, then the paragraph, slide up out of a mask; the CTA fades in.
  // .hero__content starts hidden (see _hero.scss) so the text never flashes before this runs.
  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(root, { autoAlpha: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(root, { autoAlpha: 1 });
      const cta = root.querySelector(".btn");
      let tl: gsap.core.Timeline | undefined;
      // autoSplit re-splits once fonts load and on resize; returning the
      // timeline from onSplit lets SplitText carry its progress over
      SplitText.create(root.querySelectorAll(".hero__title, .hero__para"), {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          const first = !tl;
          tl = gsap.timeline({ delay: first ? 0.2 : 0 });
          tl.from(self.lines, {
            yPercent: 110,
            duration: 1.1,
            ease: "power4.out",
            stagger: 0.12,
          });
          if (cta) tl.from(cta, { autoAlpha: 0, y: 20, duration: 0.8, ease: "power2.out" }, "-=0.6");
          return tl;
        },
      });
    }, root);

    return () => ctx.revert();
  }, [title, content]);

  return (
    <section className="hero">
      <div className="hero__background">
        <StrapiImage
          src={backdrop?.url}
          width={1200}
          height={700}
          alt="Hero Background"
          data-parallax="1"
        />
      </div>
      <div className="hero__content" ref={contentRef}>
        <h1 className="hero__title">{title}</h1>
        {content && <p className="hero__para body-mid">{content}</p>}
        {cta && (
          <Link href={cta.href} className="btn btn-primary">
            {cta.title}
          </Link>
        )}
      </div>
    </section>
  );
}
