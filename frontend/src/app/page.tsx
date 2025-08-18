import Image from "next/image";
import Link from "next/link";
import Hero from "./components/hero";
import Testimonials from "./components/testimonials";
import FAQ from "./components/faq";
import Readers from "./components/readers";
import Subscribe from "./components/subscribe";
import Services from "./components/services";
import Introduction from "./components/introduction";

export default function Home() {
  return (
    <section className="home">
      <Hero />

      {/* Introduction */}
      <Introduction />
      {/* Our Services */}
      <Services />

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
