import Image from "next/image";
import { fetchStrapi } from "@/utils/strapi";
import { Founders } from "../components/founders";
import { ABOUT_QUERY } from "@/queries/about";
import Hero from "../components/hero";
import Testimonials from "../components/testimonials";
import FAQ from "../components/faq";

const CustomIntro = ({ title = "", content = "" }) => {
  return (
    <section className="introduction">
      <div className="container">
        <div className="row">
          <div className="col-2">
            <h3 className="section-title">About Us</h3>
          </div>
          <div className="col-6">
            <p className="body-large">{content}</p>
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
                Our mission is to ignite the spark within, guiding individuals
                toward self-discovery, empowerment, and spiritual growth. As
                Pakistan's first one-stop shop for spirituality and alternative
                healing, we weave ancient wisdom with modern practices to foster
                holistic well-being and connection. Let's awaken together!
              </p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

const COMP_MAP = {
  ComponentUiBanner: Hero,
  ComponentUiIntro: CustomIntro,
  ComponentPreachersFounders: Founders,
  ComponentUiTestimonials: Testimonials,
  ComponentUiFaqs: FAQ,
};

export default async function About() {
  const { sections } = await fetchStrapi({
    query: ABOUT_QUERY,
    key: "about",
  })();

  return (
    <section className="about-us">
      {sections.map(({ __typename: typename, ...props }, i) => {
        const Comp = COMP_MAP[typename];

        return Comp && <Comp key={i} {...props} />;
      })}
    </section>
  );
}
