import { fetchStrapi } from "@/utils/strapi";
// import useEmblaCarousel from "embla-carousel-react";
import { HOROSCOPE_QUERY } from "@/queries/horoscope";
import { Icons } from "./Icons";
import Link from "next/link";
import { StrapiImage } from "@/app/components/StrapiImage";
import { use } from "react";
import { Carousel } from "./Carousal";

export default async function Page({ params: { star = "Aries" } }) {
  const [data = { content: "", image: { url: "" } }] = await fetchStrapi({
    query: HOROSCOPE_QUERY(star[0]),
    key: "horoscopes",
  })();

  return (
    <main className="resources-page">
      <div className="resources-banner">
        <div className="container">
          <h1>Resources - Horoscope</h1>
        </div>
      </div>
      <Carousel star={star} />
      <section className="horoscope-content">
        <div className="container">
          <div>
            <div className="row">
              <div className="">
                <h3 className="section-title horoscope-title">
                  <span>Monthly</span> <br />
                  {star}
                </h3>
              </div>
              <div className="col-7 offset-1">
                <div
                  className="horoscope-description"
                  dangerouslySetInnerHTML={{ __html: data.content }}
                />
              </div>
            </div>
            {data.image?.url && (
              <div className="row">
                <div className="col-6">
                  <figure className="horoscope-image">
                    <StrapiImage
                      src={data.image?.url}
                      alt=""
                      width={800}
                      height={400}
                      string="parallax"
                      string-parallax=".2"
                    />
                  </figure>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
