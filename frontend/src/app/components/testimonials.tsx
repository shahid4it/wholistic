"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { StrapiImage } from "./StrapiImage";

const testimonials = [
  {
    quote:
      "This service transformed our workflow. The design quality is exceptional!",
    name: "Sarah Johnson",
    role: "Product Manager, TechFlow",
  },
  {
    quote: "Shahid delivered beyond expectations. Highly recommended!",
    name: "James Carter",
    role: "Founder, StartupHub",
  },
  {
    quote:
      "A seamless experience from start to finish. Professional and creative.",
    name: "Emily Davis",
    role: "Marketing Lead, BrightMedia",
  },
];

export default function Testimonials({
  content = "",
  background: image = { url: "" },
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  });

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );
  return (
    <section className="container">
      <section className="testimonials">
        <div className="testimonials__bg">
          <StrapiImage
            src={image?.url}
            width={1200}
            height={700}
            alt="Hero Background"
            string="parallax"
            string-parallax=".2"
          />
        </div>

        <div className="testimonials__header">
          <h3>{content}</h3>
        </div>

        <div className="testimonial-slider">
          {/* Slider */}
          <div className="embla" ref={emblaRef}>
            <div className="embla__container">
              {testimonials.map((t, index) => (
                <div className="embla__slide" key={index}>
                  <div className="testimonial">
                    <div className="stars">
                      <svg
                        width="92"
                        height="17"
                        viewBox="0 0 92 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.58238 1.82562C7.90455 1.21499 8.77907 1.21499 9.10124 1.82562L10.5639 4.59781C10.6881 4.83329 10.9146 4.99781 11.1769 5.0432L14.2654 5.57759C14.9457 5.6953 15.2159 6.52702 14.7347 7.02211L12.5502 9.2698C12.3646 9.46073 12.2781 9.72694 12.316 9.99047L12.7622 13.0929C12.8605 13.7763 12.153 14.2903 11.5334 13.9857L8.72068 12.6027C8.48176 12.4852 8.20185 12.4852 7.96293 12.6027L5.15019 13.9857C4.53063 14.2903 3.82313 13.7763 3.9214 13.0929L4.36757 9.99047C4.40547 9.72694 4.31897 9.46073 4.13341 9.2698L1.94887 7.02211C1.46769 6.52702 1.73793 5.6953 2.41823 5.57759L5.50671 5.04321C5.76906 4.99781 5.99551 4.83329 6.11975 4.59781L7.58238 1.82562Z"
                          fill="#C55341"
                        />
                        <path
                          d="M26.4115 1.82562C26.7336 1.21499 27.6082 1.21499 27.9303 1.82562L29.393 4.59781C29.5172 4.83329 29.7437 4.99781 30.006 5.0432L33.0945 5.57759C33.7748 5.6953 34.045 6.52702 33.5638 7.02211L31.3793 9.2698C31.1937 9.46073 31.1072 9.72694 31.1451 9.99047L31.5913 13.0929C31.6896 13.7763 30.9821 14.2903 30.3625 13.9857L27.5498 12.6027C27.3109 12.4852 27.031 12.4852 26.792 12.6027L23.9793 13.9857C23.3597 14.2903 22.6522 13.7763 22.7505 13.0929L23.1967 9.99047C23.2346 9.72694 23.1481 9.46073 22.9625 9.2698L20.778 7.02211C20.2968 6.52702 20.567 5.6953 21.2473 5.57759L24.3358 5.04321C24.5982 4.99781 24.8246 4.83329 24.9489 4.59781L26.4115 1.82562Z"
                          fill="#C55341"
                        />
                        <path
                          d="M45.2406 1.82562C45.5627 1.21499 46.4373 1.21499 46.7594 1.82562L48.2221 4.59781C48.3463 4.83329 48.5728 4.99781 48.8351 5.0432L51.9236 5.57759C52.6039 5.6953 52.8741 6.52702 52.3929 7.02211L50.2084 9.2698C50.0228 9.46073 49.9363 9.72694 49.9742 9.99047L50.4204 13.0929C50.5187 13.7763 49.8112 14.2903 49.1916 13.9857L46.3789 12.6027C46.14 12.4852 45.8601 12.4852 45.6211 12.6027L42.8084 13.9857C42.1888 14.2903 41.4813 13.7763 41.5796 13.0929L42.0258 9.99047C42.0637 9.72694 41.9772 9.46073 41.7916 9.2698L39.6071 7.02211C39.1259 6.52702 39.3961 5.6953 40.0764 5.57759L43.1649 5.04321C43.4273 4.99781 43.6537 4.83329 43.778 4.59781L45.2406 1.82562Z"
                          fill="#C55341"
                        />
                        <path
                          d="M64.0697 1.82562C64.3918 1.21499 65.2664 1.21499 65.5885 1.82562L67.0512 4.59781C67.1754 4.83329 67.4019 4.99781 67.6642 5.0432L70.7527 5.57759C71.433 5.6953 71.7032 6.52702 71.222 7.02211L69.0375 9.2698C68.8519 9.46073 68.7655 9.72694 68.8033 9.99047L69.2495 13.0929C69.3478 13.7763 68.6403 14.2903 68.0207 13.9857L65.208 12.6027C64.9691 12.4852 64.6892 12.4852 64.4502 12.6027L61.6375 13.9857C61.0179 14.2903 60.3104 13.7763 60.4087 13.0929L60.8549 9.99047C60.8928 9.72694 60.8063 9.46073 60.6207 9.2698L58.4362 7.02211C57.955 6.52702 58.2252 5.6953 58.9055 5.57759L61.994 5.04321C62.2564 4.99781 62.4828 4.83329 62.6071 4.59781L64.0697 1.82562Z"
                          fill="#C55341"
                        />
                        <path
                          d="M82.8988 1.82562C83.221 1.21499 84.0955 1.21499 84.4176 1.82562L85.8803 4.59781C86.0045 4.83329 86.231 4.99781 86.4933 5.0432L89.5818 5.57759C90.2621 5.6953 90.5323 6.52702 90.0511 7.02211L87.8666 9.2698C87.681 9.46073 87.5946 9.72694 87.6325 9.99047L88.0786 13.0929C88.1769 13.7763 87.4694 14.2903 86.8498 13.9857L84.0371 12.6027C83.7982 12.4852 83.5183 12.4852 83.2793 12.6027L80.4666 13.9857C79.847 14.2903 79.1395 13.7763 79.2378 13.0929L79.684 9.99047C79.7219 9.72694 79.6354 9.46073 79.4498 9.2698L77.2653 7.02211C76.7841 6.52702 77.0543 5.6953 77.7346 5.57759L80.8231 5.04321C81.0855 4.99781 81.3119 4.83329 81.4362 4.59781L82.8988 1.82562Z"
                          fill="#C55341"
                        />
                      </svg>
                    </div>
                    <h3 className="testimonial__quote">“{t.quote}”</h3>
                    <div className="testimonial__author">
                      <h4 className="body-mid">{t.name}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrows */}
          <div className="embla__buttons">
            <button className="embla__prev embla__button" onClick={scrollPrev}>
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.0552 12.6904H2.05518M2.05518 12.6904L12.5552 2.19043M2.05518 12.6904L12.5552 23.1904"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="embla__next embla__button" onClick={scrollNext}>
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.94482 12.6904L22.9448 12.6904M22.9448 12.6904L12.4448 23.1904M22.9448 12.6904L12.4448 2.19043"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </section>
  );
}
