Image;
import Image from "next/image";
import Hero from "../components/hero";

export default function About() {
  return (
    <section className="about-us">
      <Hero />

      {/* Intro */}
      <section className="introduction">
        <div className="container">
          <div className="row">
            <div className="col-2">
              <h3 className="section-title">About Us</h3>
            </div>
            <div className="col-6">
              <p className="body-large">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                eleifend odio ut ante tristique, non pulvinar tellus tempor. In
                convallis accumsan ipsum. Nulla id lectus vitae nisl commodo
                molestie. Pellentesque vitae nunc leo. Ut libero risus,
                tristique a laoreet vitae
              </p>
            </div>
          </div>
        </div>

        <section className="mission">
          <div className="container">
            <div className="row">
              <div className="col-2 offset-2">
                <h3>Our Mission</h3>
              </div>
              <div className="col-4">
                <p className="body-mid">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                  eleifend odio ut ante tristique, non pulvinar tellus tempor.
                  In convallis accumsan ipsum. Nulla id lectus vitae nisl
                  commodo molestie. Pellentesque vitae nunc leo. Ut libero
                  risus, tristique a laoreet vitae, aliquam sed est.
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* Founder */}

      <section className="section founder">
        <div className="marquee">
          <div className="marquee__inner">
            <span> . Founder . Founder</span>
            <span> . Founder . Founder</span>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-3 offset-1">
              <div className="founder__image">
                <Image
                  src="/images/founder.png"
                  width={627}
                  height={850}
                  alt="Founder"
                />
              </div>
            </div>
            <div className="col-4" string="parallax" string-parallax=".5">
              <div className="founder__content">
                <p className="body-mid">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Praesent consequat nec risus sit amet aliquet. Quisque sit
                  amet lorem quis lectus dapibus molestie ac rutrum odio. Donec
                  sollicitudin in augue et maximus. Aenean iaculis vestibulum
                  tortor vel tincidunt. Etiam commodo tellus egestas mi
                  ultrices, in luctus ante convallis. Duis accumsan enim a
                  lobortis semper. Etiam mi felis, molestie quis metus a,
                  dignissim semper velit. Aenean lobortis bibendum tristique.
                  Morbi posuere euismod placerat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
