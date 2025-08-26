"use client";

import Link from "next/link";
import { StrapiImage } from "./StrapiImage";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

export function RelatedArticles({ title, content, blogs }) {
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
    <section className="section">
      <div className="container">
        {/* <div className="row"> */}
        <div className="col-4">
          <h3 className="section-title">{title}</h3>
        </div>
        <div className="col-6 ">
          <p className="">{content}</p>
        </div>
        {/* </div> */}
      </div>

      <div className="related-articles">
        <div className="container">
          <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
              <div className="embla__container">
                {[
                  ...blogs,
                  ...blogs,
                  ...blogs,
                  ...blogs,
                  ...blogs,
                  ...blogs,
                ].map((props) => (
                  <article key={props.title} className="article col-3">
                    {props.thumbnail && (
                      <div className="article-image">
                        <StrapiImage
                          src={props.thumbnail?.url}
                          alt=""
                          width={300}
                          height={170}
                        />
                      </div>
                    )}
                    <div className="article-content">
                      <h3>
                        <Link href={"#"}>{props.title}</Link>
                      </h3>
                      <p>{props.summary}</p>
                    </div>
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
      </div>
    </section>
  );
}
