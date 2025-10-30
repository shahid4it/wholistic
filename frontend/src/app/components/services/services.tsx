import Link from "next/link";
import { StrapiImage } from "../StrapiImage";

export function Services({ title, content, services = [] }) {
  return (
    <section className="introduction">
      <div className="container">
        <div className="row">
          <div className="col-2">
            <h3 className="section-title">{title}</h3>
          </div>
          <div className="col-6">
            <p className="body-large">{content}</p>
          </div>
        </div>
      </div>
      <section className="services">
        <section className="container">
          <div className="row">
            {services.map(({ title, thumbnail, content, slug }, index) => (
              <div className="col-4">
                <div key={title} className="service-card ">
                  <div className="index-number">0{index + 1}</div>
                  <figure className="service-card__image">
                    <StrapiImage
                      src={thumbnail?.url}
                      alt=""
                      width={500}
                      height={500}
                      string="parallax"
                      string-parallax=".2"
                    />
                  </figure>
                  <div className="service-card__content">
                    <Link href={`/services/${slug}`}>
                      <h3>{title}</h3>
                    </Link>
                    <p className="body-mid">{content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </section>
  );
}
