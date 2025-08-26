"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { StrapiImage } from "./StrapiImage";
import gsap from "gsap";

export default function Services({
  title = "",
  content = "",
  marquee = "",
  services = [],
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const fgRef = useRef(null); // ref on a plain DIV, not on StrapiImage

  // Animate the new (foreground) layer whenever active changes
  useEffect(() => {
    if (!fgRef.current) return;
    gsap.killTweensOf(fgRef.current);
    gsap.set(fgRef.current, { opacity: 0 }); // start invisible
    gsap.to(fgRef.current, {
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
    });
  }, [activeIndex]);

  const handleHover = (idx) => {
    // set previous FIRST, then switch active
    setPrevIndex(activeIndex);
    setActiveIndex(idx);
  };

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
            {/* Left Images (stacked) */}
            <div className="col-3">
              <div className="services-image">
                {prevIndex !== null && services[prevIndex]?.thumbnail?.url && (
                  <div className="img-layer bg">
                    <StrapiImage
                      src={services[prevIndex].thumbnail.url}
                      alt={services[prevIndex].title}
                      width={625}
                      height={888}
                    />
                  </div>
                )}

                {services[activeIndex]?.thumbnail?.url && (
                  <div ref={fgRef} className="img-layer fg">
                    <StrapiImage
                      src={services[activeIndex].thumbnail.url}
                      alt={services[activeIndex].title}
                      width={625}
                      height={888}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right List */}
            <div className="col-4 offset-1">
              <div className="services-list">
                <ul>
                  {services.map(({ title }, i) => (
                    <li key={title} onMouseEnter={() => handleHover(i)}>
                      <Link href={`/services/${title.toLowerCase()}`}>
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
