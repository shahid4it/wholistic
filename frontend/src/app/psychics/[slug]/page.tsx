import { fetchStrapi } from "@/utils/strapi";
import { RelatedArticles } from "../../components/RelatedArticles";
import {
  PSYCHICS_BLOG_SLUG_QUERY,
  PSYCHICS_SLUG_QUERY,
  PSYCHICS_TESTIMONIALS_SLUG_QUERY,
} from "@/queries/psychics-slug";
import styles from "./page.module.sass";
import { StrapiImage } from "@/app/components/StrapiImage";
import { BookingFormModal } from "@/app/components/BookingFormModal";

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

export default async function PsychicPage({ params: { slug = "" } }) {
  const [[reader], testimonials, blogs] = await Promise.all([
    fetchStrapi({ key: "preachers", query: PSYCHICS_SLUG_QUERY(slug) })(),
    fetchStrapi({
      key: "testimonials",
      query: PSYCHICS_TESTIMONIALS_SLUG_QUERY(slug),
    })(),
    fetchStrapi({ key: "blogs", query: PSYCHICS_BLOG_SLUG_QUERY(slug) })(),
  ]);

  return (
    <main>
      <section className="section">
        <div className="container">
          <figure className={styles.profile}>
            <StrapiImage
              src={reader.profile.url}
              alt=""
              width={350}
              height={400}
            />
          </figure>
          <div className={styles.about}>
            <div className={styles.name}>
              <h1>{reader.name}</h1>
              <div className={styles.booking}>
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
              <p>{reader.oneliner}</p>
              <div className={styles.features}>
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
      </section>
      <section className={`introduction ${styles.intro}`}>
        <div className="container">
          <div className="">
            <div className="col-4">
              <h3 className="section-title">About {reader.name}</h3>
            </div>
            <div className={`col-8 ${styles.right} `}>
              <p className="body-large">{reader.bio}</p>
            </div>
          </div>
        </div>
      </section>
      <section className={`section ${styles.testimonials}`}>
        <div className="container">
          <h2 className="col-8">What people say about {reader.name}</h2>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-3">
              {testimonials.map(({ client, content, rating }) => (
                <article
                  className={`testimonial-card ${styles.card} `}
                  key={client}
                >
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
        </div>
      </section>
      <RelatedArticles title={`Articles by ${reader.name}`} blogs={blogs} />
    </main>
  );
}
