"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import StringTune from "@fiddle-digital/string-tune";
import { StringParallax } from "@fiddle-digital/string-tune";
import { StrapiImage } from "./StrapiImage";

export default function Hero({
  title = "",
  content = "",
  backdrop = { url: "" },
  cta = { title: "", href: "" },
}) {
  useEffect(() => {
    const tune = StringTune.getInstance();
    tune.use(StringParallax);
    tune.start(60); // Start at 60 FPS (adjust as needed)
  }, []);
  return (
    <section className="hero">
      <div className="hero__background">
        <StrapiImage
          src={backdrop?.url}
          width={1200}
          height={700}
          alt="Hero Background"
          string="parallax"
          string-parallax="1"
        />
      </div>
      <div className="hero__content">
        <h1 className="hero__title">{title}</h1>
        {content && <p className="hero__para">{content}</p>}
        {cta && (
          <Link href={cta.href} className="btn btn-primary">
            {cta.title}
          </Link>
        )}
      </div>
    </section>
  );
}
