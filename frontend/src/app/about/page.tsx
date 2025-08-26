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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                eleifend odio ut ante tristique, non pulvinar tellus tempor. In
                convallis accumsan ipsum. Nulla id lectus vitae nisl commodo
                molestie. Pellentesque vitae nunc leo. Ut libero risus,
                tristique a laoreet vitae, aliquam sed est.
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
