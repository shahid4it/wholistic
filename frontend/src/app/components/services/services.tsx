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

      <section className="container">
        {services.map(({ title, thumbnail, content }) => (
          <div key={title} className="service_thumbnail">
            <figure className="service_thumbnail__image">
              <StrapiImage
                src={thumbnail?.url}
                alt=""
                width={500}
                height={500}
              />
            </figure>
            <div className="service_thumbnail__content">
              <Link href={`/services/${title.toLowerCase()}`}>
                <h3>
                  {title}{" "}
                  <svg
                    width="32"
                    height="33"
                    viewBox="0 0 32 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M28 17.6768V25.6768C28 26.3841 27.719 27.0624 27.219 27.5625C26.7189 28.0626 26.0406 28.3435 25.3333 28.3435H6.66667C5.95942 28.3435 5.28115 28.0626 4.78105 27.5625C4.28095 27.0624 4 26.3841 4 25.6768V7.01017C4 6.30293 4.28095 5.62465 4.78105 5.12455C5.28115 4.62446 5.95942 4.34351 6.66667 4.34351H14.6667"
                      stroke="white"
                      strokeWidth="3.64209"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M28 4.34351L16 16.3435"
                      stroke="white"
                      strokeWidth="3.64209"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20 4.34351H28V12.3435"
                      stroke="white"
                      strokeWidth="3.64209"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </h3>
              </Link>
              <p>{content}</p>
            </div>
          </div>
        ))}
      </section>
    </section>
  );
}
