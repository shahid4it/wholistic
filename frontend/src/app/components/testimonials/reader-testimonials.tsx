"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

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
      fill="#C55341"
    />
  </svg>
);

const StarOutline = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.49805 1.89258C9.71129 1.48908 10.2887 1.48908 10.502 1.89258L12.5283 5.7334C12.8726 6.38586 13.5006 6.842 14.2275 6.96777L18.5059 7.70801C18.9559 7.78588 19.1346 8.33553 18.8164 8.66309L15.79 11.7773C15.2759 12.3064 15.0366 13.0442 15.1416 13.7744L15.7598 18.0723C15.8248 18.5244 15.3562 18.8646 14.9463 18.6631L11.0498 16.7471C10.3878 16.4216 9.6122 16.4216 8.9502 16.7471L5.05371 18.6631C4.64382 18.8646 4.17522 18.5244 4.24023 18.0723L4.8584 13.7744C4.96341 13.0442 4.72411 12.3064 4.20996 11.7773L1.18359 8.66309C0.865358 8.33552 1.0441 7.78588 1.49414 7.70801L5.77246 6.96777C6.49936 6.842 7.12744 6.38586 7.47168 5.7334L9.49805 1.89258Z"
      stroke="#C55341"
      stroke-width="1.81104"
    />
  </svg>
);

export function ReaderTestimonials({ testimonials = [], reader = {} }) {
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
    <section className="section testimonials">
      <div className="container">
        <h3 className="section-title">What people say about {reader.name}</h3>
      </div>
      <div className="container">
        <div className="embla">
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container" style={{ gap: "2em" }}>
              {testimonials.map(({ client, content, rating }) => (
                <article className="testimonial-card card col-3" key={client}>
                  <span className="rating">
                    {new Array(rating).fill(0).map((_, i) => StarFilled)}
                    {StarOutline}
                  </span>
                  <h4>{content}</h4>
                  <cite>&mdash; {client}</cite>
                </article>
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
    </section>
  );
}
