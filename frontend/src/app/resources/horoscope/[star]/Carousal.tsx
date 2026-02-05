"use client";

import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Icons } from "./Icons";

const durations = {
  Aries: "Mar 21 - Apr 19",
  Taurus: "Apr 20 - May 20",
  Gemini: "May 21 - Jun 20",
  Cancer: "Jun 21 - Jul 20",
  Leo: "Jul 21 - Aug 20",
  Virgo: "Aug 21 - Sep 20",
  Libra: "Sep 21 - Oct 20",
  Scorpio: "Oct 21 - Nov 20",
  Sagittarius: "Nov 21 - Dec 20",
  Capricorn: "Dec 21 - Jan 20",
  Aquarius: "Jan 21 - Feb 20",
  Pisces: "Feb 21 - Mar 20",
};

export function Carousel({ star }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: true,
    // align: "start",
  });
  // const [progress, setProgress] = useState(0);

  const [progress, setProgress] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;

    const scrollProgress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));

    setProgress(scrollProgress * 100);
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    emblaApi && emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi && emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onScroll();
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onScroll);
  }, [emblaApi, onScroll]);

  return (
    <section className="starsigns">
      <div className="container">
        <div className="embla">
          <button
            className="embla__button embla__button--prev"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Previous"
          >
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.0552 12.6904H2.05518M2.05518 12.6904L12.5552 2.19043M2.05518 12.6904L12.5552 23.1904"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </button>
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container">
              {Object.entries(durations).map(([name, duration]) => (
                <Link
                  href={`/resources/horoscope/${name}`}
                  key={name}
                  className={`starsign ${star === name ? "active" : ""}`}
                >
                  <figure className="starsign-image">{Icons[name]}</figure>
                  <div className="content">
                    <h3>{name}</h3>
                    <p>{duration}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <button
            className="embla__button embla__button--next"
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Next"
          >
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.94482 12.6904L22.9448 12.6904M22.9448 12.6904L12.4448 23.1904M22.9448 12.6904L12.4448 2.19043"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
