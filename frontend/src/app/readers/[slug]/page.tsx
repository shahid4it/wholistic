import { fetchStrapi } from "@/utils/strapi";
import { RelatedArticles } from "../../components/RelatedArticles";
import {
  PSYCHICS_BLOG_SLUG_QUERY,
  PSYCHICS_SLUG_QUERY,
  PSYCHICS_TESTIMONIALS_SLUG_QUERY,
} from "@/queries/psychics-slug";
// import styles from "./page.module.sass";
import { StrapiImage } from "@/app/components/StrapiImage";
import { BookingFormModal } from "@/app/components/BookingFormModal";
import { ReaderTestimonials } from "@/app/components/testimonials/reader-testimonials";

export default async function PsychicPage({ params: { slug = "" } }) {
  const [[reader], testimonials, blogs] = await Promise.all([
    fetchStrapi({ key: "preachers", query: PSYCHICS_SLUG_QUERY(slug) })(),
    fetchStrapi({
      key: "testimonials",
      query: PSYCHICS_TESTIMONIALS_SLUG_QUERY(slug),
    })(),
    fetchStrapi({ key: "blogs", query: PSYCHICS_BLOG_SLUG_QUERY(slug) })(),
  ]);

  console.log(blogs);

  return (
    <main className="psychic-single">
      <section className="section about">
        <div className="container">
          <div className="row">
            <div className="col-3">
              <figure className="profile">
                <StrapiImage
                  src={reader.profile.url}
                  alt=""
                  width={350}
                  height={400}
                />
              </figure>
            </div>
            <div className="col-5">
              <div className="about-content">
                <div className="name-booking">
                  <h1>{reader.name}</h1>
                  <div className="booking">
                    <div className="rating">
                      <span>4.7</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.88364 1.18255C6.20581 0.571926 7.08034 0.571926 7.40251 1.18255L8.86513 3.95474C8.98937 4.19022 9.21582 4.35475 9.47817 4.40014L12.5667 4.93452C13.2469 5.05223 13.5172 5.88395 13.036 6.37905L10.8515 8.62674C10.6659 8.81767 10.5794 9.08387 10.6173 9.34741L11.0635 12.4499C11.1618 13.1332 10.4543 13.6473 9.83469 13.3426L7.02195 11.9596C6.78303 11.8421 6.50312 11.8421 6.2642 11.9596L3.45146 13.3426C2.8319 13.6473 2.1244 13.1332 2.22267 12.4499L2.66884 9.34741C2.70673 9.08387 2.62024 8.81767 2.43468 8.62674L0.250144 6.37905C-0.23104 5.88395 0.0392026 5.05223 0.719498 4.93452L3.80798 4.40014C4.07033 4.35475 4.29678 4.19022 4.42102 3.95474L5.88364 1.18255Z"
                          fill="#FDA43C"
                        />
                      </svg>
                      <span>(4658)</span>
                    </div>
                    <BookingFormModal reader={reader} />
                  </div>
                </div>
                <div>
                  <h4 className="tagline">{reader.oneliner}</h4>
                  <div className="intro-table">
                    <p>
                      <span>Total Readings</span> 15,429
                    </p>
                    <p>
                      <span>Abilities</span> {reader.abilities}
                    </p>
                    <p>
                      <span>Tools</span> {reader.tools}
                    </p>
                    <p>
                      <span>Style</span> {reader.style}
                    </p>
                    <p>
                      <span>Topics</span> {reader.topics}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="introduction intro">
        <div className="container">
          <div className="row">
            <div className="col-4">
              <h3 className="section-title">About {reader.name}</h3>
            </div>
            <div className="col-7 offset-1">
              <p className="body-mid-large">{reader.bio}</p>
            </div>
          </div>
        </div>
      </section>
      <ReaderTestimonials testimonials={testimonials} reader={reader} />
      <RelatedArticles title={`Articles by ${reader.name}`} blogs={blogs} />
    </main>
  );
}
