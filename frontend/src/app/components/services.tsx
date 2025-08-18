import Image from "next/image";
import Link from "next/link";

export default function Services() {
  return (
    <section className="section our-services">
      <div className="marquee">
        <div className="marquee__inner">
          <span> . Our Services . Our Services</span>
          <span> . Our Services . Our Services</span>
        </div>
      </div>
      <section className="section-content">
        <div className="container">
          <div className="row">
            <div className="col-4">
              <h3 className="section-title">Our Services</h3>
            </div>
            <div className="col-3 ">
              <div className="services-list">
                <p className="body-mid">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                  eleifend odio ut ante tristique, non pulvinar tellus tempor.
                  In convallis accumsan ipsum. Nulla id lectus vitae nisl
                  commodo molestie.
                </p>
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
                <Image
                  src="/images/service-tarot.png"
                  width={625}
                  height={888}
                  alt="Hero Background"
                />
              </div>
            </div>
            <div className="col-4 offset-1">
              <div className="services-list">
                <ul>
                  <li>
                    <Link href="#">
                      <div className="service-title">Tarot</div>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <div className="service-title">Reiki Healing</div>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <div className="service-title">Astrology</div>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <div className="service-title">Gemstone Healing</div>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <div className="service-title">Yoga</div>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <div className="service-title">Therapy</div>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
