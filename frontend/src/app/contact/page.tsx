import Hero from "../components/hero";
import Testimonials from "../components/testimonials";
import FAQ from "../components/faq";
import Services from "../components/services";
import Introduction from "../components/introduction";
import { ContactForm } from "../components/ContactForm";
import { ContactDetails } from "../components/ContactDetails";
import { fetchStrapi } from "@/utils/strapi";
import { CONTACT_QUERY } from "@/queries/contact";
import { Preachers } from "../components/preachers";
import Section from "../components/section";
const COMP_MAP = {
  ComponentUiBanner: Hero,
  ComponentUiSection: Introduction,
  ComponentUiIntro: Section,
  ComponentUiTestimonials: Testimonials,
  ComponentUiFaqs: FAQ,
};
export default async function Contact() {
  const { sections } = await fetchStrapi({
    query: CONTACT_QUERY,
    key: "contact",
  })();
  return (
    <section className="home">
      {sections?.map(({ __typename: typename, ...props }, i) => {
        const Comp = COMP_MAP[typename];
        return Comp && <Comp key={i} {...props} />;
      })}
      <div className="section">
        <div className="container">
          <div className="col-8">
            <h2 className="contact-section__title">
            Get In Touch
          </h2></div>
        </div>
        <div className="container">
          <div className="contact-section__content">
            <div className="col-5">
            <ContactForm />
            </div>
            <div className="col-3">
            <ContactDetails />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
