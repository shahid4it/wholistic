"use client";
import { StrapiImage } from "../StrapiImage";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Markdown from "react-markdown";

const StarFilled = (
  <svg
    width="21"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.10293 1.47024C9.65583 0.422303 11.1567 0.422302 11.7096 1.47024L13.7359 5.31089C13.9491 5.71501 14.3378 5.99737 14.788 6.07527L19.0668 6.81562C20.2343 7.01762 20.6981 8.445 19.8723 9.29467L16.8458 12.4087C16.5274 12.7363 16.3789 13.1932 16.444 13.6455L17.0621 17.9437C17.2308 19.1165 16.0166 19.9986 14.9533 19.4758L11.0565 17.5597C10.6464 17.3581 10.1661 17.3581 9.75603 17.5597L5.85921 19.4758C4.79594 19.9986 3.58174 19.1165 3.75039 17.9437L4.36852 13.6455C4.43356 13.1932 4.28512 12.7363 3.96666 12.4087L0.940167 9.29467C0.114372 8.445 0.578153 7.01762 1.74566 6.81562L6.0245 6.07527C6.47474 5.99737 6.86337 5.71501 7.07658 5.31089L9.10293 1.47024Z"
      fill="#FDA43C"
    />
  </svg>
);

function Psychic({ name, bio, profile, tags, oneliner, slug }) {
  return (
    <div className="psychic">
      <StrapiImage src={profile?.url} width={300} height={400} alt="" />
      <div className="psychic__content">
        <h3>
          <Link href={`/psychics/${slug}`}>{name}</Link>
        </h3>
        <span>4.7 {StarFilled} (2026)</span>
        <p>{oneliner}</p>
        <div className="tags">
          {tags?.split(",").map((tag) => (
            <span className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Psychics({ title, content, marquee, preachers = [] }) {
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
    <section className="section section-psychics">
      <div className="marquee">
        <div className="marquee__inner">
          <span>{marquee}</span>
          <span>{marquee}</span>
        </div>
      </div>
      <section className="introduction">
        <div className="container">
          <div className="row">
            <div className="col-4">
              <h3 className="section-title">{title}</h3>
            </div>
            <div className="body-mid col-3">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        </div>
      </section>
      <div className="psychics container">
        <div className="row">
          {/* <div className="col-2">
            {preachers.map((props) => (
              <Psychic key={props.name} {...props} />
            ))}
          </div> */}

          <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
              <div className="embla__container">
                {preachers.map((props) => (
                  <div className="col-2">
                    <Psychic key={props.name} {...props} />
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="embla__progress">
              <div
                className="embla__progress__bar"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
