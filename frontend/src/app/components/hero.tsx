"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import StringTune from "@fiddle-digital/string-tune";
import { StringParallax } from "@fiddle-digital/string-tune";

export default function Hero() {
  useEffect(() => {
    const tune = StringTune.getInstance();
    tune.use(StringParallax);
    tune.start(60); // Start at 60 FPS (adjust as needed)
  }, []);
  return (
    <section className="hero">
      <div className="hero__background">
        <Image
          src="/images/hero.png"
          width={1200}
          height={700}
          alt="Hero Background"
          string="parallax"
          string-parallax="1"
        />
      </div>
      <div className="hero__content">
        <h1 className="hero__title">
          Your companion in your journey to wholeness
        </h1>
        <Link href="#" className="btn btn-primary">
          Get Started
        </Link>
      </div>
    </section>
  );
}
