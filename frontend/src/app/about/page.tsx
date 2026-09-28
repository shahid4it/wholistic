import { fetchStrapi } from "@/utils/strapi";
import { Founders } from "../components/founders";
import { ABOUT_QUERY } from "@/queries/about";
import Hero from "../components/hero";
import Testimonials from "../components/testimonials";
import FAQ from "../components/faq";
import Section from "../components/section";

// The heading defaults to "About Us" only until an editor sets a title on
// this intro block in the CMS, so existing sites keep looking the same.
const CustomIntro = ({ title = "", content = "" }) => {
  return (
    <section className="introduction">
      <div className="container">
        <div className="row">
          <div className="col-2">
            <h3 className="section-title">{title || "About Us"}</h3>
          </div>
          <div className="col-6">
            <p className="body-large">{content}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const COMP_MAP = {
  ComponentUiBanner: Hero,
  ComponentUiIntro: CustomIntro,
  ComponentUiSection: Section,
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
