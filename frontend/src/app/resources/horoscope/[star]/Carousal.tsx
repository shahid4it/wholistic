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
  const [progress, setProgress] = useState(0);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const scrollProgress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setProgress(scrollProgress * 100);
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
        </div>
      </div>
    </section>
  );
}
