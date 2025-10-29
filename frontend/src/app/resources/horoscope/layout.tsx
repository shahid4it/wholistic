"use client";

import { usePathname } from "next/navigation";
import { Carousel } from "./[star]/Carousal";

export default function Page({ children }) {
  const path = usePathname();

  const star = path.substring("/resources/horoscope/".length);

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
