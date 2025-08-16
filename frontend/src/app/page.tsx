import Image from "next/image";
import Link from "next/link";
import Hero from "./components/hero";
import Testimonials from "./components/testimonials";
import FAQ from "./components/faq";
import Readers from "./components/readers";
import Subscribe from "./components/subscribe";

export default function Home() {
  return (
    <section className="home">
      <Hero />

      {/* Introduction */}
      <section className="introduction">
        <div className="container">
          <div className="row">
            <div className="col-8">
              <h3 className="section-title">Introduction</h3>
              <div className="col-7 offset-1">
                <p className="body-large">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                  eleifend odio ut ante tristique, non pulvinar tellus tempor.
                  In convallis accumsan ipsum. Nulla id lectus vitae nisl
                  commodo molestie. Pellentesque vitae nunc leo. Ut libero
                  risus, tristique a laoreet vitae, aliquam sed est.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="introduction-below">
        <div className="container">
          <div className="row">
            <div className="col-5">
              <div className="image-holder">
                <Image
                  src="/images/intro-image.png"
                  width={1000}
                  height={800}
                  alt="Hero Background"
                />
              </div>
            </div>
            <div className="col-3">
              <p className="body-mid">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                eleifend odio ut ante tristique, non pulvinar tellus tempor. In
                convallis accumsan ipsum. Nulla id lectus vitae nisl commodo
                molestie. Pellentesque vitae nunc leo. Ut libero risus,
                tristique a laoreet vitae, aliquam sed est. Morbi eu dignissim
                felis. Morbi lacinia eros id lacinia imperdiet. 
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* our Services */}
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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Etiam eleifend odio ut ante tristique, non pulvinar tellus
                    tempor. In convallis accumsan ipsum. Nulla id lectus vitae
                    nisl commodo molestie.
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

      {/* Our Readers */}
      <section className="section our-readers">
        <div className="marquee">
          <div className="marquee__inner">
            <span> . Our Healers . Our Readers</span>
            <span> . Our Healers . Our Readers</span>
          </div>
        </div>
        <section className="section-content">
          <div className="container">
            <div className="row">
              <div className="col-4">
                <h3 className="section-title">Our Healers & Readers</h3>
              </div>
              <div className="col-3 ">
                <div className="section-content">
                  <p className="body-mid">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Etiam eleifend odio ut ante tristique, non pulvinar tellus
                    tempor. In convallis accumsan ipsum. Nulla id lectus vitae
                    nisl commodo molestie.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Readers />
      </section>
      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}

      <FAQ />

      {/* Subscribe */}
      <Subscribe />
    </section>
  );
}
