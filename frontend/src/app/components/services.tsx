"use client";
import { useState } from "react";
import Link from "next/link";
import { StrapiImage } from "./StrapiImage";

export default function Services({
  title = "",
  content = "",
  marquee = "",
  services = [],
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleHover = (idx) => setActiveIndex(idx);

  return (
    <section className="section our-services">
      <div className="marquee">
        <div className="marquee__inner">
          <span>{marquee}</span>
          <span>{marquee}</span>
        </div>
      </div>
      <section className="section-content">
        <div className="container">
          <div className="row">
            <div className="col-4">
              <h3 className="section-title">{title}</h3>
            </div>
            <div className="col-3 ">
              <div className="services-list">
                <p className="body-mid">{content}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section-list">
        <div className="container">
          <div className="row">
            {/* Left Images: every thumbnail is mounted up front (hidden via
                opacity) so it is already loaded by the time a reader hovers
                the matching service, instead of only fetching it on hover. */}
            <div className="col-3">
              <div className="services-image">
                {services.map(
                  (service, i) =>
                    service.thumbnail?.url && (
                      <div
                        key={service.slug ?? service.title}
                        className={`img-layer ${
                          i === activeIndex ? "active" : ""
                        }`}
                      >
                        <StrapiImage
                          src={service.thumbnail.url}
                          alt={service.title}
                          width={625}
                          height={888}
                          priority={i === 0}
                        />
                      </div>
                    )
                )}
              </div>
            </div>

            {/* Right List */}
            <div className="col-4 offset-1">
              <div className="services-list">
                <ul>
                  {services.map(({ title, slug }, i) => (
                    <li key={title} onMouseEnter={() => handleHover(i)}>
                      <Link href={`/services/${slug}`}>
                        <div
                          className={`service-title ${
                            activeIndex === i ? "active" : ""
                          }`}
                        >
                          {title}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
