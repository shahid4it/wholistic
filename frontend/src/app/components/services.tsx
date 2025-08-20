import Image from "next/image";
import Link from "next/link";
import { StrapiImage } from "./StrapiImage";

export default function Services({
  title = "",
  content = "",
  marquee = "",
  services = [],
}) {
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
            <div className="col-3">
              <div className="services-image">
                <StrapiImage
                  src={services[0]?.thumbnail?.url}
                  width={625}
                  height={888}
                  alt="Hero Background"
                />
              </div>
            </div>
            <div className="col-4 offset-1">
              <div className="services-list">
                <ul>
                  {services.map(({ title }) => (
                    <li key={title}>
                      <Link href={`/services/${title.toLowerCase()}`}>
                        <div className="service-title">{title}</div>
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
