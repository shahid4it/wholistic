"use client";

import { Carousel } from "./Carousal";

export default function Template({ children, params: { star = "Aries" } }) {
  return (
    <main className="resources-page">
      <div className="resources-banner">
        <div className="container">
          <h1>Resources - Horoscope</h1>
        </div>
      </div>
      <Carousel star={star} />
      {children}
    </main>
  );
}
